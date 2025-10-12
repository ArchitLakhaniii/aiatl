import { Facebook, Twitter, Instagram, Globe } from 'lucide-react';

export function Footer() {
  const links = [
    { label: 'About', href: '#' },
    { label: 'Support', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
  ];

  const socials = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Globe, href: '#' },
  ];

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 color:border-white/20 bg-white dark:bg-gray-900 color:bg-gradient-to-r color:from-indigo-600 color:to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-600 dark:text-gray-400 color:text-white/80 hover:text-teal-600 dark:hover:text-teal-400 color:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {socials.map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 color:bg-white/20 text-gray-600 dark:text-gray-400 color:text-white hover:scale-110 transition-transform"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 dark:text-gray-500 color:text-white/60">
          <p>© 2025 YABI. Connecting fans worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
