import { Request, Response, Router } from 'express';
import { RegistrationData } from '../models/registrationData';

export const router = Router({ mergeParams: true });

export async function handleRegisterOrgRoute(req: Request, res: Response): Promise<Response<{message: string}>> {
  const registrationData = req.body as RegistrationData;
  if (registrationData.dxNumber === '400') {
    res.status(400).send({ message: 'Dx Number is Invalid' });
  } else if (registrationData.dxNumber === '404') {
    return res.status(404).send({ message: 'Problem with the service. Please try again.' });
  } else if (registrationData.dxNumber === '500') {
    return res.status(500).send({ message: 'Problem with the service. Please try again.' });
  } else {
    res.status(200).send();
  }
}

router.post('/register', handleRegisterOrgRoute);

export default router;
