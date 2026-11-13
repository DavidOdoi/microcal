import { TrendingUp } from 'lucide-react';

export function Logo(_props: { inverted?: boolean } = {}) {
  return (
    <div className="brand-logo" aria-label="MicroFinancePost">
      <span className="brand-mark"><TrendingUp size={20} strokeWidth={2.8} /></span>
      <span className="brand-name">MicroFinance<span>Post</span></span>
    </div>
  );
}
