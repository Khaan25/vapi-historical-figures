import Link from 'next/link'

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Licensing', href: '/license' },
  { label: 'Contact', href: '/contact' },
] as const

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white rounded-lg shadow-sm m-4 dark:bg-gray-800">
      <div className="w-full mx-auto max-w-7xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {currentYear}{' '}
          <Link href="/" className="hover:underline">
            VAPI™
          </Link>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
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
