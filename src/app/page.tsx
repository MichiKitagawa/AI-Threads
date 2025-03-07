'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import { Auth } from 'firebase/auth';

export default function Home() {
  const [user] = useAuthState(auth as Auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user || !db) {
        setIsAdmin(false);
        return;
      }

      try {
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminDoc = await getDoc(adminDocRef);
        setIsAdmin(adminDoc.exists());
      } catch (error) {
        console.error('管理者権限の確認中にエラーが発生しました:', error);
        setIsAdmin(false);
      }
    }

    checkAdminStatus();
  }, [user, db]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">AIとの会話を共有しよう</h1>
        
        {isAdmin && (
          <div className="max-w-3xl mx-auto mb-4">
            <div className="bg-red-100 p-4 rounded-lg text-center">
              <Link 
                href="/admin" 
                className="text-red-600 font-medium hover:underline"
              >
                管理者ページへ（固定投稿の作成）
              </Link>
            </div>
          </div>
        )}
        
        <div className="max-w-3xl mx-auto">
          <PostForm />
          <PostList />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
