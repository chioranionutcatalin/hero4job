import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CVType, ExperienceType, PersonalDataType, SkillType } from '../types';

const initialState: CVType = {
  personalData: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    linkedInUrl: '',
    personalWebsite: '',
    driverLicenseCategory: '',
    desiredJobTitle: '',
    summary: '',
    profileImageUrl: '',
  },
  experienceData: [],
  skillsData: [],
  languagesData: [],
  educationData: [],
};

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    updatePersonalData(
      state,
      action: PayloadAction<Partial<PersonalDataType>>
    ) {
      state.personalData = { ...state.personalData, ...action.payload };
    },
    setExperienceData(
      state,
      action: PayloadAction<ExperienceType[]>
    ) {
      state.experienceData = action.payload;
    },
    setSkillsData(
      state,
      action: PayloadAction<SkillType[]>
    ) {
      state.skillsData = action.payload;
    },
    addSkill(state, action: PayloadAction<SkillType>) {
      state.skillsData.push(action.payload);
    },
    removeSkillAt(state, action: PayloadAction<number>) {
      state.skillsData = state.skillsData.filter(
        (_, index) => index !== action.payload
      );
    },
    clearSkillsData(state) {
      state.skillsData = [];
    },
    clearLanguagesData(state) {
      state.languagesData = [];
    },
    clearEducationData(state) {
      state.educationData = [];
    },
  },
});

export const {
  updatePersonalData,
  setExperienceData,
  setSkillsData,
  addSkill,
  removeSkillAt,
  clearSkillsData,
  clearLanguagesData,
  clearEducationData,
} = cvSlice.actions;
export default cvSlice.reducer;
