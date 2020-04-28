import axios, { AxiosInstance } from 'axios'
import { Request } from 'express'
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors'
import {exists} from './util'

axios.defaults.headers.common['Content-Type'] = 'application/json'

export const http = (req: Request) => {

  const headers = {}

  if (exists(req, 'session.auth.token')) {
    headers['Authorization'] = `Bearer ${req.session.auth.token}`
  }

  if (exists(req, 'session.auth.roles')) {
    headers['user-roles'] = req.session.auth.roles
  }

  const axiosInstance: AxiosInstance = axios.create({
    headers
  })
  axiosInstance.interceptors.request.use(requestInterceptor)
  axiosInstance.interceptors.response.use(successInterceptor, errorInterceptor)

  return axiosInstance
}
