
import { http } from '../lib/http'

export default async function inviteUser(req, res) {
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxx=x=x=x=x=x=x')
  try {
    const response = await http.get('/some/request/')
    res.send(response.data)
  } catch (error) {
    const errReport = {  }
    res.status(500).send(errReport)
  }

}
