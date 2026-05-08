/**
 * Speed Insights Middleware for Express
 * 
 * This middleware injects Vercel Speed Insights script into HTML responses.
 * Speed Insights tracks Core Web Vitals and performance metrics for web pages.
 * 
 * For pure API responses (JSON), this middleware does nothing.
 * For HTML responses, it injects the Speed Insights script before </body>
 */

const injectSpeedInsights = () => {
  return (req, res, next) => {
    // Store the original send function
    const originalSend = res.send;

    // Override the send function
    res.send = function (data) {
      // Only inject if response is HTML
      const contentType = res.get('Content-Type');
      
      if (contentType && contentType.includes('text/html') && typeof data === 'string') {
        // Speed Insights script injection
        const speedInsightsScript = `
    <script>
      window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/speed-insights/script.js"></script>`;
        
        // Inject before closing body tag
        if (data.includes('</body>')) {
          data = data.replace('</body>', `${speedInsightsScript}\n  </body>`);
        } else if (data.includes('</html>')) {
          // Fallback: inject before closing html tag
          data = data.replace('</html>', `${speedInsightsScript}\n</html>`);
        }
      }

      // Call the original send function
      originalSend.call(this, data);
    };

    next();
  };
};

module.exports = injectSpeedInsights;
