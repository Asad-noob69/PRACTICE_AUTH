import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: 'My OAuth App',
  description: 'A Next.js app to practice OAuth with GitHub',
};