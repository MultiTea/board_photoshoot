'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments =
    pathname?.split('/').filter((segment) => segment !== '') || [];

  return (
    <nav>
      <ol className="flex">
        <li>
          <Link href="/" className="text-blue-500 hover:underline">
            Accueil
          </Link>
        </li>
        {pathSegments.map((segment, index) => (
          <li key={index}>
            <span className="mx-2">/</span>
            <Link
              href={`/${pathSegments.slice(0, index + 1).join('/')}`}
              className="text-blue-500 hover:underline"
            >
              {segment}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
