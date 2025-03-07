'use client';

import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (isOpen && auth?.currentUser) {
      setDisplayName(auth.currentUser.displayName || '');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth?.currentUser) return;
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      // Firebaseの認証プロフィールを更新
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim() || 'ユーザー'
      });
      
      // Firestoreの既存の投稿のユーザー名は更新されないことに注意
      // 新しい投稿からは新しい名前が使用される
      
      setMessage({
        text: 'プロフィールを更新しました',
        type: 'success'
      });
      
      // 少し待ってからモーダルを閉じる
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      setMessage({
        text: '更新に失敗しました。もう一度お試しください。',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // デバッグ情報
  if (auth?.currentUser) {
    console.log('Current user:', auth.currentUser);
    console.log('Photo URL:', auth.currentUser.photoURL);
    console.log('Display Name:', auth.currentUser.displayName);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black">プロフィール設定</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-black mb-2">
              表示名
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="表示名を入力"
            />
          </div>
          
          <div className="mb-4">
            <p className="block text-sm font-medium text-black mb-2">
              アイコン
            </p>
            <div className="flex items-center">
              {/* 人型SVGアイコンを強制的に表示 */}
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {/* photoURLの条件を無視して常に人型アイコンを表示 */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <p className="ml-4 text-sm text-black">
                現在、アイコンの変更はサポートされていません
              </p>
            </div>
          </div>
          
          {message && (
            <div className={`p-3 rounded-md mb-4 ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-black"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? '更新中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 