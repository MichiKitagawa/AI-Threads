import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';

interface Post {
  id: string;
  content: string;
  userName: string;
  userPhotoURL: string;
  createdAt: Timestamp;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        
        setPosts(postData);
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
        <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-3">
            {post.userPhotoURL ? (
              <img
                src={post.userPhotoURL}
                alt={post.userName}
                className="w-10 h-10 rounded-full mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                <span className="text-gray-600">{post.userName.charAt(0)}</span>
              </div>
            )}
            <div>
              <h3 className="font-medium">{post.userName}</h3>
              <p className="text-sm text-gray-500">
                {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString('ja-JP') : '日時不明'}
              </p>
            </div>
          </div>
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>
      ))}
    </div>
  );
} 