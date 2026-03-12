const { BASE_URL, FRONTEND_URL } = require('../config/secrets');

const stripTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const isPublicHttpUrl = (value = '') => {
  return /^https?:\/\//i.test(value) && !/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(value);
};

const getForwardedHeader = (value) => {
  if (!value) {
    return '';
  }

  return value.split(',')[0].trim();
};

const getRequestOrigin = (req) => {
  const forwardedProto = getForwardedHeader(req.headers['x-forwarded-proto']);
  const forwardedHost = getForwardedHeader(req.headers['x-forwarded-host']);
  const host = forwardedHost || req.get('host');

  if (!host) {
    return '';
  }

  return `${forwardedProto || req.protocol || 'http'}://${host}`;
};

const getBackendBaseUrl = (req) => {
  if (isPublicHttpUrl(BASE_URL)) {
    return stripTrailingSlash(BASE_URL);
  }

  const requestOrigin = getRequestOrigin(req);
  if (requestOrigin) {
    return stripTrailingSlash(requestOrigin);
  }

  return stripTrailingSlash(BASE_URL || 'http://localhost:4000');
};

const getFrontendBaseUrl = (req) => {
  if (isPublicHttpUrl(FRONTEND_URL)) {
    return stripTrailingSlash(FRONTEND_URL);
  }

  const origin = req.get('origin');
  if (isPublicHttpUrl(origin)) {
    return stripTrailingSlash(origin);
  }

  return getBackendBaseUrl(req);
};

module.exports = {
  getBackendBaseUrl,
  getFrontendBaseUrl,
  stripTrailingSlash,
};