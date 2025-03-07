'use client';

import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';

interface Post {
  id: string;
  content: string;
  userName: string;
  userPhotoURL: string;
  createdAt: Timestamp;
  isPinned?: boolean; // 固定投稿フラグを追加
}

// URL検出用の正規表現
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

// URLをリンクに変換する関数（修正版）
const convertUrlsToLinks = (text: string) => {
  // URLにマッチする部分とそれ以外の部分に分割
  const parts = [];
  let lastIndex = 0;
  let match;
  
  // 正規表現で順番にマッチを探す
  while ((match = URL_REGEX.exec(text)) !== null) {
    // マッチの前のテキストを追加
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // URLをリンクとして追加
    parts.push(
      <a 
        key={match.index} 
        href={match[0]} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:underline break-all"
      >
        {match[0]}
      </a>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // 残りのテキストを追加
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts;
};

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // dbがundefinedの場合は早期リターン
    if (!db) {
      setError('データベース接続エラー');
      setLoading(false);
      return () => {};
    }

    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        
        // 固定投稿を最上部に表示するために並べ替え
        const sortedPosts = postData.sort((a, b) => {
          // 両方とも固定投稿か両方とも固定投稿でない場合は日付で並べ替え
          if ((a.isPinned && b.isPinned) || (!a.isPinned && !b.isPinned)) {
            return b.createdAt.toMillis() - a.createdAt.toMillis();
          }
          // 固定投稿を優先
          return a.isPinned ? -1 : 1;
        });
        
        setPosts(sortedPosts);
        setLoading(false);
      },
      (err) => {
        console.error('投稿の取得エラー:', err);
        setError('投稿の読み込み中にエラーが発生しました');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center p-8">投稿を読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center p-8">まだ投稿がありません</div>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className={`bg-white p-4 rounded-lg shadow-md ${post.isPinned ? 'border-2 border-blue-500' : ''}`}
        >
          {/* 固定投稿バッジ */}
          {post.isPinned && (
            <div className="flex items-center mb-2 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-sm font-medium">固定投稿</span>
            </div>
          )}
          
          <div className="flex items-center mb-3">
            {/* 人型SVGアイコン */}
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-black">{post.userName}</h3>
              <p className="text-sm text-gray-700">
                {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString('ja-JP') : '日時不明'}
              </p>
            </div>
          </div>
          
          {/* URLをリンクに変換して表示 */}
          <div className="whitespace-pre-wrap text-black font-normal">
            {convertUrlsToLinks(post.content)}
          </div>
        </div>
      ))}
    </div>
  );
} 