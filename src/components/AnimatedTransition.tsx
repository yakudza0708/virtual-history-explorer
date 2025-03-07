
import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface AnimatedTransitionProps {
  children: React.ReactNode;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({ children }) => {
  const location = useLocation();
  const prevLocationRef = useRef<string>(location.pathname);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    // Initial load animation
    if (containerRef.current) {
      containerRef.current.classList.add('animate-fade-in');
    }
  }, []);

  useEffect(() => {
    if (prevLocationRef.current !== location.pathname) {
      setIsTransitioning(true);
      
      // Play exit animation
      if (containerRef.current) {
        containerRef.current.classList.remove('animate-fade-in');
        containerRef.current.classList.add('animate-fade-out');
        
        const timeout = setTimeout(() => {
          if (containerRef.current) {
            // Update the ref to the current location
            prevLocationRef.current = location.pathname;
            
            // Reset and play entrance animation
            containerRef.current.classList.remove('animate-fade-out');
            containerRef.current.classList.add('animate-fade-in');
            
            setIsTransitioning(false);
          }
        }, 300); // Should match the duration of the fade-out animation
        
        return () => clearTimeout(timeout);
      }
    }
  }, [location.pathname]);

  return (
    <div 
      ref={containerRef} 
      className={`min-h-screen transition-all duration-300 ${isTransitioning ? 'pointer-events-none' : ''}`}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
