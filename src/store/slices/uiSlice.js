import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isStoryCreateModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleStoryCreateModal: (state) => {
      state.isStoryCreateModalOpen = !state.isStoryCreateModalOpen;
    },
    setStoryCreateModal: (state, action) => {
      state.isStoryCreateModalOpen = action.payload;
    },
  },
});

export const { toggleStoryCreateModal, setStoryCreateModal } = uiSlice.actions;
export default uiSlice.reducer;
