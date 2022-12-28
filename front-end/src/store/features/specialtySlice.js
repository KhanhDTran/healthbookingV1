import { createSlice } from "@reduxjs/toolkit";
import { fetchCreateClinic } from "../actions/clinicAction";

const initialState = {
  createSuccess: 0,
};

const specialtySlice = createSlice({
  name: "specialty",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCreateClinic.fulfilled, (state, { payload }) => {
      if (payload.errCode === 0) {
        state.createSuccess += 1;
      }
    });
  },
});
export default specialtySlice.reducer;
