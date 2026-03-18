import api from './api';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

export const fetchTasksApi = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
};

export const createTaskApi = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await api.post<Task>('/tasks', payload);
  return response.data;
};

export const updateTaskApi = async ({ id, ...payload }: UpdateTaskPayload): Promise<Task> => {
  const response = await api.put<Task>(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTaskApi = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
