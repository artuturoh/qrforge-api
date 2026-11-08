/**
 * RapidAPI Proxy Secret Validation Middleware
 *
 * Enforces X-RapidAPI-Proxy-Secret on /v1/* endpoints when RAPIDAPI_PROXY_SECRET is set.
 * Exemption granted to /v1/demo to power the live interactive landing page playground.
 * Always bypasses /health and /.
 */
export function rapidapiAuth(req, res, next) {
  const secret = process.env.RAPIDAPI_PROXY_SECRET;

  // If secret is not configured in the environment, bypass check (dev / standalone mode)
  if (!secret) {
    return next();
  }

  // Paths that are always public
  const path = req.path;
  if (path === '/' || path === '/health' || path === '/v1/demo') {
    return next();
  }

  // Protect /v1/* endpoints
  if (path.startsWith('/v1')) {
    const incomingSecret = req.headers['x-rapidapi-proxy-secret'];

    if (!incomingSecret || incomingSecret !== secret) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or missing X-RapidAPI-Proxy-Secret header'
        }
      });
    }
  }

  return next();
}
