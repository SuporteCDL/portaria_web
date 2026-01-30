import axios from "axios";

export const api = axios.create({
  baseURL: 'http://192.168.2.106:5555',
  timeout: 99000,
  headers: {
    'Content-Type': 'applications/json',
    'X-Custom-Header': 'foobar'
  }
})