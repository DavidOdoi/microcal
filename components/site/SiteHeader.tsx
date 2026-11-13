'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import { calculators, calculatorsIn, categories } from '@/lib/site-data';
import { Logo } from './Logo';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [q, setQ] = useState('');

  const onCalculators = pathname?.startsWith('/calculators') ?? false;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMega(false);
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMega(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = q.trim();
    setOpen(false);
    setMega(false);
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  };

  return (
    <header className="site-header">
      <div className="container-site header-inner">
        <Link href="/" aria-label="MicroFinancePost home">
          <Logo inverted />
        </Link>

        <nav ref={navRef} className="desktop-nav" aria-label="Main navigation">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'nav-link-active' : ''}`}>
            Home
          </Link>

          <button
            type="button"
            className={`nav-link nav-dropdown ${mega || onCalculators ? 'nav-link-active' : ''}`}
            onMouseEnter={() => setMega(true)}
            onClick={() => setMega((value) => !value)}
            aria-expanded={mega}
          >
            Calculators
            <ChevronDown size={16} className={mega ? 'chevron-open' : ''} />
          </button>

          <Link href="/about" className={`nav-link ${pathname === '/about' ? 'nav-link-active' : ''}`}>
            About
          </Link>

          <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'nav-link-active' : ''}`}>
            Contact
          </Link>

          {mega ? (
            <div className="mega-menu">
              <div className="container-site mega-menu-inner">
                <div className="mega-grid">
                  {categories.map((category) => {
                    const items = calculatorsIn(category.slug);
                    return (
                      <div key={category.slug}>
                        <Link href={`/${category.slug}`} className="mega-title" onClick={() => setMega(false)}>
                          <category.icon size={16} />
                          <span>{category.name}</span>
                          <small>{items.length}</small>
                        </Link>
                        <ul className="mega-list">
                          {items.map((calculator) => (
                            <li key={calculator.slug}>
                              <Link href={`/calculators/${calculator.slug}`} onClick={() => setMega(false)}>
                                {calculator.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <div className="mega-footer">
                  <p>Free forever · No sign-up · Nothing you enter is stored.</p>
                  <Link href="/calculators" className="primary-button" onClick={() => setMega(false)}>
                    View all {calculators.length} calculators <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </nav>

        <form className="header-search" onSubmit={submitSearch}>
          <Search size={16} />
          <input
            aria-label="Search calculators"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search tools & topics"
          />
        </form>

        <button type="button" className="mobile-menu-button" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="mobile-menu">
          <div className="container-site mobile-menu-inner">
            <form onSubmit={submitSearch} className="mobile-search">
              <Search size={16} />
              <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search tools & topics" />
            </form>

            <div className="mobile-links">
              <Link href="/" onClick={() => setOpen(false)}>Home</Link>
              <Link href="/about" onClick={() => setOpen(false)}>About</Link>
              <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
              <Link href="/calculators" onClick={() => setOpen(false)}>All calculators</Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
