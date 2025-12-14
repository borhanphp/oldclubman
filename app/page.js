import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome to Old Club Man</h1>
      <div className="flex flex-col gap-4">
        <Link 
          href="/gathering" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-md transition-colors"
        >
          Go to Social Media
        </Link>
        <Link 
          href="/auth/login" 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-md transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
