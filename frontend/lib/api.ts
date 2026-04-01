import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

function extractErrorMessage(errorData: any): string {
  if (!errorData) return 'Request failed';
  if (typeof errorData === 'string') return errorData;
  if (typeof errorData?.message === 'string') return errorData.message;
  if (typeof errorData?.error === 'string') return errorData.error;
  if (typeof errorData?.detail === 'string') return errorData.detail;
  return 'Request failed';
}

type ApiClient = Omit<AxiosInstance, 'get' | 'post' | 'put' | 'patch' | 'delete'> & {
  get<TResponse = any>(url: string, config?: AxiosRequestConfig): Promise<TResponse>;
  post<TResponse = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<TResponse>;
  put<TResponse = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<TResponse>;
  patch<TResponse = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<TResponse>;
  delete<TResponse = any>(url: string, config?: AxiosRequestConfig): Promise<TResponse>;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
}) as ApiClient;

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error?.response?.data ?? error;
    const err = new Error(extractErrorMessage(errorData));
    (err as any).status = error?.response?.status;
    (err as any).data = error?.response?.data;
    return Promise.reject(err);
  }
);

export default api;
