import './globals.css';

export const metadata = {
  title: 'Complaints System - Enterprise Case Management',
  description: 'Track and resolve customer complaints efficiently with our enterprise-grade case management system.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}