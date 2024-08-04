import axios from 'axios';

const baseUrl = 'http://localhost:3001';
const headers = {"Content-Type": "application/json"};
const timeout = 10000;

const apiClient = axios.create({
  baseURL: baseUrl,
  headers,
  timeout,
});

export default apiClient;