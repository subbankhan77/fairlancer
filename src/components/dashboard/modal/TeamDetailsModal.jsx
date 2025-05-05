import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { fetchTeamDetails } from "@/store/slices/teamSlice";

const TeamDetailsModal = ({ isOpen, onClose, team }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("members");
  const [teamDetails, setTeamDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (team?.id) {
      setIsLoading(true);
      // Fetch detailed team information including members
      dispatch(fetchTeamDetails(team.id))
        .then((response) => {
          if (response.payload) {
            setTeamDetails(response.payload);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [team?.id, dispatch]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (!isOpen) return null;

  // Loading state
  if (isLoading) {
    return (
      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
        <div className="modal-backdrop fade show" onClick={onClose}></div>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Team Details</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading team details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use initial team data if details aren't loaded yet
  const displayTeam = teamDetails || team;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{displayTeam.name}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="team-details-header d-flex align-items-center mb-4">
              <div className="team-icon d-flex justify-content-center align-items-center bg-light rounded-circle" style={{ width: "50px", height: "50px" }}>
                <i className="fas fa-users text-primary fs-4"></i>
              </div>
              <div className="team-info ms-3">
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-1">{displayTeam.name}</h5>
                  <span className="badge bg-primary">{displayTeam.members?.length || 0} Members</span>
                </div>
                <p className="text-muted mb-0">
                  Created on {formatDate(displayTeam.created_at)}
                </p>
              </div>
            </div>

            {displayTeam.description && (
              <div className="mb-4">
                <p>{displayTeam.description}</p>
              </div>
            )}

            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "members" ? "active" : ""}`}
                  onClick={() => setActiveTab("members")}
                >
                  Members
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "activities" ? "active" : ""}`}
                  onClick={() => setActiveTab("activities")}
                >
                  Activities
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "info" ? "active" : ""}`}
                  onClick={() => setActiveTab("info")}
                >
                  Project Info
                </button>
              </li>
            </ul>

            <div className="tab-content">
              {/* Members Tab */}
              {activeTab === "members" && (
                <div className="tab-pane fade show active">
                  <div className="team-members">
                    <div className="row">
                      {displayTeam.members && displayTeam.members.length > 0 ? (
                        displayTeam.members.map((member, index) => (
                          <div key={index} className="col-md-6 mb-3">
                            <div className="d-flex align-items-center p-3 border rounded">
                              <div className="member-avatar me-3">
                                {member.avatar ? (
                                  <Image
                                    src={member.avatar}
                                    alt={member.name}
                                    width={50}
                                    height={50}
                                    className="rounded-circle"
                                  />
                                ) : (
                                  <div className="avatar-placeholder rounded-circle bg-light d-flex justify-content-center align-items-center" style={{ width: "50px", height: "50px" }}>
                                    <span className="fs-4">{member.name?.charAt(0) || "U"}</span>
                                  </div>
                                )}
                              </div>
                              <div className="member-info">
                                <h6 className="mb-1">{member.name}</h6>
                                <p className="mb-0 text-muted">{member.role || "Team Member"}</p>
                                {member.email && (
                                  <small className="text-muted">{member.email}</small>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center py-4">
                          <p className="mb-0">No team members found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Activities Tab */}
              {activeTab === "activities" && (
                <div className="tab-pane fade show active">
                  <div className="team-activities">
                    {displayTeam.activities && displayTeam.activities.length > 0 ? (
                      <div className="timeline">
                        {displayTeam.activities.map((activity, index) => (
                          <div key={index} className="timeline-item mb-3 pb-3 border-bottom">
                            <div className="d-flex">
                              <div className="timeline-icon me-3">
                                <i className={`fas fa-${activity.icon || "check-circle"} text-primary`}></i>
                              </div>
                              <div className="timeline-content">
                                <p className="mb-1">{activity.description}</p>
                                <small className="text-muted">
                                  {formatDate(activity.created_at)} by {activity.user?.name || "Unknown User"}
                                </small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="mb-0">No activities recorded yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Project Info Tab */}
              {activeTab === "info" && (
                <div className="tab-pane fade show active">
                  <div className="project-info">
                    {displayTeam.project ? (
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">{displayTeam.project.title}</h5>
                          <p className="card-text">{displayTeam.project.description}</p>
                          
                          <div className="row mt-4">
                            <div className="col-md-6 mb-3">
                              <h6 className="mb-2">Project Status</h6>
                              <span className={`badge bg-${
                                displayTeam.project.status === "completed" ? "success" :
                                displayTeam.project.status === "in_progress" ? "primary" :
                                displayTeam.project.status === "on_hold" ? "warning" : "secondary"
                              }`}>
                                {displayTeam.project.status?.replace("_", " ") || "N/A"}
                              </span>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                              <h6 className="mb-2">Deadline</h6>
                              <p className="mb-0">{formatDate(displayTeam.project.deadline)}</p>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                              <h6 className="mb-2">Client</h6>
                              <p className="mb-0">{displayTeam.project.client?.name || "N/A"}</p>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                              <h6 className="mb-2">Budget</h6>
                              <p className="mb-0">${displayTeam.project.budget?.toLocaleString() || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="mb-0">No project information available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsModal;