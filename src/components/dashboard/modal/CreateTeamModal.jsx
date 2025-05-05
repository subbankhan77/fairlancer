import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { fetchProjects } from '@/store/slices/projectSlice';
import { commonService } from '@/services/common';

const CreateTeamModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const dispatch = useDispatch();
  
  // Get projects from Redux store
  const { projects, isLoading: projectsLoading } = useSelector(state => state.projects);
  
  const [formData, setFormData] = useState({
    project_id: "",
    member_ids: []
  });

  const [errors, setErrors] = useState({});
  const [availableMembers, setAvailableMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // Fetch projects using Redux
  useEffect(() => {
    // Dispatch fetchProjects action
    dispatch(fetchProjects());
  }, [dispatch]);

  // Fetch members using commonService
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setMembersLoading(true);
        const response = await commonService.getMembers();
        
        if (response && response.data) {
          const formattedMembers = response.data.map(user => ({
            value: user.id,
            label: user.name,
            role: user.role
          }));
          
          setAvailableMembers(formattedMembers);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        // Fallback to demo data if API fails
        setAvailableMembers([
          { value: 1, label: "John Doe", role: "Developer" },
          { value: 2, label: "Jane Smith", role: "Designer" },
          { value: 3, label: "Mike Johnson", role: "Project Manager" },
          { value: 4, label: "Sarah Williams", role: "Frontend Developer" }
        ]);
      } finally {
        setMembersLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Format projects for Select component
  const projectOptions = projects.map(project => ({
    value: project.id,
    label: project.title || project.name
  }));

  const handleProjectChange = (selectedOption) => {
    setFormData({ ...formData, project_id: selectedOption.value });
    if (errors.project_id) {
      setErrors({ ...errors, project_id: null });
    }
  };

  const handleMembersChange = (selectedOptions) => {
    const memberIds = selectedOptions.map(option => option.value);
    setFormData({ ...formData, member_ids: memberIds });
    if (errors.member_ids) {
      setErrors({ ...errors, member_ids: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.project_id) {
      newErrors.project_id = "Project is required";
    }
    
    if (!formData.member_ids.length) {
      newErrors.member_ids = "At least one team member is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Team</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12 mb20">
                  <div className="form-group">
                    <label className="form-label">Project*</label>
                    {projectsLoading ? (
                      <div className="d-flex align-items-center mt-2 mb-2">
                        <span className="spinner-border spinner-border-sm text-primary me-2" role="status" aria-hidden="true"></span>
                        <span>Loading projects...</span>
                      </div>
                    ) : (
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        name="project_id"
                        options={projectOptions}
                        placeholder="Select Project"
                        onChange={handleProjectChange}
                        isSearchable={true}
                      />
                    )}
                    {errors.project_id && (
                      <div className="text-danger mt-1">{errors.project_id}</div>
                    )}
                  </div>
                </div>

                <div className="col-12 mb20">
                  <div className="form-group">
                    <label className="form-label">Team Members*</label>
                    {membersLoading ? (
                      <div className="d-flex align-items-center mt-2 mb-2">
                        <span className="spinner-border spinner-border-sm text-primary me-2" role="status" aria-hidden="true"></span>
                        <span>Loading members...</span>
                      </div>
                    ) : (
                      <Select
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                        name="member_ids"
                        options={availableMembers}
                        placeholder="Select team members"
                        onChange={handleMembersChange}
                        formatOptionLabel={option => (
                          <div className="d-flex align-items-center">
                            <span>{option.label}</span>
                            {option.role && (
                              <span className="ms-2 badge bg-light text-dark">{option.role}</span>
                            )}
                          </div>
                        )}
                        isSearchable={true}
                      />
                    )}
                    {errors.member_ids && (
                      <div className="text-danger mt-1">{errors.member_ids}</div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-thm"
              onClick={handleSubmit}
              disabled={isSubmitting || projectsLoading || membersLoading}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating...
                </>
              ) : (
                "Create Team"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;