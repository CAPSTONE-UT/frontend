import axios from 'axios';
import type { BaseResponse } from '@/types/api';

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError<BaseResponse>(error)) return fallback;
  const response = error.response?.data;
  const message = response?.message || fallback;
  const details = response?.error?.details;
  if (!details?.length) return message;
  return `${message}: ${details.map((detail) => `${detail.path}: ${detail.message}`).join('; ')}`;
}

export function getApiErrorCode(error: unknown) {
  if (!axios.isAxiosError<BaseResponse>(error)) return undefined;
  return error.response?.data?.error?.code;
}
