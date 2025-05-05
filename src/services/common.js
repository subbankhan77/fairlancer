import api from '@/lib/axios';

export const commonService = {
  // ------- Client Role ----
  async createProject(data) {
    // Add data parameter to send form data
    const response = await api.post('/projects', data);
    console.log("Client js create project", response.data);
    return response.data;
  },
  
  async getProjects() {
    const response = await api.get('/projects');
    return response.data;
  },
  
  async getProjectById(id) {
    // console.log("responseresponse",id);
    const response = await api.get(`/projects/${id}`);
    // console.log("responseresponse",response);
    return response.data;
  },
  
  // Fix 1: Include the project ID in the URL and use POST instead of PUT
  async updateProject(id, data) {
    // console.log("project update response: id Dta ", id, data);
    const response = await api.put(`/projects/${id}`, data);
    // console.log("project update response:", response.data);
    return response.data;
  },
  
  // Fix 2: Implement actual delete functionality
  async deleteProject(id) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
  
  async submitProposal({ project_id, proposed_price, cover_letter }) {
    const response = await api.post(`/applications`, {
      project_id,
      proposed_price,
      cover_letter
    });
    return response.data;
  },
  
  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  },
  
  async updateProfile(data) {
    const response = await api.put('/profile', data);
    return response.data;
  },
  
  async updateAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  // Get Skills Api
  async getSkills() {
    const response = await api.get('/skills');
    return response.data;
  },
  
  // Add Skills On Profile
  async addSkill(skillId) {
    
    const response = await api.patch('/freelancer/skills/add', {
      skills: [skillId]
    });
    return response.data;
  },
  
  // Delete Skill API
  async deleteSkill(skillId) {
    const response = await api.delete(`/skills/${skillId}`);
    return response.data;
  },
  
  // Get Categories Api
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },
  
  // Generate Description AI
  async generateDescription(data) {
    // Add data parameter to send form data
    const response = await api.post('/ai/generate-description', data);
    return response.data;
  },
  
  // Get Matching Freelancers
  async getMatchingFreelancers(data) {
    // Add data parameter to send form data
    const response = await api.post('/ai/match-freelancers', data);
    return response.data;
  },
  
  // Get Interview Questions
  async getInterviewQuestions(projectDescription) {
    const encodedDescription = encodeURIComponent(projectDescription || 'New Project');
    const response = await api.get(`/interviews/questions?project_description=${encodedDescription}`);
    return response.data;
  },
  
  // Create Interview Question
  async createInterviewQuestion(questionData) {
    const response = await api.post('/interviews/questions/create', questionData);
    return response.data;
  },
  
  // Delete Interview Question
  async deleteInterviewQuestion(questionId) {
    const response = await api.delete(`/interviews/questions/${questionId}`);
    return response.data;
  },

  //Get Project Applications
  async getProjectApplications(projectId) {
    const response = await api.get(`/projects/${projectId}/applications`);
    return response.data;
  },

// update Application Status 

async updateApplicationStatus(applicationId, status) {
  const response = await api.post(`/applications/${applicationId}/update-status`, {status});
  return response.data;
},

// Teams Module
// Create Team
async createTeam(data) {
  const response = await api.post(`/teams`,data);
  return response.data;
},

// Show Team
async showteam(teamId) {
  const response = await api.get(`/teams/${teamId}`);
  return response.data;
},
}