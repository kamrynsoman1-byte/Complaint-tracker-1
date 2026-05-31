import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Complaints System - Enterprise Case Management',
  description: 'Track and resolve customer complaints efficiently.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 min-h-screen antialiased">{children}</body>
    </html>
  );
}