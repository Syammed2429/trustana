'use client';

import { useEffect } from 'react';

interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function WebVitals() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Import web-vitals dynamically to avoid SSR issues
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        const reportWebVital = (metric: WebVitalMetric) => {
          console.log('Web Vital:', metric);

          // In a real application, you would send this to your analytics service
          // Example: gtag('event', metric.name, { value: metric.value })
          // Or: analytics.track('Web Vital', metric)

          // For now, we'll just log to console and could send to an endpoint
          if (process.env.NODE_ENV === 'production') {
            fetch('/api/analytics/web-vitals', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(metric),
            }).catch(console.error);
          }
        };

        // Track all Core Web Vitals
        onCLS(reportWebVital); // Cumulative Layout Shift
        onINP(reportWebVital); // Interaction to Next Paint (replaces FID)
        onFCP(reportWebVital); // First Contentful Paint
        onLCP(reportWebVital); // Largest Contentful Paint
        onTTFB(reportWebVital); // Time to First Byte
      });
    }
  }, []);

  return null; // This component doesn't render anything
}

// Custom hook for tracking custom metrics
export function useCustomMetrics() {
  const trackCustomMetric = (
    name: string,
    value: number,
    additionalData?: Record<string, unknown>
  ) => {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...additionalData,
    };

    console.log('Custom Metric:', metric);

    // Send to analytics service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/custom-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      }).catch(console.error);
    }
  };

  return { trackCustomMetric };
}
