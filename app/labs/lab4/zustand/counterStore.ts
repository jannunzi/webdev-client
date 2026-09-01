"use client";

import { create } from "zustand";

type CounterStore = {
  count: number;
  up: () => void;
  down: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 7,
  up: () => set((state) => ({ count: state.count + 1 })),
  down: () => set((state) => ({ count: state.count - 1 })),
}));
