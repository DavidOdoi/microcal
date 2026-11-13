import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-site section-block not-found">
      <h1>Page not found</h1>
      <p>The page or calculator you requested does not exist.</p>
      <Link href="/" className="primary-button">
        Return home
      </Link>
    </div>
  );
}
