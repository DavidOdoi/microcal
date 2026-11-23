'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  return (
    <form
      className="search-launch"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
      }}
    >
      <Search size={18} />
      <input
        aria-label="Search calculators"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="What do you want to calculate?"
      />
      <button type="submit">Search</button>
    </form>
  );
}
