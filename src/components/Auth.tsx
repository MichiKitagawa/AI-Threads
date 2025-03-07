'use client';

import { useState } from 'react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, Auth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProfileSettings from './ProfileSettings';

export default function Auth() {
  const [user, loading, error] = useAuthState(auth as Auth);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const signInWithGoogle = async () => {
    if (!auth) {
      setLoginError('認証サービスが利用できません');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setLoginError(null);
    } catch (error) {
      console.error('ログインエラー:', error);
      setLoginError('ログインに失敗しました。もう一度お試しください。');
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;

    try {
      await signOut(auth);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">エラーが発生しました: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      {/* デバッグ情報 */}
      {user && (
        <div className="hidden">
          <p>User: {user.displayName}</p>
          <p>Photo URL: {user.photoURL ? 'exists' : 'null'}</p>
        </div>
      )}
      
      {user ? (
        <div className="flex flex-col items-center gap-2">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-full"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span className="text-black font-medium">{user.displayName || 'ユーザー'}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            ログアウト
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={signInWithGoogle}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Googleでログイン
          </button>
          {loginError && <p className="text-red-500">{loginError}</p>}
        </div>
      )}

      <ProfileSettings 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
} 