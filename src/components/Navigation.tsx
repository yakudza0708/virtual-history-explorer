
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navigationItems = [
    { name: 'Главная', path: '/' },
    { name: 'Виртуальный тур', path: '/tour' },
    { name: 'Хронология', path: '/timeline' },
    { name: 'О проекте', path: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 glass' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2"
          >
            <span className="relative">
              <span className="animate-rotate-center absolute inset-0 border-2 border-primary/50 rounded-full" />
              <span className="block w-8 h-8 rounded-full bg-primary" />
            </span>
            <span className="relative group">
              <span className="block transition-transform group-hover:translate-y-1 opacity-0 group-hover:opacity-100 absolute h-0.5 w-full bg-primary duration-300" />
              ЛЭТИ Тур
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? 'text-primary font-medium' : 'text-foreground/80'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-2xl py-4 ${
                location.pathname === item.path ? 'text-primary font-medium' : 'text-foreground/80'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
