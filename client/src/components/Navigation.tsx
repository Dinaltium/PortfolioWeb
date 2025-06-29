import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="fixed top-0 w-full z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 transition-all duration-300">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-300"
          >
            AAF11
          </motion.h1>
          <div className="hidden md:flex items-center bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-2 space-x-6 hover:bg-gray-800/50 transition-all duration-300">
            <Link 
              href="/" 
              className={`nav-link ${location === '/' ? 'active-nav-link' : ''}`}
            >
              HOME
            </Link>
            <Link 
              href="/shop" 
              className={`nav-link ${location === '/shop' ? 'active-nav-link' : ''}`}
            >
              SHOP
            </Link>
            <Link 
              href="/help" 
              className={`nav-link ${location === '/help' ? 'active-nav-link' : ''}`}
            >
              GET OUR HELP
            </Link>
            <Link 
              href="/about" 
              className={`nav-link ${location === '/about' ? 'active-nav-link' : ''}`}
            >
              ABOUT US
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}