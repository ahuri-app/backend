import { Router } from 'express';

import ratelimiter from './middleware/ratelimiter';

import authRegisterPOST from './routes/auth/register/POST';
import authLoginPOST from './routes/auth/login/POST';
import channelPOST from './routes/channel/POST';
import channelPARAMidGET from './routes/channel/[id]/GET';
import channelPARAMidDELETE from './routes/channel/[id]/DELETE';
import accountDELETE from './routes/account/DELETE';
import accountGET from './routes/account/GET';

const router = Router();

router.post('/auth/register', ratelimiter(20, 60), authRegisterPOST);
router.post('/auth/login', ratelimiter(30, 60), authLoginPOST);
router.post('/channel', ratelimiter(12, 60), channelPOST);
router.get('/channel/:id', ratelimiter(5, 1), channelPARAMidGET);
router.delete('/channel/:id', ratelimiter(12, 60), channelPARAMidDELETE);
router.delete('/account', ratelimiter(20, 60), accountDELETE);
router.get('/account', ratelimiter(30, 60), accountGET);

export default router;
