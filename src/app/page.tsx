'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">AIとの会話を共有しよう</h1>
        
        <div className="max-w-3xl mx-auto">
          <PostForm />
          <PostList />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
