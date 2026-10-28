"use client";

import { create } from "zustand";
import usersJson from "../database/users.json";
import type { User } from "../account/AccountContext";

type UsersStore = {
  users: User[];
  createUser: (user: User) => User;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
};

export const useUsersStore = create<UsersStore>((set) => ({
  users: usersJson,
  createUser: (user) => {
    const newUser = { ...user, _id: crypto.randomUUID() };
    set((state) => ({ users: [...state.users, newUser] }));
    return newUser;
  },
  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u._id === user._id ? user : u)),
    })),
  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u._id !== userId),
    })),
}));
