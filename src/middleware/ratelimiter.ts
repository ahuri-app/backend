import expressRateLimit from 'express-rate-limit';

export default (requestsLimit: number, rateInSeconds: number) => {
  return expressRateLimit({
    windowMs: rateInSeconds * 1000,
    max: requestsLimit,
    standardHeaders: true,
    legacyHeaders: false,
  });
};
