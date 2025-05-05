"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { DEFAULT_AVATAR } from "@/config/constant";
// import { projectService } from "@/services/project"; // Assuming you have a project service
import { commonService } from "@/services/common";

export default function ProjectDetails({ params }) {
  console.log("page");
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchingFreelancers, setMatchingFreelancers] = useState([]);
  const [freelancersLoading, setFreelancersLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  
  const projectId = params.id;
  
  // Function to fetch matching freelancers based on project description
  const fetchMatchingFreelancers = async (projectData) => {
    if (!projectData || !projectData.description) {
      console.error("Project data missing or incomplete for matching");
      setDebugInfo(prev => ({...prev, error: "Project data missing or incomplete"}));
      return;
    }
    
    try {
      setFreelancersLoading(true);
      setDebugInfo(prev => ({...prev, status: "Loading"}));
      
      // Format data according to the required structure
      const matchData = {
        project_description: projectData.description
        // Use this format instead of the previous one
      };
      setDebugInfo(prev => ({...prev, sentData: matchData}));
      
      // Call API to get matching freelancers
      
      try {
        const response = await commonService.getMatchingFreelancers(matchData);
        console.log("API call completed successfully");
        
        console.log("Response from API:", response);
        setDebugInfo(prev => ({...prev, apiResponse: response}));
        
        if (response && response.status && response.data && response.data.freelancers) {
          setMatchingFreelancers(response.data.freelancers);
          setDebugInfo(prev => ({
            ...prev, 
            freelancersCount: response.data.freelancers.length,
            status: "Success"
          }));
        } else {
          console.error("Error in matching freelancers response format:", response);
          setMatchingFreelancers([]);
          setDebugInfo(prev => ({
            ...prev, 
            error: "Invalid response format", 
            status: "Error"
          }));
        }
      } catch (apiError) {
        console.error("API call itself failed:", apiError);
        setDebugInfo(prev => ({
          ...prev, 
          apiError: apiError.message, 
          status: "API Error"
        }));
      }
    } catch (err) {
      console.error("Error in outer fetchMatchingFreelancers function:", err);
      setMatchingFreelancers([]);
      setDebugInfo(prev => ({...prev, error: err.message, status: "Function Error"}));
    } finally {
      setFreelancersLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        // Call your API to get project details by ID
        const response = await commonService.getProjectById(projectId);
        
        if (!response.status) {
          throw new Error(response.message || "Failed to fetch project details");
        }
        
        const projectData = response.data.project;
        setProject(projectData);
        
        // After getting project details, fetch matching freelancers
        if (projectData) {
          console.log("Project data received, calling fetchMatchingFreelancers");
          await fetchMatchingFreelancers(projectData);
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);
  
  if (loading) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading project details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <hr />
          <Link href="/projects" className="btn btn-outline-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4 className="alert-heading">Project Not Found</h4>
          <p>The project you're looking for doesn't exist or has been removed.</p>
          <hr />
          <Link href="/projects" className="btn btn-outline-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Check if we have matching freelancers before rendering the section
  const hasMatchingFreelancers = Array.isArray(matchingFreelancers) && matchingFreelancers.length > 0;

  // Helper function to format image paths properly
  const formatImagePath = (path) => {
    if (!path) return DEFAULT_AVATAR;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return path.startsWith('/') ? path : `/${path.replace(/^public\//, '')}`;
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12 mb-4">
          <Link href="/projects" className="btn btn-outline-primary mb-3">
            <i className="fas fa-arrow-left me-2"></i>Back to Projects
          </Link>
          
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="page-title">{project.title}</h1>
            <span className={`tag fs-5 px-3 py-2 text-${
              project.status === "active" ? "success" :
              project.status === "completed" ? "info" : "warning"
            }`}>
              {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'New'}
            </span>
          </div>
        </div>
        
        {/* Client Info */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Client Information</h5>
              <div className="d-flex align-items-center mb-3">
                <Image
                  height={60}
                  width={60}
                  className="rounded-circle"
                  src={project.client?.avatar ? formatImagePath(project.client.avatar) : DEFAULT_AVATAR}
                  alt={project.client?.name || 'Client'}
                />
                <div className="ms-3">
                  <h6 className="mb-0">{project.client?.name || 'Client Name'}</h6>
                  <p className="text-muted mb-0">{project.client?.email || 'No email provided'}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="mb-2">
                  <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                  {project.client?.location || 'Location not specified'}
                </p>
                <p className="mb-2">
                  <i className="fas fa-phone me-2 text-primary"></i>
                  {project.client?.phone || 'Phone not provided'}
                </p>
                <p className="mb-0">
                  <i className="fas fa-globe me-2 text-primary"></i>
                  {project.client?.website || 'Website not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Project Details */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">Project Details</h5>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong>Budget:</strong> ${project.budget} ({project.budget_type || 'Fixed'})
                  </p>
                  {project.duration && (
                    <p className="mb-2">
                      <strong>Duration:</strong> {project.duration}
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  {project.created_at && (
                    <p className="mb-2">
                      <strong>Posted:</strong> {formatDistanceToNow(new Date(project.created_at))} ago
                    </p>
                  )}
                  {project.deadline && (
                    <p className="mb-2">
                      <strong>Deadline:</strong> {project.deadline}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h6>Description</h6>
                <p className="mb-0">{project.description}</p>
              </div>
              
              {project.skills && project.skills.length > 0 && (
                <div className="mb-4">
                  <h6>Skills Required</h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="tag">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {project.category && (
                <div className="mb-4">
                  <h6>Category</h6>
                  <p className="mb-0">{project.category.name}</p>
                </div>
              )}
              
              {project.attachment && (
                <div>
                  <h6>Attachments</h6>
                  <div className="mt-2">
                    <a 
                      href={`${process.env.NEXT_PUBLIC_API_URL}${formatImagePath(project.attachment)}`} 
                      className="btn btn-outline-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-download me-2"></i>Download Attachment
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Matching Freelancers Section */}
        <div className="col-12 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Recommended Freelancers</h5>
              
              {/* Debug Button */}
              <div className="mb-3">
                <button 
                  className="btn btn-outline-secondary btn-sm mb-3"
                  onClick={() => {
                    console.log("Manual trigger with project data:", project);
                    fetchMatchingFreelancers(project);
                  }}
                >
                  <i className="fas fa-sync-alt me-2"></i>Refresh Freelancer Matches
                </button>

                <span className="ms-3 text-muted">
                  Status: {debugInfo.status || "Not Started"}
                  {debugInfo.error && ` (Error: ${debugInfo.error})`}
                </span>
              </div>
              
              {freelancersLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 mb-0">Finding matching freelancers...</p>
                </div>
              ) : hasMatchingFreelancers ? (
                <div className="row">
                  {matchingFreelancers.map((freelancer, index) => (
                    <div key={index} className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <Image
                              height={60}
                              width={60}
                              className="rounded-circle"
                              src={formatImagePath(freelancer.profile_url || DEFAULT_AVATAR)}
                              alt={freelancer.name}
                            />
                            <div className="ms-3">
                              <h6 className="mb-0">{freelancer.name}</h6>
                              <p className="text-muted mb-0">{freelancer.experience || 'No experience listed'}</p>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="mb-2 text-truncate">
                              <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                              {freelancer.location || 'Location not specified'}
                            </p>
                            <p className="mb-0">
                              <i className="fas fa-award me-1 text-warning"></i>
                              <span>Karma: {freelancer.karma || '0'}</span>
                            </p>
                          </div>
                          
                          {Array.isArray(freelancer.skills) && freelancer.skills.length > 0 && (
                            <div className="mb-3">
                              <div className="d-flex flex-wrap gap-1">
                                {freelancer.skills.slice(0, 3).map((skill, idx) => (
                                  <span key={idx} className="tag tag-sm">{skill}</span>
                                ))}
                                {freelancer.skills.length > 3 && (
                                  <span className="tag tag-sm">+{freelancer.skills.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* <div className="d-grid">
                            <Link href={`/freelancer/${freelancer.id}`} className="btn btn-outline-primary btn-sm">
                              View Profile
                            </Link>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-muted mb-3">No matching freelancers found for this project.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Proposals or additional content section */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Proposals</h5>
              
              {/* If you have proposals, map through them here */}
              {project.proposals && project.proposals.length > 0 ? (
                project.proposals.map((proposal, index) => (
                  <div key={index} className="border-bottom pb-3 mb-3">
                    {/* Proposal content */}
                  </div>
                ))
              ) : (
                <p className="text-muted">No proposals yet for this project.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}