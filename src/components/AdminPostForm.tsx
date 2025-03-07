'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AdminPostForm() {
  // authがundefinedの場合はnullを渡す
  const [user] = useAuthState(auth as any);
  const [content, setContent] = useState('');
  const isPinned = true;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Firestoreから管理者情報を取得
  useEffect(() => {
    async function checkAdminStatus() {
      if (!user || !db) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminDoc = await getDoc(adminDocRef);
        setIsAdmin(adminDoc.exists());
      } catch (error) {
        console.error('管理者権限の確認中にエラーが発生しました:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  if (loading) {
    return <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center">読み込み中...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="bg-yellow-100 p-4 rounded-lg mb-6 text-center">
        <p className="text-yellow-800">管理者専用機能です。管理者アカウントでログインしてください。</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        userId: user?.uid ?? '',
        userName: '管理者', // 管理者として表示
        userPhotoURL: '',
        createdAt: serverTimestamp(),
        isPinned, // 固定投稿フラグ
      });
      
      setContent('');
      setIsSubmitting(false);
      alert('固定投稿を作成しました！');
    } catch (error) {
      console.error('投稿エラー:', error);
      setError('投稿に失敗しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 border-2 border-red-500">
      <h2 className="text-xl font-bold mb-4 text-red-600">固定投稿作成フォーム（管理者専用）</h2>
      
      <div className="mb-4">
        <label htmlFor="adminContent" className="block text-sm font-medium text-black mb-2">
          固定投稿内容
        </label>
        <textarea
          id="adminContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black font-normal"
          rows={6}
          placeholder="寄付のお願いなど、固定表示したい内容を入力..."
          disabled={isSubmitting}
        />
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isSubmitting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {isSubmitting ? '投稿中...' : '固定投稿を作成する'}
      </button>
    </form>
  );
} 