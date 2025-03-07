'use client';

import { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Auth } from 'firebase/auth';

export default function PostForm() {
  const [user] = useAuthState(auth as Auth);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('投稿するにはログインが必要です');
      return;
    }
    
    if (!content.trim()) {
      setError('投稿内容を入力してください');
      return;
    }
    
    if (!db) {
      setError('データベース接続エラー');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addDoc(collection(db, 'posts'), {
        content,
        userId: user.uid,
        userName: user.displayName || 'ユーザー',
        userPhotoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
      });
      
      setContent('');
      setIsSubmitting(false);
    } catch (error) {
      console.error('投稿エラー:', error);
      setError('投稿に失敗しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
        投稿するにはログインしてください
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-black mb-2">
          AIとの会話を共有
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black font-normal"
          rows={6}
          placeholder="AIとの会話内容をここに貼り付けてください..."
          disabled={isSubmitting}
        />
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isSubmitting ? '投稿中...' : '投稿する'}
      </button>
    </form>
  );
} 