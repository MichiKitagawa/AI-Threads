import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Firebaseの設定
// 注: 実際のプロジェクトでは環境変数を使用することをお勧めします
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// クライアントサイドでのみFirebaseを初期化
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

// サーバーサイドレンダリング時にエラーが発生しないようにする
if (typeof window !== 'undefined') {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// ダミーのオブジェクトを作成（型チェックを通過させるため）
if (typeof window === 'undefined') {
  // @ts-ignore - サーバーサイドでは使用されないダミーオブジェクト
  app = {} as FirebaseApp;
  // @ts-ignore - サーバーサイドでは使用されないダミーオブジェクト
  db = {} as Firestore;
  // @ts-ignore - サーバーサイドでは使用されないダミーオブジェクト
  auth = {} as Auth;
}

export { app, db, auth }; 