import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commonService } from '@/services/common';
import toast from 'react-hot-toast';

// Fetch projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await commonService.getProjects(page);
      return {
        projects: response.data.projects.data,
        lastPage: response.data.projects.last_page,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return rejectWithValue('Failed to load projects');
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await commonService.deleteProject(projectId);
      toast.success('Project deleted successfully');
      return projectId;
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.response?.data?.message || 'Delete failed');
      return rejectWithValue('Failed to delete project');
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await commonService.updateProject(projectId, updatedData);
      toast.success('Project updated successfully');
      return { id: projectId, ...updatedData };
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error.response?.data?.message || 'Update failed');
      return rejectWithValue('Failed to update project');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projectsData: [],
    lastPage: 1,
    currentPage: 1,
    isLoading: false,
    isSubmitting: false,
    error: null,
    selectedProject: null,
    showDeleteModal: false,
    showEditModal: false
  },
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    toggleDeleteModal: (state, action) => {
      state.showDeleteModal = action.payload;
      if (!action.payload) {
        state.selectedProject = null;
      }
    },
    toggleEditModal: (state, action) => {
      state.showEditModal = action.payload;
      if (!action.payload) {
        state.selectedProject = null;
      }
    }
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
        state.projectsData = action.payload.projects;
        state.lastPage = action.payload.lastPage;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.projectsData = state.projectsData.filter(
          project => project.id !== action.payload
        );
        state.showDeleteModal = false;
        state.selectedProject = null;
      })
      .addCase(deleteProject.rejected, (state) => {
        state.isSubmitting = false;
      })
      
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.projectsData = state.projectsData.map(project => 
          project.id === action.payload.id ? { ...project, ...action.payload } : project
        );
        state.showEditModal = false;
        state.selectedProject = null;
      })
      .addCase(updateProject.rejected, (state) => {
        state.isSubmitting = false;
      });
  }
});

export const { setSelectedProject, toggleDeleteModal, toggleEditModal } = projectsSlice.actions;

export default projectsSlice.reducer;