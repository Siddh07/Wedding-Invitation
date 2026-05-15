import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sumit & Prerna - Wedding Invitation',
  description: 'You are cordially invited to celebrate the wedding of Sumit Shrestha and Prerna Pradhan',
  keywords: ['wedding', 'invitation', 'Sumit Shrestha', 'Prerna Pradhan', 'wedding invitation'],
  authors: [{ name: 'Sumit & Prerna' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    title: 'Sumit & Prerna - Wedding Invitation',
    description: 'You are cordially invited to celebrate the wedding of Sumit Shrestha and Prerna Pradhan',
    url: 'https://sudhabilip.com',
    siteName: 'Sumit & Prerna Wedding',
    images: [
      {
        url: '/assets/Intro-image.png',
        width: 1200,
        height: 630,
        alt: 'Sumit & Prerna Wedding Invitation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sumit & Prerna - Wedding Invitation',
    description: 'You are cordially invited to celebrate the wedding of Sumit Shrestha and Prerna Pradhan',
    images: ['/assets/Intro-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Great+Vibes&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
        <style>{`
          .font-script { font-family: 'Great Vibes', cursive; }
          .font-serif { font-family: 'Cormorant Garamond', serif; }
          .font-sans { font-family: 'Inter', sans-serif; }
        `}</style>
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}