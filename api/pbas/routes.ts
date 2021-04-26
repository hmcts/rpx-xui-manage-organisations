import * as express from 'express'
import authInterceptor from '../lib/middleware/auth'
import { addPBA, deletePBA, getPBA, updatePBA } from './index'

export const router = express.Router({mergeParams: true})

router.use(authInterceptor)
router.post('/addPBA', addPBA)
router.delete('/deletePBA', deletePBA)
router.put('/updatePBA', updatePBA)
router.get('/getPBA', getPBA)
