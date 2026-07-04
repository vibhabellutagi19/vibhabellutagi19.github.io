import Link from 'next/link';

const navItems = [
  { href: '/#experience', label: 'Experience' },
  { href: '/#writing', label: 'Writing' },
  { href: '/#about', label: 'About' },
  { href: '/blog/', label: 'Blog' },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="container shell-row">
        <Link className="brand-name" href="/">
          Vibhavari&nbsp;Bellutagi
        </Link>
        <nav>
          <ul className="inline-nav">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
