import { configureStore } from '@reduxjs/toolkit';
import cvReducer from './cvSlice';
import sectionsReducer, { sectionsInitialState } from './selectionsSlice';

type PersistedState = {
  cv: ReturnType<typeof cvReducer>;
  sections: ReturnType<typeof sectionsReducer>;
};

const STORAGE_KEY = 'fastcv_state';

const loadState = (): PersistedState | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return undefined;
    }
    const parsed = JSON.parse(raw) as PersistedState;
    const persistedSections = parsed.sections ?? sectionsInitialState;
    const skillsValue =
      (persistedSections as { skills?: boolean }).skills ??
      (persistedSections as { abilities?: boolean }).abilities ??
      sectionsInitialState.skills;

    const persistedCv = parsed.cv ?? ({} as PersistedState["cv"]);
    const skillsData =
      (persistedCv as { skillsData?: unknown }).skillsData ??
      (persistedCv as { abilitiesData?: unknown }).abilitiesData ??
      [];

    return {
      ...parsed,
      cv: {
        ...persistedCv,
        skillsData: Array.isArray(skillsData) ? skillsData : [],
      },
      sections: {
        ...sectionsInitialState,
        ...persistedSections,
        skills: skillsValue,
      },
    };
  } catch {
    return undefined;
  }
};

const saveState = (state: PersistedState) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore write errors (quota, private mode, etc.).
  }
};

export const store = configureStore({
  reducer: {
    cv: cvReducer,
    sections: sectionsReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState({
    cv: store.getState().cv,
    sections: store.getState().sections,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
