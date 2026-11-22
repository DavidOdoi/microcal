'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { Logo } from './Logo';

type MenuLink = { title: string; href: string };
type MenuGroup = { title: string; links: MenuLink[] };
export type MenuCategory = {
  slug: string;
  name: string;
  groups: MenuGroup[];
  planned: string[];
};

export function SiteHeader({ categories }: { categories: MenuCategory[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number>(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [, currentCategory, currentSlug] = pathname.split('/');

  function closeMenu() {
    window.clearTimeout(hoverTimer.current);
    setMobileOpen(false);
    setExpanded(null);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      window.clearTimeout(hoverTimer.current);
      if (expanded) {
        if (headerRef.current?.contains(document.activeElement)) {
          document.getElementById(`category-toggle-${expanded}`)?.focus();
        }
        setExpanded(null);
      } else if (mobileOpen) {
        setMobileOpen(false);
        mobileToggle.current?.focus();
      }
    };
    const handleOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeMenu();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handleOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handleOutside);
    };
  }, [expanded, mobileOpen]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    closeMenu();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  }

  function searchForm(className: string) {
    return (
      <form className={className} onSubmit={submitSearch} role="search">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          aria-label="Search calculators"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools"
        />
      </form>
    );
  }

  return (
    <header
      ref={headerRef}
      className="site-header"
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse'
          && !event.currentTarget.querySelector('.category-nav-item[data-expanded="true"]')?.contains(document.activeElement)) {
          setExpanded(null);
        }
      }}
    >
      <div className="container-site header-inner">
        <Link href="/" aria-label="MicroFinancePost home" onClick={closeMenu}>
          <Logo inverted />
        </Link>

        <button
          ref={mobileToggle}
          type="button"
          className="mobile-menu-button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="main-navigation"
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setExpanded(null);
          }}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav id="main-navigation" className="main-nav" aria-label="Main navigation" data-open={mobileOpen}>
          {searchForm('mobile-search')}
          <ul className="main-nav-list">
            {categories.map(({ slug, name, groups, planned }) => {
              const isExpanded = expanded === slug;
              const isCurrent = currentCategory === slug;
              return (
                <li
                  key={slug}
                  className="category-nav-item"
                  data-expanded={isExpanded}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setExpanded((value) => value === slug ? null : value);
                    }
                  }}
                >
                  <div className={`category-nav-control ${isCurrent || isExpanded ? 'nav-link-active' : ''}`}>
                    <Link
                      href={`/${slug}/`}
                      aria-current={isCurrent && !currentSlug ? 'page' : undefined}
                      onClick={closeMenu}
                      onPointerEnter={(event) => {
                        if (event.pointerType !== 'mouse' || !window.matchMedia('(min-width: 1024px)').matches) return;
                        // Give the pointer time to cross another row on its way to the panel.
                        hoverTimer.current = window.setTimeout(() => setExpanded(slug), expanded ? 180 : 0);
                      }}
                      onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
                    >
                      {name}
                    </Link>
                    <button
                      type="button"
                      id={`category-toggle-${slug}`}
                      aria-label={`Explore ${name}`}
                      aria-controls={`category-panel-${slug}`}
                      aria-expanded={isExpanded}
                      onClick={() => setExpanded(isExpanded ? null : slug)}
                    >
                      <ChevronDown size={14} aria-hidden="true" />
                    </button>
                  </div>
                  <div id={`category-panel-${slug}`} className="category-panel" hidden={!isExpanded}>
                    {isExpanded && (
                      <div className="category-panel-grid">
                        {groups.map(({ title, links }) => (
                          <div key={title}>
                            <h2>{title}</h2>
                            <ul className="category-panel-list">
                              {links.map(({ href, title: label }) => (
                                <li key={href}><Link href={href} onClick={closeMenu}>{label}</Link></li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {planned.length > 0 && (
                          <div>
                            <h2>Planned articles</h2>
                            <ul className="category-panel-list planned-articles">
                              {planned.map((title) => <li key={title}>{title}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
            <li>
              <div className={`category-nav-control ${currentCategory === 'about' ? 'nav-link-active' : ''}`}>
                <Link href="/about/" aria-current={currentCategory === 'about' ? 'page' : undefined} onClick={closeMenu}>
                  About
                </Link>
              </div>
            </li>
          </ul>
        </nav>

        {searchForm('header-search')}
      </div>
    </header>
  );
}
