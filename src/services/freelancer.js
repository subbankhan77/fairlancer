import api from '@/lib/axios';
import { getSession } from 'next-auth/react';

export const freelancerService = {
    async getDashboard() {
      const response = await api.get('/dashboard/freelancer');
      return response.data;
    },
    async getProjectsFreelancer() {
      const response = await api.get('/projects');
      console.log("common js fetch list ",response.data);
      return response.data;
    },

    async getProject(id) {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    },
     // New method for deactivating account
  async deactivateAccount() {
    const response = await api.delete('/profile/deactivate');
    return response.data;
  },

   //applications
   async submitApplications(data) {
    // Add data parameter to send form data
    const response = await api.post('/applications', data);
    return response.data;
  },

 // Corrected withdrawApplication method based on the API curl example
async withdrawApplication(applicationId) {;
  const response = await api.post(`/applications/${applicationId}/withdraw`);
  return response.data;
},



async summarizeReviews(data) {
  const response = await api.post(`/ai/summarize-reviews`,data);
  return response.data;
},

// Start Questionnaire
async startQuestionnaire(data) {
  const session = await getSession();
      
      // Log session for debugging
      console.log("Current session:", session);
      
      // Make sure authorization header is set
      if (session?.accessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`;
      } else {
        console.error("No access token found in session");
      }
  console.log("Start Questionnaire",data);
  const response = await api.post(`/ai/start-questionnaire`,data);
  return response.data;
},

// Next Question
 async nextQuestion (data) {
  const response = await api.post(`/ai/next-question`,data);
  return response.data;
},
 // Finalize Project
 async finalizeProject(data) {
  const response = await api.post(`/ai/finalize-project`, data);
  return response.data;
}
};