import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CVSection =
  | 'personal'
  | 'experience'
  | 'skills'
  | 'languages'
  | 'education';

type SectionsVisibility = Record<CVSection, boolean>;

export const sectionsInitialState: SectionsVisibility = {
  personal: true,
  experience: true,
  skills: true,
  languages: false,
  education: false,
};

const sectionsSlice = createSlice({
  name: 'sections',
  initialState: sectionsInitialState,
  reducers: {
    toggleSection(state, action: PayloadAction<CVSection>) {
      state[action.payload] = !state[action.payload];
    },
  },
});

export const { toggleSection } = sectionsSlice.actions;
export default sectionsSlice.reducer;
