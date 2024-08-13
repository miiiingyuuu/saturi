import Image from "next/image";
import {Box} from "@mui/material";

export default function Footer() {
  return (
    <footer 
      className="text-gray-400 text-center"
    >
      <Box className="flex flex-col items-center bg-gray-100">
        <Image
          src="/SSLogo.png" 
          width={100} 
          height={66.67} 
          alt="SSLogo" 
          className="mb-2.5 mt-10"
        />
        <Box className="flex gap-5 mt-2.5">
          <a href="/" className="text-gray-400 hover:underline">Home</a>
          <a href="/about" className="text-gray-400 hover:underline">About</a>
          <a href="/contact" className="text-gray-400 hover:underline">Contact</a>
        </Box>
        <p className="mt-2.5">&copy; 2024 My Next.js App. All rights reserved.</p>
      </Box>
    </footer>
  );
}