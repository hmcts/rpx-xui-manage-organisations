import * as express from 'express';
import { addDeletePBA, addPBA, deletePBA, getPBA, updatePBA } from '.';
import authInterceptor from '../lib/middleware/auth';

export const router = express.Router({ mergeParams: true });

router.use(authInterceptor);
router.post('/addDeletePBA', addDeletePBA);
router.post('/addPBA', addPBA);
router.delete('/deletePBA', deletePBA);
router.put('/updatePBA', updatePBA);
router.get('/getPBA', getPBA);
