import { ReactNode } from 'react';
import './globals.css';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'MyProfile App',
  description: 'A modern profile management application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-white border-t py-4 text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} MyProfile App. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}