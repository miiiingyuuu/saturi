import Image from "next/image";

export default function Footer() {
  return (
    <footer className="text-gray-400 text-center mt-5 py-5">
      <div className="flex flex-col items-center">
        <Image 
          src="/SSLogo.png" 
          width={100} 
          height={66.67} 
          alt="SSLogo" 
          className="mb-2.5"
        />
        <div className="flex gap-5 mt-2.5">
          <a href="/" className="text-gray-400 hover:underline">Home</a>
          <a href="/about" className="text-gray-400 hover:underline">About</a>
          <a href="/contact" className="text-gray-400 hover:underline">Contact</a>
        </div>
        <p className="mt-2.5">&copy; 2024 My Next.js App. All rights reserved.</p>
      </div>
    </footer>
  );
}