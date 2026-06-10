Web Vitals Monitoring
===================

This project now tracks Core Web Vitals metrics using the web-vitals library. Metrics are collected automatically on page load and logged to the browser console.

### Viewing Metrics

Open your browser's developer tools (F12) and navigate to the **Console** tab. You'll see output like:

```
[Web Vitals] {"name":"LCP","value":2468,"rating":"good","timestamp":1746681234567,"url":"/","userAgent":"Mozilla/5.0..."}
[Web Vitals] {"name":"INP","value":124,"rating":"good","timestamp":1746681234568,"url":"/","userAgent":"Mozilla/5.0..."}
[Web Vitals] {"name":"CLS","value":0.01,"rating":"good","timestamp":1746681234569,"url":"/","userAgent":"Mozilla/5.0..."}
```

### What Each Metric Means

- **LCP (Largest Contentful Paint)**: Time to render the largest content element. Target: < 2.5s
- **INP (Interaction to Next Paint)**: Response time to user interactions. Target: < 200ms
- **CLS (Cumulative Layout Shift)**: Visual stability score. Target: < 0.1

### Production Deployment

When deployed to production, metrics will still log to console. To send to analytics:

1. Replace console.log with fetch to your analytics endpoint
2. Or integrate with Sentry (see commented code in web-vitals.ts)

### Development Testing

Run `bun run dev` and navigate pages. Metrics appear automatically on page load and during interactions.