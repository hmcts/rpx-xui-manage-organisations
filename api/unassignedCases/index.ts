import { Request, Response, Router } from 'express'
import { createCases } from './unassingedCases-util'

export async function handleUnassignedCases(req: Request, res: Response) {
  const fakeUsers = createCases()
  res.send(fakeUsers)
}

export const router = Router({ mergeParams: true })

router.get('', handleUnassignedCases)

export default router
