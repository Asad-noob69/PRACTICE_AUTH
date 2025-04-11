import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to My OAuth App</h1>
      <p>
        <Link href="/login">Go to Login Page</Link>
      </p>
    </div>
  );
}