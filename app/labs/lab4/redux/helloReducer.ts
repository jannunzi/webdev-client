"use client";

import { createSlice } from "@reduxjs/toolkit";

const helloSlice = createSlice({
  name: "hello",
  initialState: { message: "Hello Redux" },
  reducers: {},
});

export default helloSlice.reducer;
