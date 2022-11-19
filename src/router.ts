import { Router } from 'express';

import ratelimiter from './middleware/ratelimiter';

import authRegisterPOST from './routes/auth/register/POST';

const router = Router();

router.post('/auth/register', ratelimiter(20, 60), authRegisterPOST);

export default router;
