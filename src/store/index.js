import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import teamReducer from './slices/teamSlice';
import freelancerReducer from './slices/freelancerSlice';



export const store = configureStore({
  reducer: {
    projects: projectReducer,
    teams:teamReducer,
    freelancer:freelancerReducer,
  },
});