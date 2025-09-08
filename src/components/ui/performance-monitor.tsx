import { useEffect } from 'react';

// Performance monitoring component for production optimization
export const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Ignore if not supported
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Type assertion for first-input entries
          const fidEntry = entry as any;
          if (fidEntry.processingStart) {
            console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
          }
        }
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Ignore if not supported
      }

      // Cleanup
      return () => {
        observer.disconnect();
        fidObserver.disconnect();
      };
    }
  }, []);

  return null;
};