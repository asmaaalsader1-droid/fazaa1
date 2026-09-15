/**
 * products-store.js — طبقة مزامنة المنتجات مع Cloud Firestore
 * -----------------------------------------------------------
 * توفر واجهة موحّدة لقراءة/كتابة المنتجات:
 *  - المصدر الأساسي: مجموعة products في Firestore (إدارة مركزية من أي جهاز)
 *  - الاحتياطي: localStorage.allProducts (في حال انقطاع الاتصال)
 * تعتمد على firebase-client.js (يجب تحميله قبلها).
 */
(function () {
  const LS_KEY = 'allProducts';

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch (e) { return []; }
  }

  function writeLocal(products) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(products)); } catch (e) {}
  }

  function firestoreAvailable() {
    return !!(window.db && typeof window.db.collection === 'function');
  }

  /** جلب المنتجات: Firestore أولاً، ثم المحلي عند الفشل */
  window.storeGetProducts = async function () {
    if (firestoreAvailable()) {
      try {
        const snap = await window.db.collection('products').orderBy('order', 'asc').get();
        if (!snap.empty) {
          const items = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
          writeLocal(items); // مزامنة النسخة المحلية
          return items;
        }
      } catch (e) {
        console.warn('Firestore products read failed, using local:', e);
      }
    }
    return readLocal();
  };

  /** حفظ القائمة كاملة (إضافة/تعديل/حذف/إعادة ترتيب) */
  window.storeSaveProducts = async function (products) {
    writeLocal(products); // تحديث فوري محلياً
    if (!firestoreAvailable()) return false;
    try {
      const col = window.db.collection('products');
      const existing = await col.get();
      const batch = window.db.batch();
      // حذف الوثائق التي لم تعد موجودة
      const keepIds = new Set(products.filter(p => p._id).map(p => p._id));
      existing.docs.forEach(doc => {
        if (!keepIds.has(doc.id)) batch.delete(doc.ref);
      });
      // كتابة/تحديث كل المنتجات مع ترتيبها
      products.forEach((p, i) => {
        const data = {
          name: p.name, desc: p.desc, price: p.price, img: p.img,
          order: i,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        if (p._id) {
          batch.set(col.doc(p._id), data, { merge: true });
        } else {
          batch.set(col.doc(), { ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
        }
      });
      await batch.commit();
      return true;
    } catch (e) {
      console.error('Firestore products save failed:', e);
      return false;
    }
  };

  /** الاستماع اللحظي لتغييرات المنتجات (لتحديث واجهة العميل مباشرة) */
  window.storeWatchProducts = function (onChange) {
    if (!firestoreAvailable()) return function () {};
    try {
      return window.db.collection('products').orderBy('order', 'asc')
        .onSnapshot((snap) => {
          if (!snap.empty) {
            const items = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
            writeLocal(items);
            onChange(items);
          }
        }, (err) => console.warn('products watch error:', err));
    } catch (e) {
      return function () {};
    }
  };
})();
