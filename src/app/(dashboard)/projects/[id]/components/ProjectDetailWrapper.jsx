"use client";
import { useState, useEffect } from "react";
import { Sticky, StickyContainer } from "react-sticky";
import useScreen from "@/hook/useScreen";
import Image from "next/image";
import { useParams } from "next/navigation";

import Breadcumb from "@/components/custom/dashboard/common/Breadcumb";
import BreadCrumbHeader from "@/components/custom/dashboard/common/BreadCrumbHeader";
import { commonService } from "@/services/common";
import DashboardSkeleton from "@/components/custom/dashboard/common/DashboardSkeleton";

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

const proposalSchema = z.object({
  proposed_price: z.string()
    .min(1, 'Hourly rate is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid price'),
  cover_letter: z.string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(1000, 'Cover letter must not exceed 1000 characters')
});

export default function ProjectDetail2() {
  const isMatchedScreen = useScreen(1216);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(proposalSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmit(true);
    try {
      const response = await commonService.submitProposal({
        project_id: id,
        ...data
      });

      if (response.status) {
        toast.success("Proposal submitted successfully!");
        reset();
      } else {
        toast.error(response.message || "Failed to submit proposal");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await commonService.getProject(id);
        setProjectData(response.data.project);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [id]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dashboard__content pt20">
      <Breadcumb path={[
        { title: "Dashboard", link: "/dashboard" },
        { title: "Projects", link: "/projects" },
        { title: projectData?.title || "Project Details", link: "#" },
      ]}/>
      <BreadCrumbHeader
        title={"Project Details"}
        description="Information"
      />
      <div className="row wrap">
        <div className="col-12">
          <div className="cta-service-v1 mb30 freelancer-single-v1 pt60 pb60 bdrs16 position-relative overflow-hidden d-flex align-items-center">
            <Image
              width={198}
              height={226}
              style={{ height: "fit-content" }}
              className="left-top-img wow zoomIn"
              src="/images/vector-img/left-top.png"
              alt=""
            />
            <Image
              width={255}
              height={181}
              style={{ height: "fit-content" }}
              className="right-bottom-img wow zoomIn"
              src="/images/vector-img/right-bottom.png"
              alt=""
            />
            <div className="row wow fadeInUp">
              <div className="col-xl-12">
                <div className="position-relative pl60 pl20-sm">
                  <h2>{projectData?.title}</h2>
                  <div className="list-meta mt15">
                    <p className="mb-0 dark-color fz15 fw500 list-inline-item mb5-sm">
                      <i className="flaticon-place vam fz20 text-thm2 me-2"></i>
                      {projectData?.client?.name || "Unknown Client"}
                    </p>
                    <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                      <i className="flaticon-calendar text-thm2 vam fz20 me-2"></i>
                      {new Date(projectData?.created_at).toLocaleDateString()}
                    </p>
                    <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                      <i className="flaticon-dollar text-thm2 vam fz20 me-2"></i>
                      Budget: ${projectData?.budget}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="scrollbalance-inner">
              <div className="row">
                <div className="col-sm-6 col-xl-4">
                  <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                    <div className="icon flex-shrink-0">
                      <span className="flaticon-notification-1" />
                    </div>
                    <div className="details">
                      <h5 className="title">Budget Type</h5>
                      <p className="mb-0 text">{projectData?.budget_type}</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-4">
                  <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                    <div className="icon flex-shrink-0">
                      <span className="flaticon-dollar" />
                    </div>
                    <div className="details">
                      <h5 className="title">Project Status</h5>
                      <p className="mb-0 text">{projectData?.status}</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-4">
                  <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                    <div className="icon flex-shrink-0">
                      <span className="flaticon-fifteen" />
                    </div>
                    <div className="details">
                      <h5 className="title">Duration</h5>
                      <p className="mb-0 text">{projectData?.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="service-about">
                <h4>Description</h4>
                <p className="text mb30">{projectData?.description}</p>
                
                {projectData?.attachments && (
                  <>
                    <hr className="opacity-100 mb60 mt60" />
                    <h4 className="mb30">Attachments</h4>
                    <div className="row">
                      {Array.isArray(projectData.attachments) && projectData.attachments.map((attachment, index) => (
                        <div key={index} className="col-6 col-lg-3">
                          <div className="project-attach">
                            <h6 className="title">{attachment.name || "Project Brief"}</h6>
                            <p>{attachment.type || "PDF"}</p>
                            <span className="icon flaticon-page" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}


                {(projectData?.tags) && (<>
                    <hr className="opacity-100 mb60 mt30" />
                    <h4 className="mb30">Skills Required</h4>
                    <div className="mb60">
                      {(projectData?.tags).map((item, i) => (
                        <a
                          key={i}
                          className={`tag list-inline-item mb-2 mb-xl-0 ${
                            Number(item.length) === 7 ? "mr0" : "mr10"
                          }`}
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </>
                )}

                <hr className="opacity-100 mb60" />
                <div className="bsp_reveiw_wrt mt25">
                  <h4>Send Your Proposal</h4>
                  <form className="comments_form mt30 mb30-md" onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb20">
                          <label className="fw500 ff-heading dark-color mb-2">
                            Your hourly price
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="0.00"
                            {...register("proposed_price")}
                          />
                          {errors.hourly_rate && (
                            <span className="text-danger">{errors.proposed_price.message}</span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-4">
                          <label className="fw500 fz16 ff-heading dark-color mb-2">
                            Cover Letter
                          </label>
                          <textarea
                            className="pt15"
                            rows={6}
                            placeholder="Write your proposal details here..."
                            {...register("cover_letter")}
                          />
                          {errors.cover_letter && (
                            <span className="text-danger">{errors.cover_letter.message}</span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="d-grid">
                          <button 
                            type="submit" 
                            className="ud-btn btn-thm"
                            disabled={isSubmit}
                          >
                            {isSubmit ? "Submitting..." : "Submit a Proposal"}
                            <i className="fal fa-arrow-right-long" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}