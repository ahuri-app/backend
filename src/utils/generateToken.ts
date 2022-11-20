import { randomBytes } from 'crypto';

export default (length: number) => {
  return randomBytes(length).toString('base64');
};
