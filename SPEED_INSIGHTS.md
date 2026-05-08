# Vercel Speed Insights Integration

## Overview

This project has been configured with **Vercel Speed Insights** to monitor and analyze web performance metrics based on Core Web Vitals.

## What is Speed Insights?

Speed Insights provides detailed performance metrics for your website, including:
- **LCP (Largest Contentful Paint)** - Loading performance
- **FID (First Input Delay)** - Interactivity
- **CLS (Cumulative Layout Shift)** - Visual stability
- **FCP (First Contentful Paint)** - Initial render

## Implementation Details

### Package Installed
```json
"@vercel/speed-insights": "^2.0.0"
```

### Files Modified/Created

1. **middleware/speedInsights.js** (NEW)
   - Middleware that automatically injects Speed Insights script into HTML responses
   - Only affects HTML content; API JSON responses are unaffected
   - Injects the tracking script before the closing `</body>` tag

2. **routes/speedInsightsDemo.js** (NEW)
   - Demo route at `/speed-insights/demo`
   - Displays a test HTML page with Speed Insights enabled
   - Shows available API endpoints and Speed Insights features

3. **server.js** (MODIFIED)
   - Added Speed Insights middleware to the Express app
   - Registered the demo route
   - Middleware is applied globally to all HTML responses

### How It Works

When the Express server responds with HTML content (Content-Type: text/html), the middleware automatically injects:

```html
<script>
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

This script:
- Loads asynchronously to not block page rendering
- Collects Core Web Vitals data from user interactions
- Sends performance metrics to Vercel's analytics dashboard

## Usage

### For API Endpoints (No Change)
All existing API endpoints continue to work exactly as before:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user/profile`
- `POST /api/images/upload`
- `GET /api/images`

JSON responses are **not affected** by the Speed Insights middleware.

### For HTML Pages
Any HTML content served by the application will automatically include Speed Insights tracking.

### Demo Page
Visit `/speed-insights/demo` to see a demonstration of Speed Insights in action.

## Viewing Analytics

1. Deploy your application to Vercel
2. Go to your Vercel dashboard
3. Select your project
4. Navigate to the "Speed Insights" tab
5. View real-time performance metrics and Core Web Vitals data

## Important Notes

- **Data Collection**: Speed Insights only collects data in production (when deployed to Vercel)
- **No Impact on APIs**: Pure JSON API responses are not modified
- **Privacy**: Only performance metrics are collected, no personal data
- **Performance**: The script is loaded asynchronously and has minimal impact on page load time

## Configuration

The Speed Insights integration is enabled by default. If you need to disable it temporarily, you can comment out the middleware in `server.js`:

```javascript
// app.use(injectSpeedInsights());
```

## Additional Resources

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Speed Insights Quickstart](https://vercel.com/docs/speed-insights/quickstart)

## Support

For issues or questions about Speed Insights:
- Check the [Vercel Documentation](https://vercel.com/docs)
- Visit the [Vercel Community](https://github.com/vercel/vercel/discussions)
