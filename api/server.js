const app = require('../server/index');

// Vercel serverless function handler
// Vercel expects a function that receives (req, res)
module.exports = (req, res) => {
  // Remove /api prefix from the path for Express routing
  req.url = req.url.replace(/^\/api/, '') || '/';
  return app(req, res);
};
