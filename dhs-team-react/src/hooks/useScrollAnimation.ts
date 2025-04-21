
import { useEffect } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
    // Function to check if element is in viewport
    const checkIfInView = () => {
      const elements = document.querySelectorAll('.reveal, .stagger-children, .assemble');
      
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        
        // Element is considered in view if it's top is below 20% of the viewport
        // and its bottom is above -20% of the viewport (meaning it has passed into view)
        if (rect.top < viewHeight * 0.8 && rect.bottom > -viewHeight * 0.2) {
          element.classList.add('active');
          
          // For animated backgrounds, add a special class
          if (element.classList.contains('animate-bg')) {
            setTimeout(() => {
              element.classList.add('bg-animate');
            }, 300);
          }
        }
      });
    };

    // Initial check
    setTimeout(checkIfInView, 300);
    
    // Check on scroll with throttling for performance
    let scrollTimeout;
    const handleScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          checkIfInView();
          scrollTimeout = null;
        }, 100);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
}

export default useScrollAnimation;
