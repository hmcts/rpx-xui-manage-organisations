import { Request, Response, Router } from 'express';

export const router = Router({ mergeParams: true });

export async function handleRegisterOrgRoute(req: Request, res: Response) {
  res.status(200).send();
}

router.post('/register', handleRegisterOrgRoute);

export default router;
