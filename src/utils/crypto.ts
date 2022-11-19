import { createHash } from 'crypto';

function salt(valueToSalt: string) {
  return valueToSalt + process.env.SALT;
}

function hash(valueToHash: string) {
  return createHash('sha256').update(valueToHash).digest('hex');
}

export { salt, hash };
export default { salt, hash };
