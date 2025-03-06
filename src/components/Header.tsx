import Link from 'next/link';
import Auth from './Auth';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          AI会話共有
        </Link>
        <Auth />
      </div>
    </header>
  );
} 