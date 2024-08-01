import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Image src="/SSLogo.png" width={127.5} height={85} alt="SSLogo" />
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
        <p>&copy; 2024 My Next.js App. All rights reserved.</p>
      </div>
    </footer>
  );
}
