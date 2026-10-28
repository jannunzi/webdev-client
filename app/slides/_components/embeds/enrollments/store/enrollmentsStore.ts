"use client";

import { create } from "zustand";
import enrollmentsJson from "../database/enrollments.json";

export type Enrollment = (typeof enrollmentsJson)[number];

type EnrollmentsStore = {
  enrollments: Enrollment[];
  enrollIntoCourse: (userId: string, courseId: string) => void;
  unenrollFromCourse: (userId: string, courseId: string) => void;
};

export const useEnrollmentsStore = create<EnrollmentsStore>((set) => ({
  enrollments: enrollmentsJson,
  enrollIntoCourse: (userId, courseId) =>
    set((state) => ({
      enrollments: [
        ...state.enrollments,
        { _id: crypto.randomUUID(), user: userId, course: courseId },
      ],
    })),
  unenrollFromCourse: (userId, courseId) =>
    set((state) => ({
      enrollments: state.enrollments.filter(
        (e) => !(e.user === userId && e.course === courseId),
      ),
    })),
}));
