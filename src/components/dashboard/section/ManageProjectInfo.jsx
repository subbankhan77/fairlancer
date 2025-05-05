"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  setCurrentPage 
} from '@/store/slices/projectSlice';

import Pagination1 from "@/components/section/Pagination1";
import ProposalModal1 from "../modal/ProposalModal1";
import DeleteModal from "../modal/DeleteModal";
import EditProjectModal from "../modal/EditProjectModal";
import CreateProjectModal from "../modal/CreateProjectModal";

import Breadcumb from "@/components/custom/dashboard/common/Breadcumb";
import BreadCrumbHeader from "@/components/custom/dashboard/common/BreadCrumbHeader";
import ProjectCard1 from "@/components/custom/dashboard/common/ProjectCard1";
import ProjectCardSkeleton from "@/components/custom/loader/ProjectCardSkeleton";

export default function ManageProjectInfo() {
  
  // Redux state and dispatch
  const dispatch = useDispatch();
  const { projects, lastPage, currentPage, isLoading, isSubmitting } = useSelector(state => state.projects);
  
  // Local state for modals
  const [editProject, setEditProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchProjects(page));
  };

  const handleEditProject = (project) => {
    setEditProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (projectId) => {
    const project = projects?.find(p => p.id === projectId);
    if (project) {
      setProjectToDelete(project);
      setShowDeleteModal(true);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    dispatch(deleteProject(projectToDelete.id));
    closeDeleteModal();
  };

  const handleUpdateProject = async (updatedData) => {
    dispatch(updateProject({ id: editProject.id, updatedData }));
    setIsEditModalOpen(false);
  };

  const handleCreateProject = async (projectData) => {
    dispatch(createProject(projectData));
    setIsCreateModalOpen(false);
  };

  const openCreateProjectModal = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <>
      <div className="dashboard__content hover-bgc-color pt20">
        <Breadcumb path={[
            { title: "Dashboard", link: "/dashboard" },
            { title: "Projects", link: "/projects" },
        ]}/>
        <div className="d-flex justify-content-between align-items-center mb20">
          <BreadCrumbHeader
            title="Manage Project"
            description="Project List"
          />
          
          <button 
            className="ud-btn btn-thm add-listing" 
            onClick={openCreateProjectModal}
          >
            <i className="fas fa-plus me-2"></i> Create Project
          </button>
        </div>
        
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
                            <ProjectCard1 
                              key={index} 
                              data={project} 
                              onEdit={() => handleEditProject(project)}
                              onDelete={() => handleDeleteClick(project.id)}
                              onCreateProject={openCreateProjectModal}
                            />
                          ))}
                          {
                            lastPage > 1 ? (
                              <Pagination1 
                                currentPage={currentPage}
                                totalPages={lastPage}
                                onPageChange={handlePageChange}
                              />
                            ) : ""
                          }
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
      </div>
      
      {/* Modals */}
      <ProposalModal1 />
      
      {/* Delete modal */}
      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteProject}
          title="Delete Project"
          message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
        />
      )}
      
      {/* Edit modal */}
      {isEditModalOpen && (
        <EditProjectModal 
          project={editProject}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateProject}
          isSubmitting={isSubmitting}
        />
      )}
      
      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProject}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}