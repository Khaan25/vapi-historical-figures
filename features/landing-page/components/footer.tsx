import Link from 'next/link'

const footerLinks = [
  { label: 'Zia U. (Developer)', href: 'https://v2-zzia.vercel.app' },
] as const

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background mx-auto max-w-7xl rounded-lg border border-border m-4">
      <div className="w-full p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-muted-foreground sm:text-center">
          © {currentYear}{' '}
          <Link href="/" className="hover:underline">
            Echoes of the Past
          </Link>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-muted-foreground sm:mt-0">
          {footerLinks.map((link, index) => (
            <li key={link.href}>
              <Link href={link.href} className={`hover:underline ${index !== footerLinks.length - 1 ? 'me-4 md:me-6' : ''}`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
