import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
// import Sidebar from '@/components/Sidebar'; // Removed per redesign
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'ML Stock Predictor - Prakhar',
  description: 'An ML-based stock price predictor built with Next.js and Tailwind CSS.',
  icons: {
    icon: '/svg1.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 antialiased">
        <Navbar />
        {/* Main container now full width without sidebar */}
        <div className="flex min-h-screen flex-col md:flex-row mx-auto max-w-[1600px] px-4 md:px-8 py-6">
          {/* <Sidebar /> */}
          <main className="flex-1 bg-gray-950">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
