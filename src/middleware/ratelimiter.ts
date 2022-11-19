import { Request, Response } from 'express';

export default (requestsLimit: number, rateInSeconds: number) => {
  const ips: any = {};
  return (req: Request, res: Response, next: Function) => {
    if (!ips[req.ip]) {
      ips[req.ip] = requestsLimit - 1;
      setInterval(() => (ips[req.ip] = requestsLimit), 1000 * rateInSeconds);
      next();
      return;
    }
    if (ips[req.ip] === 0) {
      res.status(429).send('Too many requests, please try again later.');
      return;
    }
    ips[req.ip]--;
    next();
  };
};
