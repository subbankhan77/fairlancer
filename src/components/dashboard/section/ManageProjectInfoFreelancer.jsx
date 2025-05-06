"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '@/store/slices/projectSlice';
import { freelancerService } from '@/services/freelancer';
import api from '@/lib/axios';

import Pagination1 from "@/components/section/Pagination1";
import Breadcumb from "@/components/custom/dashboard/common/Breadcumb";
import BreadCrumbHeader from "@/components/custom/dashboard/common/BreadCrumbHeader";
import ProjectCardSkeleton from "@/components/custom/loader/ProjectCardSkeleton";
import ProjectFreelancerCard from "@/components/custom/dashboard/common/ProjectFreelancerCard";
import FreelancerSearch from "@/components/project/FreelancerSearch";

export default function ManageProjectInfoFreelancer() {
  const dispatch = useDispatch();
  const { projects, lastPage, currentPage, isLoading } = useSelector(state => state.projects);

  // State management
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  // Application modal state
  const [showModal, setShowModal] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [formData, setFormData] = useState({
    project_id: "",
    cover_letter: "",
    proposed_price: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawingApplicationId, setWithdrawingApplicationId] = useState(null);
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Updated helper to check if project has application
  const hasApplication = (project) => {
    return project.applications !== undefined && 
           project.applications !== null && 
           project.applications.length > 0;
  };

  // Helper to get the first application from a project
  const getApplication = (project) => {
    if (hasApplication(project)) {
      return project.applications[0];
    }
    return null;
  };

  // Toggle project details
  const toggleProjectDetails = (projectId) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  const handlePageChange = (page) => {
    dispatch(fetchProjects(page));
  };

  // Open application modal
  const handleSubmitApplication = (project) => {
    setActiveProject(project);
    setShowModal(true);
    setFormData({
      project_id: project.id,
      cover_letter: "",
      proposed_price: ""
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit application to API
  const submitApplication = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.project_id) {
      alert("Project ID is required");
      return;
    }

    if (!formData.cover_letter.trim()) {
      alert("Please enter a cover letter");
      return;
    }

    if (!formData.proposed_price || isNaN(Number(formData.proposed_price)) || Number(formData.proposed_price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare request body
      const requestData = {
        project_id: Number(formData.project_id),
        cover_letter: formData.cover_letter,
        proposed_price: Number(formData.proposed_price)
      };

      // Call the submitApplications service method
      const response = await freelancerService.submitApplications(requestData);

      // Close modal and show success message
      setShowModal(false);
      alert("Application submitted successfully!");

      // Refresh projects to show updated status
      dispatch(fetchProjects());

    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated withdrawApplication function with validation
  const withdrawApplication = async (applicationId) => {
    if (!applicationId) {
      alert("Cannot withdraw: Invalid application ID");
      return;
    }
    
    console.log("applicationId", applicationId);
    
    if (!confirm("Are you sure you want to withdraw this application? not changes add")) {
      return;
    }

    setIsWithdrawing(true);
    setWithdrawingApplicationId(applicationId);

    try {
      // API call to withdraw application
      const response = await freelancerService.withdrawApplication(applicationId);

      console.log("API call to withdraw application", response);

      alert("Application withdrawn successfully!");

      // Refresh projects to show updated status
      dispatch(fetchProjects());

    } catch (error) {
      console.log("Error withdrawing application:", error);
      alert("Failed to withdraw application. Please try again.");
    } finally {
      setIsWithdrawing(false);
      setWithdrawingApplicationId(null);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setActiveProject(null);
  };

  return (
    <div className="dashboard__content hover-bgc-color pt20">
      <Breadcumb path={[
        { title: "Dashboard", link: "/dashboard" },
        { title: "Projects", link: "/projects" },
      ]} />

      <div className="d-flex justify-content-between align-items-center mb20">
        <BreadCrumbHeader
          title="Projects"
          description="Project List"
        />
      </div>
      <FreelancerSearch />
      <div className="row">
        <div className="col-xl-12">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <section className="pt30 pb90">
              <div className="container">
                <div className="row">
                  {isLoading ? (
                    <div className="col-md-12">
                      {[1, 2, 3].map((index) => (
                        <ProjectCardSkeleton key={index} />
                      ))}
                    </div>
                  ) : (
                    projects.length ? (
                      <>
                        {projects.map((project, index) => (
                          <div key={index} className="col-12 mb20 animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                            {/* Project Card */}
                            <div className="mb-3 transition-all duration-300 hover:shadow-lg rounded">
                              <ProjectFreelancerCard data={project} />
                              <div className="text-end mt-2">
                                {/* Updated Application Buttons - Show Submit or Withdraw based on application status */}
                                {hasApplication(project) ? (
                                  <button
                                    className="ud-btn btn-danger me-2 hover:scale-105 transition-transform duration-200"
                                    onClick={() => withdrawApplication(getApplication(project).id)}
                                    disabled={isWithdrawing && withdrawingApplicationId === getApplication(project)?.id}
                                  >
                                    {isWithdrawing && withdrawingApplicationId === getApplication(project)?.id ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        Withdrawing...
                                      </>
                                    ) : (
                                      <>
                                        <i className="fas fa-times-circle me-1"></i>
                                        Withdraw Application
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    className="ud-btn btn-success me-2 hover:scale-105 transition-transform duration-200"
                                    onClick={() => handleSubmitApplication(project)}
                                  >
                                    <i className="fas fa-paper-plane me-1"></i>
                                    Submit Application
                                  </button>
                                )}
                                <button
                                  className="ud-btn btn-thm hover:scale-105 transition-transform duration-200"
                                  onClick={() => toggleProjectDetails(project.id)}
                                >
                                  {expandedProjectId === project.id ? (
                                    <>
                                      Hide Details
                                      <i className="fal fa-arrow-up ms-1"></i>
                                    </>
                                  ) : (
                                    <>
                                      View Details
                                      <i className="fal fa-arrow-right-long ms-1"></i>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Expanded Project Details Card with animation */}
                            {expandedProjectId === project.id && (
                              <div className="bg-white border rounded-lg shadow-sm mb-4 overflow-hidden position-relative animate-slideDown">
                                {/* Card Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b">
                                  <h4 className="text-xl font-semibold">{project.title} - Detailed View</h4>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                  {/* Project details in a grid format */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Left Column - Basic Info */}
                                    <div className="col-span-1">
                                      <h5 className="font-semibold text-lg mb-4 text-gray-800 border-b pb-2">Basic Information</h5>

                                      <div className="mb-3">
                                        <p className="text-gray-500 mb-1 text-sm">Project ID</p>
                                        <p className="font-medium">{project.id}</p>
                                      </div>

                                      <div className="mb-3">
                                        <p className="text-gray-500 mb-1 text-sm">Category</p>
                                        <p className="font-medium">{project.category ? (typeof project.category === 'object' ? project.category.name : project.category) : "Not specified"}</p>
                                      </div>

                                      <div className="mb-3">
                                        <p className="text-gray-500 mb-1 text-sm">Budget</p>
                                        <p className="font-medium">{project.budget_currency || "$"}{project.budget_amount || project.budget || "Not specified"}</p>
                                      </div>

                                      <div className="mb-3">
                                        <p className="text-gray-500 mb-1 text-sm">Duration</p>
                                        <p className="font-medium">{project.duration || "Not specified"}</p>
                                      </div>

                                      <div className="mb-3">
                                        <p className="text-gray-500 mb-1 text-sm">Experience Level</p>
                                        <p className="font-medium">{project.experience_level || "Not specified"}</p>
                                      </div>

                                      <div className="mb-3">
                                        <p className="text-gray-500 mb-1 text-sm">Posted Date</p>
                                        <p className="font-medium">{project.created_at ? new Date(project.created_at).toLocaleDateString() : "Not available"}</p>
                                      </div>
                                    </div>

                                    {/* Middle Column - Description */}
                                    <div className="col-span-1 md:col-span-2">
                                      <h5 className="font-semibold text-lg mb-4 text-gray-800 border-b pb-2">Project Description</h5>

                                      <div className="mb-4 project-description">
                                        <p className="whitespace-pre-line">{project.description}</p>
                                      </div>

                                      {/* Skills/Tags */}
                                      {project.skills && project.skills.length > 0 && (
                                        <div className="mb-4">
                                          <h6 className="font-semibold mb-2 text-gray-700">Required Skills</h6>
                                          <div className="flex flex-wrap gap-2">
                                            {project.skills.map((skill, index) => (
                                              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded hover:scale-105 transition-transform duration-200">
                                                {typeof skill === 'object' ? skill.name : skill}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Attachments if available */}
                                      {project.attachments && project.attachments.length > 0 && (
                                        <div className="mb-4">
                                          <h6 className="font-semibold mb-2 text-gray-700">Attachments</h6>
                                          <ul className="list-disc pl-5">
                                            {project.attachments.map((attachment, index) => (
                                              <li key={index} className="mb-1">
                                                <a href={attachment.url} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                                                  {attachment.name || `Attachment ${index + 1}`}
                                                </a>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Additional Project Details (if available) */}
                                  {(project.deliverables || project.milestones || project.additional_info) && (
                                    <div className="mt-6 pt-6 border-t">
                                      <h5 className="font-semibold text-lg mb-4 text-gray-800">Additional Details</h5>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Deliverables */}
                                        {project.deliverables && (
                                          <div className="mb-4">
                                            <h6 className="font-semibold mb-2 text-gray-700">Deliverables</h6>
                                            <p className="whitespace-pre-line">{project.deliverables}</p>
                                          </div>
                                        )}

                                        {/* Milestones */}
                                        {project.milestones && project.milestones.length > 0 && (
                                          <div className="mb-4">
                                            <h6 className="font-semibold mb-2 text-gray-700">Milestones</h6>
                                            <ul className="list-disc pl-5">
                                              {project.milestones.map((milestone, index) => (
                                                <li key={index} className="mb-1">
                                                  {milestone.title} - {milestone.amount}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}

                                        {/* Additional Info */}
                                        {project.additional_info && (
                                          <div className="mb-4">
                                            <h6 className="font-semibold mb-2 text-gray-700">Additional Information</h6>
                                            <p className="whitespace-pre-line">{project.additional_info}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Card Footer - Updated to use applications array */}
                                <div className="px-6 py-4 border-t bg-gray-50">
                                  <div className="flex justify-between">
                                    <div>
                                      {hasApplication(project) ? (
                                        <button
                                          className="ud-btn btn-danger hover:scale-105 transition-transform duration-200"
                                          onClick={() => withdrawApplication(getApplication(project).id)}
                                          disabled={isWithdrawing && withdrawingApplicationId === getApplication(project)?.id}
                                        >
                                          {isWithdrawing && withdrawingApplicationId === getApplication(project)?.id ? (
                                            <>
                                              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                              Withdrawing...
                                            </>
                                          ) : (
                                            <>
                                              <i className="fas fa-times-circle me-1"></i>
                                              Withdraw Application
                                            </>
                                          )}
                                        </button>
                                      ) : (
                                        <button
                                          className="ud-btn btn-success hover:scale-105 transition-transform duration-200"
                                          onClick={() => handleSubmitApplication(project)}
                                        >
                                          <i className="fas fa-paper-plane me-1"></i>
                                          Submit Application
                                        </button>
                                      )}
                                    </div>
                                    <button
                                      className="ud-btn btn-white hover:bg-gray-100 transition-colors duration-200"
                                      onClick={() => setExpandedProjectId(null)}
                                    >
                                      <i className="fas fa-chevron-up me-2"></i>
                                      Collapse Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {lastPage > 1 && (
                          <div className="animate-fadeIn">
                            <Pagination1
                              currentPage={currentPage}
                              totalPages={lastPage}
                              onPageChange={handlePageChange}
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="col-md-12 text-center">
                        <p>No projects found</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && activeProject && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-4 overflow-y-auto backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-xl w-11/12 max-w-md max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h4 className="text-xl font-semibold">Submit Application</h4>
              <button
                className="text-gray-500 hover:text-gray-700 rounded-full h-8 w-8 flex items-center justify-center"
                onClick={closeModal}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <form onSubmit={submitApplication}>
                {/* Project ID */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">Project ID</label>
                  <input
                    type="text"
                    name="project_id"
                    className="form-control border-gray-300 rounded-lg"
                    value={formData.project_id}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>

                {/* Cover Letter */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">Cover Letter</label>
                  <textarea
                    name="cover_letter"
                    className="form-control border-gray-300 rounded-lg"
                    value={formData.cover_letter}
                    onChange={handleInputChange}
                    placeholder="Enter your cover letter"
                    rows="4"
                    required
                  ></textarea>
                </div>

                {/* Proposed Price */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">Proposed Price ($)</label>
                  <input
                    type="number"
                    name="proposed_price"
                    className="form-control border-gray-300 rounded-lg"
                    value={formData.proposed_price}
                    onChange={handleInputChange}
                    placeholder="Enter your proposed price"
                    min="1"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    className="ud-btn btn-white me-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ud-btn btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}