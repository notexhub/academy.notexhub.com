import { Hind_Siliguri } from 'next/font/google';
import './globals.css';

const hind = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
});

export const metadata = {
  title: 'নোটেক্সহাব — বাংলাদেশের সেরা অনলাইন লার্নিং প্ল্যাটফর্ম',
  description: 'হাতে কলমে প্রজেক্ট শিখুন এবং দেশের সেরা কোম্পানিতে ক্যারিয়ার গড়ুন। NotexHub-এ আপনাকে স্বাগতম।',
  keywords: 'online learning, bangla course, web development, design, marketing, bangladesh',
  icons: {
    icon: '/favicon.png',
  },
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={hind.variable}>
      <body className={hind.className}>{children}</body>
    </html>
  );
}
