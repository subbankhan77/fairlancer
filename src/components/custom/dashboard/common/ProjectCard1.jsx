"use client";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from 'date-fns';
import { DEFAULT_AVATAR } from "@/config/constant";

export default function ProjectCard1({ data, onEdit, onDelete, onCreateProject }) {
  console.log(data);
  
  // Function to get proper avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return DEFAULT_AVATAR;
    
    // Check if avatar is already a full URL
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    
    // Otherwise fix the path to start with a leading slash
    return avatarPath.startsWith('/') ? avatarPath : `/${avatarPath.replace(/^public\//, '')}`;
  };

  return (
    <div className="col-md-12 mb20">
      <div className="freelancer-style1 bdr1 hover-box-shadow row ms-0 align-items-lg-center">
        <div className="col-lg-8 ps-0">
          <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
            <div className="thumb w60 position-relative rounded-circle mb15-md">
              <Image
                height={60}
                width={60}
                className="rounded-circle mx-auto"
                src={getAvatarUrl(data.client?.avatar)}
                alt={data.client?.name || 'Client'}
              />
            </div>
            <div className="details ml15 ml0-md mb15-md">
              <h5 className="title mb-3">{data.title}</h5>
              <div className="d-flex flex-wrap">
                <p className="mb-0 fz14 list-inline-item mb5-sm">
                  <i className="flaticon-money fz16 vam text-thm2 me-1" />
                  ${data.budget} ({data.budget_type || 'Fixed'})
                </p>
                <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                  <i className="flaticon-30-days fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                  {data.created_at ? formatDistanceToNow(new Date(data.created_at)) + ' ago' : 'Recently'}
                </p>
                <span className={`tag mx-2 text-${
                  data.status === "active" ? "success" :
                  data.status === "completed" ? "info" : "warning"
                }`}>
                  {data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : 'New'}
                </span>
              </div>
              <p className="text mt10">
                {data.description?.length > 100
                  ? data.description.substring(0, 100) + "..."
                  : data.description}
              </p>
              <div className="skill-tags d-flex align-items-center justify-content-start flex-wrap">
                {data.skills?.map((skill, i) => (
                  <span key={i} className={`tag ${i !== 0 ? "mx10" : ""}`}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 ps-0 ps-xl-3 pe-0">
          <div className="details">
            <div className="text-lg-end mb15">
              {data.deadline && (
                <p className="text mb-1">
                  <i className="far fa-calendar-alt me-2"></i>
                  Deadline: {data.deadline}
                </p>
              )}
              {data.duration && (
                <p className="text">
                  <i className="far fa-clock me-2"></i>
                  {data.duration}
                </p>
              )}
            </div>
            <div className="d-flex flex-column gap-2 mt15">
              <Link
                href={`/project-details/${data.id}`}
                className="ud-btn btn-light-thm w-100 text-center"
              >
                View Details
                <i className="fal fa-arrow-right-long ms-1" />
              </Link>
              
              {/* Get Project Applications Button */}
              <Link
                href={`/view-applications/${data.id}?tab=applications`}
                className="ud-btn btn-light-thm w-100 text-center"
              >
                <i className="fas fa-file-alt me-1"></i> 
                View Applications
              </Link>
              
              <div className="d-flex gap-2 mt-2">
                {/* Edit button as Link that triggers modal via onClick */}
                <Link
                  href={`/project-details/${data.id}`}
                  className="ud-btn btn-gray2 fw600 flex-grow-1 text-center"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onEdit) onEdit();
                  }}
                >
                  <i className="fas fa-edit me-1"></i> Edit
                </Link>
                
                {/* Delete button as Link that triggers delete modal */}
                <Link
                  href={`/project-details/${data.id}`}
                  className="ud-btn btn-danger fw600 flex-grow-1 text-center"
                  onClick={(e) => {
                    e.preventDefault();
                    // Open the delete modal by calling toggleDeleteModal in parent
                    if (onDelete) onDelete();
                  }}
                >
                  <i className="fas fa-trash-alt me-1"></i> Delete
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}