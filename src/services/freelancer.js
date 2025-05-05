import api from '@/lib/axios';

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
async withdrawApplication(applicationId) {

  console.log('Application withdrawal applicationId:', applicationId);
  const response = await api.post(`/applications/${applicationId}/withdraw`);
  console.log('Application withdrawal response:', response);
  return response.data;
},


async summarizeReviews(data) {

  console.log('summarizeReviews:', data);
  const response = await api.post(`/ai/summarize-reviews`,data);
  console.log('summarizeReviews response:', response);
  return response.data;
},

};