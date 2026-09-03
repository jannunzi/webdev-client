import axios from "axios";
import { httpServer } from "@/app/lib/httpServer";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = httpServer();
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findCourseById = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}`);
  return data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/courses`,
  );
  return data;
};

export const createCourse = async (course: unknown) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses`,
    course,
  );
  return data;
};

export const createCoursePublic = async (course: unknown) => {
  const { data } = await axios.post(COURSES_API, course);
  return data;
};

export const updateCourse = async (course: { _id: string }) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

export const deleteCourse = async (courseId: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${courseId}`);
  return data;
};

export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return data;
};

export const createModuleForCourse = async (
  courseId: string,
  module: unknown,
) => {
  const { data } = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module,
  );
  return data;
};

export const deleteModule = async (moduleId: string) => {
  const { data } = await axios.delete(`${MODULES_API}/${moduleId}`);
  return data;
};

export const updateModule = async (module: { _id: string }) => {
  const { data } = await axios.put(`${MODULES_API}/${module._id}`, module);
  return data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/${userId}/courses/${courseId}`,
  );
  return data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${USERS_API}/${userId}/courses/${courseId}`,
  );
  return data;
};

export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users`);
  return data;
};
