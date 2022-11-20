import { Router } from 'express';

import ratelimiter from './middleware/ratelimiter';

import authRegisterPOST from './routes/auth/register/POST';
import authLoginPOST from './routes/auth/login/POST';
import channelPOST from './routes/channel/POST';
import channelPARAMidGET from './routes/channel/[id]/GET';

const router = Router();

router.post('/auth/register', ratelimiter(20, 60), authRegisterPOST);
router.post('/auth/login', ratelimiter(30, 60), authLoginPOST);
router.post('/channel', ratelimiter(10, 60), channelPOST);
router.get('/channel/:id', ratelimiter(4, 1), channelPARAMidGET);

export default router;
