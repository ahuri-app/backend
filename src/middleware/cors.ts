import { Response } from 'express';

export default (_: any, res: Response, next: Function) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
};
