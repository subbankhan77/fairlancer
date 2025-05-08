"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProjectApplications from "@/components/project/ProjectApplications"; 
import { commonService } from "@/services/common";
import { useSearchParams } from "next/navigation";
import Breadcumb from "@/components/custom/dashboard/common/Breadcumb";
import BreadCrumbHeader from "@/components/custom/dashboard/common/BreadCrumbHeader";

export default function ViewApplicationsPage({ params }) {
  const projectId = params.id; 
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await commonService.getProjectById(projectId);
        
        if (response && response.status) {
          setProject(response.data.project);
        } else {
          throw new Error(response?.message || "Failed to fetch project details");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="dashboard__content hover-bgc-color pt20">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading project applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard__content hover-bgc-color pt20">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
            <hr />
            <Link href="/projects" className="btn btn-outline-primary">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="dashboard__content hover-bgc-color pt20">
        <div className="container">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Project Not Found</h4>
            <p>The project you're looking for doesn't exist or has been removed.</p>
            <hr />
            <Link href="/projects" className="btn btn-outline-primary">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard__content hover-bgc-color pt20">
      {/* Breadcrumb */}
      <Breadcumb 
        path={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Projects", link: "/projects" },
          { title: "View Applications", link: "" }
        ]}
      />
      
      <div className="container">
        <div className="row">
          <div className="col-12 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <BreadCrumbHeader
                title={`Applications for ${project.title}`}
                description="View and manage proposals"
              />
              
              <Link 
                href={`/project-details/${projectId}`}
                className="ud-btn btn-thm"
              >
                <i className="fas fa-arrow-left me-2"></i>Back to Project
              </Link>
            </div>
          </div>
          
          <div className="col-12">
            <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
              <ProjectApplications projectId={projectId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}