"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AddPayload = { a: number; b: number };

const addSlice = createSlice({
  name: "add",
  initialState: { sum: 0 },
  reducers: {
    add: (state, action: PayloadAction<AddPayload>) => {
      state.sum = action.payload.a + action.payload.b;
    },
  },
});

export const { add } = addSlice.actions;
export default addSlice.reducer;
