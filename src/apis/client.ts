import axios from "axios"

var url;
if (process.env.NODE_ENV === 'development') {
  url = 'http://localhost:3001/api/v1';

} else if (process.env.NODE_ENV === 'production') {
  url = 'https://photographar-rails-backend.herokuapp.com/api/v1';
}

export const client = axios.create({
  baseURL: url,
  withCredentials: true
})