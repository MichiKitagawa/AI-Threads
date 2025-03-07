'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdminPostForm from '../../components/AdminPostForm';

export default function AdminPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
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
        setIsCheckingAdmin(false);
      }
    }

    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && !isCheckingAdmin && !isAdmin) {
      // 管理者でなければホームにリダイレクト
      router.push('/');
    }
  }, [isAdmin, isCheckingAdmin, loading, router]);

  if (loading || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center p-8">読み込み中...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center p-8">アクセス権限がありません</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">管理者ページ</h1>
        
        <div className="max-w-3xl mx-auto">
          <AdminPostForm />
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-black">管理者メニュー</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-600 hover:underline">
                  ホームに戻る
                </Link>
              </li>
              {/* 他の管理機能へのリンクをここに追加 */}
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 