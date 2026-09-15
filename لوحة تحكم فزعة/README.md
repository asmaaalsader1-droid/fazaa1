# لوحة تحكم فزعة (FAZAA Dashboard)

لوحة تحكم مستقلة كلياً عن موقع العملاء. تتصل مباشرة بمشروع Firebase الخاص بموقع فزعة (`fazaa-e035d`) عبر **Firestore فقط** — لا تحتاج أي RTDB.

## المتطلبات قبل التشغيل
1. **تسجيل دخول المدير**: فعّل `Email/Password` في Firebase Authentication وأضف مستخدم مدير (بريد + كلمة مرور).
2. **قواعد Firestore**: ⚠️ **مهم جداً** — القواعد الحالية على المشروع القديم `fazaa-a906d` كانت تمنع **كل** الوصول (قراءة وكتابة، حتى لموقع العملاء) كما تأكدنا بالاختبار الفعلي. في المشروع الجديد `fazaa-e035d` تأكد من ضبط القواعد من **Firebase Console ← Firestore Database ← Rules** كما يلي:
   ```js
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /pays/{docId} {
         allow read, update, delete: if request.auth != null;
         allow create: if true;   // يسمح لنموذج الزائر بالكتابة بدون حساب
       }
       match /commands/{docId} {
         allow read, update: if request.auth != null;
         allow create: if true;
       }
       match /products/{docId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
   **ملاحظات حاسمة:**
   - إن كان **App Check** مفعلاً، عطّله أو أضف provider للمتصفحات، وإلا ستبقى كل الطلبات مرفوضة.
   - بدّل `allow read: if request.auth != null` إلى شرط بريد محدد (مثل `&& request.auth.token.email == 'admin@fazaa.com'`) إذا أردت تقييد اللوحة لحساب واحد.

## ملاحظة المشروع الجديد fazaa-e035d
- المشروع الجديد **جديد تماماً**، لذلك يجب:
  1. **تمكين Firestore Database** من Firebase Console (Create database → production mode/أو test وتعديلها لاحقاً).
  2. **تمكين Authentication** بطرق تسجيل الدخول `Email/Password` وإضافة مستخدم المدير.
  3. **ضبط القواعد** أعلاه لقراءة اللوحة وكتابة الزوار.
  4. **تعطيل App Check** إن كان مفعلاً افتراضياً في المشروع الجديد (أو إضافة provider).

## المجموعات المستخدمة
| المجموعة | الاستخدام |
|---|---|
| `pays` | تُقرأ الطلبات (يكتبها موقع العملاء) وتُحدَّث قراراتها (موافقة/رفض/حظر/أرشفة) |
| `commands` | أوامر توجيه الزائر (يقرأها موقع العملاء إن طُبِّق) |
| `products` | حزم البطاقات (اختياري — لإدارة الحزم) |

## النشر
- مجلد اللوحة **مستقل تماماً** ويُرفع كما هو إلى Netlify / Vercel / أي استضافة static.
- ملف `netlify.toml` جاهز لإعادة التوجيه.

## الهيكل
```
index.html                  الواجهة الرئيسية
assets/js/firebase-config.js   مفاتيح مشروع فزعة (لا تعدّل إلا إذا غيّرت المشروع)
assets/js/app.js               منطق اللوحة (قراءة pays + القرارات + التوجيه)
assets/js/products.js          إدارة الحزم
assets/css/panel.css           الأنماط
```