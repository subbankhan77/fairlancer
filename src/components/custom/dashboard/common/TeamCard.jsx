import React from "react";
import Link from "next/link";
import Image from "next/image";

const TeamCard = ({ data, onView }) => {
  const { id, name, description, members, created_at, project } = data;
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="listing-style1 list-details">
        <div className="card border p-4 mb30">
          <div className="card-header d-flex justify-content-between align-items-center border-0 p-0 mb20">
            <div className="d-flex align-items-center">
              <div className="icon me-2 fs-18">
                <i className="flaticon-group text-primary"></i>
              </div>
              <h5 className="title mb-0">{name}</h5>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-link dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="flaticon-more"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#" onClick={onView}>
                    <i className="flaticon-visibility me-2"></i>View Details
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="card-body p-0">
            {description && (
              <p className="text-muted mb15 line-clamp-2">{description}</p>
            )}
            
            <div className="d-flex align-items-center mb15">
              <span className="tag me-2">Project:</span>
              <span className="tag-text">{project?.title || "N/A"}</span>
            </div>
            
            <div className="d-flex align-items-center mb15">
              <span className="tag me-2">Created:</span>
              <span className="tag-text">{formatDate(created_at)}</span>
            </div>

            <div className="mt15">
              <h6 className="mb10">Team Members ({members?.length || 0})</h6>
              <div className="position-relative d-flex align-items-center">
                {members && members.length > 0 ? (
                  <>
                    <div className="avatar-group position-relative d-flex">
                      {members.slice(0, 4).map((member, index) => (
                        <div 
                          key={index} 
                          className="avatar position-relative rounded-circle w35 h35 ms-n2 border border-white"
                          style={{ zIndex: 5 - index }}
                        >
                          {member.avatar ? (
                            <Image
                              className="rounded-circle object-fit-cover"
                              src={member.avatar}
                              alt={member.name}
                              width={35}
                              height={35}
                            />
                          ) : (
                            <div className="avatar-initials rounded-circle bg-light d-flex justify-content-center align-items-center w-100 h-100">
                              {member.name?.charAt(0) || "?"}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {members.length > 4 && (
                      <div className="ms-3 text-muted">
                        +{members.length - 4} more
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-muted">No members</span>
                )}
              </div>
            </div>

            <div className="d-grid gap-2 mt-4">
              <button 
                onClick={onView}
                className="ud-btn btn-thm"
              >
                View Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;