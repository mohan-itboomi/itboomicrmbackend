const sanitize = value => {
  if (Array.isArray(value)) return value.map(sanitize);
  if (!value || typeof value !== 'object') return typeof value === 'string' ? value.trim() : value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !key.startsWith('$') && !key.includes('.')).map(([key, item]) => [key, sanitize(item)]));
};

const sanitizeRequest = (req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  next();
};

module.exports = { sanitizeRequest };