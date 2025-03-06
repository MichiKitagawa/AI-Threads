export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} AI会話共有プラットフォーム</p>
        <p className="text-sm mt-2">AIとの会話を共有して、知識を広げよう</p>
      </div>
    </footer>
  );
} 