import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commonService } from '@/services/common';
import toast from 'react-hot-toast';

// Create async thunks for API calls
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await commonService.getProjects(page);
      
      // Handle different response structures
      if (response && response.data && response.data.projects) {
        return {
          projects: response.data.projects.data,
          lastPage: response.data.projects.last_page,
          currentPage: page
        };
      } else if (response && response.status && response.message && response.data) {
        return {
          projects: response.data.projects.data || [],
          lastPage: response.data.projects.last_page || 1,
          currentPage: page
        };
      } else if (response && response.projects) {
        return {
          projects: response.projects.data || [],
          lastPage: response.projects.last_page || 1,
          currentPage: page
        };
      } else {
        console.error('Unexpected API response structure:', response);
        return rejectWithValue('Unexpected data format received');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to load projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await commonService.createProject(projectData);
      const { currentPage } = getState().projects;
      
      // Refresh the projects list after creation
      dispatch(fetchProjects(currentPage));
      
      return response;
    } catch (error) {
      console.error('Create error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await commonService.updateProject(id, updatedData);
      return { id, updatedData };
    } catch (error) {
      console.error('Update error:', error);
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await commonService.deleteProject(id);
      return id;
    } catch (error) {
      console.error('Delete error:', error);
      return rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    lastPage: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
    isSubmitting: false
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.projects;
        state.lastPage = action.payload.lastPage;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to load projects');
      })
      
      // Create project
      .addCase(createProject.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createProject.fulfilled, (state) => {
        state.isSubmitting = false;
        toast.success('Project created successfully');
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isSubmitting = false;
        toast.error(action.payload || 'Failed to create project');
      })
      
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isSubmitting = false;
        
        // Update the project in the state
        state.projects = state.projects.map(project => 
          project.id === action.payload.id 
            ? { ...project, ...action.payload.updatedData } 
            : project
        );
        
        toast.success('Project updated successfully');
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isSubmitting = false;
        toast.error(action.payload || 'Update failed');
      })
      
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isSubmitting = false;
        
        // Remove the deleted project from the state
        state.projects = state.projects.filter(project => project.id !== action.payload);
        
        toast.success('Project deleted successfully');
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isSubmitting = false;
        toast.error(action.payload || 'Delete failed');
      });
  }
});

export const { setCurrentPage } = projectSlice.actions;
export default projectSlice.reducer;
