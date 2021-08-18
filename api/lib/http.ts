import axios, { AxiosInstance } from 'axios'
import { Request } from 'express'
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors'
import {exists} from './util'

axios.defaults.headers.common['Content-Type'] = 'application/json'

export const http = (req: Request) => {

  const headers = {}

  if (req.headers) {
    if (exists(req, 'headers.Authorization')) {
      headers['Authorization'] = req.headers.Authorization
    }

    if (req.headers['user-roles'] && req.headers['user-roles'].length) {
      headers['user-roles'] = req.headers['user-roles']
    }

    if (exists(req, 'headers.ServiceAuthorization')) {
      headers['ServiceAuthorization'] = req.headers.ServiceAuthorization
    }
  }

  const axiosInstance: AxiosInstance = axios.create({
    headers,
  })
  axiosInstance.interceptors.request.use(requestInterceptor)
  axiosInstance.interceptors.response.use(successInterceptor, errorInterceptor)

  return axiosInstance
}
