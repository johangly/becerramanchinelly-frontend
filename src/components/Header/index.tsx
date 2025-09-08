import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import './styles.css';

const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Acerca de', href: '/about' },
  { name: 'Servicios', href: '/services' },
  { name: 'Contacto', href: '/contact' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuVariants:Variants = {
    open: { 
      opacity: 1,
      x: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      opacity: 0,
      x: 100,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <a href="/">Becerra Manchinelly</a>
        </div>

        {isMobile ? (
          <button 
            className="menu-button" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        ) : (
          <nav className="desktop-nav">
            <ul>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="nav-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="auth-buttons">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="sign-in-button">Iniciar Sesión</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </nav>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            className="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <nav className="mobile-nav">
              <ul>
                {navLinks.map((link) => (
                  <motion.li 
                    key={link.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a 
                      href={link.href} 
                      className="mobile-nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
                <li className="auth-buttons-mobile">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="sign-in-button">Iniciar Sesión</button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
