import axios from "axios";
import { httpServer } from "@/app/lib/httpServer";

const HTTP_SERVER = httpServer();
const ASSIGNMENT_API = `${HTTP_SERVER}/lab5/assignment`;
const TODOS_API = `${HTTP_SERVER}/lab5/todos`;

export const fetchWelcomeMessage = async () => {
  const response = await axios.get(`${HTTP_SERVER}/lab5/welcome`);
  return response.data;
};

export const fetchAssignment = async () => {
  const response = await axios.get(ASSIGNMENT_API);
  return response.data;
};

export const updateTitle = async (title: string) => {
  const response = await axios.get(`${ASSIGNMENT_API}/title/${title}`);
  return response.data;
};

export const fetchTodos = async () => {
  const response = await axios.get(TODOS_API);
  return response.data;
};

export const createNewTodo = async () => {
  const response = await axios.get(`${TODOS_API}/create`);
  return response.data;
};

export const removeTodo = async (todo: { id: number }) => {
  const response = await axios.get(`${TODOS_API}/${todo.id}/delete`);
  return response.data;
};

export const postNewTodo = async (todo: { title: string; completed: boolean }) => {
  const response = await axios.post(TODOS_API, todo);
  return response.data;
};

export const deleteTodo = async (todo: { id: number }) => {
  const response = await axios.delete(`${TODOS_API}/${todo.id}`);
  return response.data;
};

export const updateTodo = async (todo: { id: number }) => {
  const response = await axios.put(`${TODOS_API}/${todo.id}`, todo);
  return response.data;
};
