import { commonService } from "@/services/common";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from 'react-hot-toast';

// Uncomment and implement fetchTeams
export const fetchTeams = createAsyncThunk(
  "teams/fetchTeams",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await commonService.getTeams(page);
      
      // Handle different response structures similar to projectSlice
      if (response && response.data && response.data.teams) {
        return {
          teams: response.data.teams.data || [],
          lastPage: response.data.teams.last_page || 1,
          currentPage: page
        };
      } else if (response && response.status && response.message && response.data) {
        return {
          teams: response.data || [],
          lastPage: response.last_page || 1,
          currentPage: page
        };
      } else if (response && response.teams) {
        return {
          teams: response.teams.data || [],
          lastPage: response.teams.last_page || 1,
          currentPage: page
        };
      } else {
        // If direct data array is returned
        return {
          teams: Array.isArray(response) ? response : (response.data || []),
          lastPage: 1,
          currentPage: page
        };
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch teams");
    }
  }
);

export const fetchTeamDetails = createAsyncThunk(
  "teams/fetchTeamDetails",
  async (teamId, { rejectWithValue }) => {
    console.log("teamIdteamIdteamId",teamId);
    
    try {
      const response = await commonService.showteam(teamId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch team details");
    }
  }
);

export const createTeam = createAsyncThunk(
  "teams/createTeam",
  async (teamData, { rejectWithValue, dispatch }) => {
    try {
      const response = await commonService.createTeam(teamData);
      
      // Refresh teams list after creating new team
      dispatch(fetchTeams());
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create team");
    }
  }
);

// Define the initial state
const initialState = {
  teams: [],
  teamDetails: null,
  currentPage: 1,
  lastPage: 1,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// Create the team slice
const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetTeamDetails: (state) => {
      state.teamDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch teams
      .addCase(fetchTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload.teams;
        state.currentPage = action.payload.currentPage;
        state.lastPage = action.payload.lastPage;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to fetch teams");
      })
      
      // Fetch team details
      .addCase(fetchTeamDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeamDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamDetails = action.payload;
      })
      .addCase(fetchTeamDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to fetch team details");
      })
      
      // Create team
      .addCase(createTeam.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.isSubmitting = false;
        toast.success("Team created successfully");
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to create team");
      })
  },
});

// Export actions and reducer
export const { setCurrentPage, resetTeamDetails } = teamSlice.actions;
export default teamSlice.reducer;