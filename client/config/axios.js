import axios from 'axios';

export default axios.create({
  // baseURL: 'http://localhost:3000/'
  baseURL: "https://kanbanpratamagung.herokuapp.com/"
})