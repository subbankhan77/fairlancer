"use client";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from 'date-fns';
import { DEFAULT_AVATAR } from "@/config/constant";

export default function ProjectFreelancerCard({ data }) {
  // Function to get proper avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return DEFAULT_AVATAR;
    
    // Check if avatar is already a full URL
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    
    // Otherwise, append API URL
    return `${process.env.NEXT_PUBLIC_API_URL}/${avatarPath}`;
  };
  
  return (
    <div className="col-md-12 mb20">
      <div className="freelancer-style1 bdr1 hover-box-shadow row ms-0 align-items-lg-center">
        <div className="col-lg-8 ps-0">
          <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
            {/* Use thumbnail instead of client avatar */}
            <div className="thumb position-relative mb15-md" style={{ width: '80px', height: '80px' }}>
              {data.thumbnail ? (
                <Image
                  height={80}
                  width={80}
                  className="rounded mx-auto object-fit-cover"
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${data.thumbnail}`}
                  alt={data.title}
                />
              ) : (
                <Image
                  height={80}
                  width={80}
                  className="rounded mx-auto object-fit-cover"
                  src="/images/listings/g-1.jpg"
                  alt="Project thumbnail"
                />
              )}
            </div>
            <div className="details ml15 ml0-md mb15-md">
              <h5 className="title mb-3">{data.title}</h5>
              <div className="d-flex flex-wrap">
                <p className="mb-0 fz14 list-inline-item mb5-sm">
                  <i className="flaticon-money fz16 vam text-thm2 me-1" />
                  ${data.min_price} - ${data.max_price}
                </p>
                {data.created_at && (
                  <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                    <i className="flaticon-30-days fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                    {formatDistanceToNow(new Date(data.created_at)) + ' ago'}
                  </p>
                )}
                {data.status && (
                  <span className={`tag mx-2 text-${
                    data.status === "active" ? "success" :
                    data.status === "completed" ? "info" : "warning"
                  }`}>
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                  </span>
                )}
              </div>
              <p className="text mt10">
                {data.description?.length > 100
                  ? data.description.substring(0, 100) + "..."
                  : data.description}
              </p>
              {data.skills && data.skills.length > 0 && (
                <div className="skill-tags d-flex align-items-center justify-content-start flex-wrap">
                  {data.skills.map((skill, i) => (
                    <span key={i} className={`tag ${i !== 0 ? "mx10" : ""}`}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
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
            {/* Removed all buttons as requested */}
          </div>
        </div>
      </div>
    </div>
  );
}