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
type MenuSection = MenuCategory & { subcategories: MenuCategory[] };

export function SiteHeader({ sections }: { sections: MenuSection[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [, currentCategory, currentSlug] = pathname.split('/');

  function closeMenu() {
    setMobileOpen(false);
    setExpanded(null);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
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
          placeholder="Search"
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
            {sections.map((section) => {
              const { slug, name, subcategories } = section;
              const isExpanded = expanded === slug;
              const isCurrent = currentCategory === slug;
              const isActive = isCurrent || subcategories.some((category) => category.slug === currentCategory);
              const isGrouped = subcategories.length > 0;
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
                  <div className={`category-nav-control ${isActive || isExpanded ? 'nav-link-active' : ''}`}>
                    <Link
                      href={`/${slug}/`}
                      aria-current={isCurrent && !currentSlug ? 'page' : undefined}
                      onClick={closeMenu}
                      onPointerEnter={(event) => {
                        if (event.pointerType === 'mouse' && window.matchMedia('(min-width: 70em)').matches) {
                          setExpanded(slug);
                        }
                      }}
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
                    {isGrouped && (
                      <ul className="category-panel-links" aria-label={`${name} categories`}>
                        {subcategories.map((category) => (
                          <li key={category.slug}>
                            <Link
                              href={`/${category.slug}/`}
                              aria-current={currentCategory === category.slug && !currentSlug ? 'page' : undefined}
                              onClick={closeMenu}
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    {isExpanded && (
                      <div className={isGrouped ? 'category-panel-sections' : undefined}>
                        {[section, ...subcategories].map((category) => (
                          <div key={category.slug}>
                            {isGrouped && <h2 className="category-panel-title">{category.name}</h2>}
                            <CategoryMenuContent category={category} grouped={isGrouped} onNavigate={closeMenu} />
                          </div>
                        ))}
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

function CategoryMenuContent({ category, grouped, onNavigate }: {
  category: MenuCategory;
  grouped: boolean;
  onNavigate: () => void;
}) {
  const Heading = grouped ? 'h3' : 'h2';
  return (
    <div className="category-panel-grid">
      {category.groups.map(({ title, links }) => (
        <div key={title}>
          <Heading>{title}</Heading>
          <ul className="category-panel-list">
            {links.map(({ href, title: label }) => (
              <li key={href}><Link href={href} onClick={onNavigate}>{label}</Link></li>
            ))}
          </ul>
        </div>
      ))}
      {category.planned.length > 0 && (
        <div>
          <Heading>Planned articles</Heading>
          <ul className="category-panel-list planned-articles">
            {category.planned.map((title) => <li key={title}>{title}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
