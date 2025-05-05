import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commonService } from '@/services/common';
import toast from 'react-hot-toast';

// Create async thunks for API calls
export const fetchMembers = createAsyncThunk(
  'freelancers/fetchMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await commonService.getMembers();
      
      if (response && response.data) {
        return response.data;
      } else if (response && Array.isArray(response)) {
        return response;
      } else {
        console.error('Unexpected API response structure:', response);
        return rejectWithValue('Unexpected data format received');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to load members');
    }
  }
);

export const fetchMatchingFreelancers = createAsyncThunk(
  'freelancers/fetchMatchingFreelancers',
  async (projectData, { rejectWithValue }) => {
    try {
      if (!projectData || !projectData.description) {
        return rejectWithValue('Project data missing or incomplete for matching');
      }
      
      // Format data according to the required structure
      const matchData = {
        project_description: projectData.description
      };
      
      const response = await commonService.getMatchingFreelancers(matchData);
      
      if (response && response.status && response.data && response.data.freelancers) {
        return response.data.freelancers;
      } else {
        console.error('Error in matching freelancers response format:', response);
        return rejectWithValue('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching matching freelancers:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch matching freelancers');
    }
  }
);

// Create the slice
const freelancerSlice = createSlice({
  name: 'freelancers',
  initialState: {
    members: [],
    matchingFreelancers: [],
    isLoadingMembers: false,
    isLoadingMatching: false,
    error: null
  },
  reducers: {
    clearMatchingFreelancers: (state) => {
      state.matchingFreelancers = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch members
      .addCase(fetchMembers.pending, (state) => {
        state.isLoadingMembers = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.isLoadingMembers = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.isLoadingMembers = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to load members');
      })
      
      // Fetch matching freelancers
      .addCase(fetchMatchingFreelancers.pending, (state) => {
        state.isLoadingMatching = true;
        state.error = null;
      })
      .addCase(fetchMatchingFreelancers.fulfilled, (state, action) => {
        state.isLoadingMatching = false;
        state.matchingFreelancers = action.payload;
      })
      .addCase(fetchMatchingFreelancers.rejected, (state, action) => {
        state.isLoadingMatching = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to fetch matching freelancers');
      });
  }
});

export const { clearMatchingFreelancers } = freelancerSlice.actions;
export default freelancerSlice.reducer;