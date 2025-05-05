"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { commonService } from "@/services/common";
import { DEFAULT_AVATAR } from "@/config/constant";

export default function ProjectApplications({ projectId }) {
  console.log("View Applications projectId:", projectId);
    
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState([]); // Track applications being processed

  useEffect(() => {
    const fetchApplications = async () => {
      if (!projectId) {
        console.error("No projectId provided to ProjectApplications component");
        setError("Project ID is missing");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fetching applications for project ID:", projectId);
        const response = await commonService.getProjectApplications(projectId);
        console.log("Applications API response:", response);
        
        if (response && response.status && response.data && response.data.applications) {
          setApplications(response.data.applications);
        } else {
          throw new Error(response?.message || "Failed to fetch applications");
        }
      } catch (err) {
        console.error("Error fetching project applications:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [projectId]);

  // Helper function to format avatar URLs
  const formatImagePath = (path) => {
    if (!path) return DEFAULT_AVATAR;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return path.startsWith('/') ? path : `/${path.replace(/^public\//, '')}`;
  };

  // Update application status (Accept/Reject)
  const updateApplicationStatus = async (applicationId, newStatus) => {
    // Add application ID to processing list
    setProcessingIds(prev => [...prev, applicationId]);
    
    try {
      console.log(`Updating application ${applicationId} to status: ${newStatus}`);
      
      // Call the API to update status
      const response = await commonService.updateApplicationStatus(applicationId, newStatus);
      
      if (response && response.status) {
        // Success - update the local state to reflect the change
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
        console.log(`Application ${applicationId} status updated to ${newStatus}`);
      } else {
        // Handle error
        throw new Error(response?.message || "Failed to update application status");
      }
    } catch (err) {
      console.error("Error updating application status:", err);
      alert(`Error: ${err.message || "Failed to update status"}`);
    } finally {
      // Remove from processing list
      setProcessingIds(prev => prev.filter(id => id !== applicationId));
    }
  };

  // Function to handle accepting an application
  const handleAcceptApplication = async (applicationId) => {
    if (window.confirm("Are you sure you want to accept this application?")) {
      await updateApplicationStatus(applicationId, "accepted");
    }
  };

  // Function to handle rejecting an application
  const handleRejectApplication = async (applicationId) => {
    if (window.confirm("Are you sure you want to reject this application?")) {
      await updateApplicationStatus(applicationId, "rejected");
    }
  };

  const handleContactFreelancer = (freelancerId) => {
    // Implementation for contacting freelancer
    console.log("Contact freelancer:", freelancerId);
    // You might redirect to messaging interface
    alert("Contacting freelancer: " + freelancerId);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading applications...</span>
        </div>
        <p className="mt-3">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">No applications have been submitted for this project yet.</p>
      </div>
    );
  }

  return (
    <div className="applications-list">
      <h5 className="card-title mb-4">Project Applications ({applications.length})</h5>
      
      {applications.map((application) => (
        <div key={application.id} className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row">
              {/* Freelancer Details */}
              <div className="col-md-3">
                <div className="d-flex flex-column align-items-center align-items-md-start mb-3 mb-md-0">
                  <div className="position-relative mb-3">
                    <Image
                      width={80}
                      height={80}
                      className="rounded-circle object-fit-cover"
                      src={formatImagePath(application.freelancer?.avatar)}
                      alt={application.freelancer?.name || 'Freelancer'}
                    />
                    <span className="position-absolute bottom-0 end-0 badge rounded-circle bg-success p-2 border border-white">
                      <span className="visually-hidden">Active status</span>
                    </span>
                  </div>
                  <h5 className="mb-1">{application.freelancer?.name}</h5>
                  <p className="text-muted mb-1">{application.freelancer?.headline || 'Freelancer'}</p>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-award text-warning me-1"></i>
                    <span>Karma: {application.freelancer?.karma || 0}</span>
                  </div>
                </div>
              </div>
              
              {/* Application Details */}
              <div className="col-md-6">
                <div className="mb-3">
                  <h6 className="text-muted mb-2">Cover Letter</h6>
                  <p>{application.cover_letter}</p>
                </div>
                
                <div className="mb-2 d-flex flex-wrap gap-3">
                  <div>
                    <span className="fw-bold">Price: </span>
                    <span className="text-success">${application.proposed_price}</span>
                  </div>
                  <div>
                    <span className="fw-bold">Status: </span>
                    <span className={`badge ${
                      application.status === 'accepted' ? 'bg-success' : 
                      application.status === 'rejected' ? 'bg-danger' : 
                      'bg-warning'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="fw-bold">Submitted: </span>
                    <span>{formatDistanceToNow(new Date(application.created_at))} ago</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="col-md-3">
                <div className="d-flex flex-column gap-2">
                  <Link 
                    href={`/freelancers/${application.freelancer_id}`}
                    className="btn btn-outline-primary"
                  >
                    <i className="fas fa-user-circle me-1"></i> View Profile
                  </Link>
                  
                  {application.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-success"
                        onClick={() => handleAcceptApplication(application.id)}
                        disabled={processingIds.includes(application.id)}
                      >
                        {processingIds.includes(application.id) ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check me-1"></i> Accept
                          </>
                        )}
                      </button>
                      
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleRejectApplication(application.id)}
                        disabled={processingIds.includes(application.id)}
                      >
                        {processingIds.includes(application.id) ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-times me-1"></i> Reject
                          </>
                        )}
                      </button>
                    </>
                  )}
                  
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => handleContactFreelancer(application.freelancer_id)}
                  >
                    <i className="fas fa-envelope me-1"></i> Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}