import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

const EditTeamModal = ({ isOpen, onClose, onUpdate, team, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project_id: "",
    member_ids: []
  });

  const [errors, setErrors] = useState({});
  const [availableMembers, setAvailableMembers] = useState([]);

  // Fetch projects from Redux store
  const projects = useSelector(state => state.projects.projects);
  const users = useSelector(state => state.users.users);

  useEffect(() => {
    // Initialize form with team data when available
    if (team) {
      setFormData({
        name: team.name || "",
        description: team.description || "",
        project_id: team.project?.id || "",
        member_ids: team.members?.map(member => member.id) || []
      });
    }
  }, [team]);

  useEffect(() => {
    // Format users for react-select
    if (users && users.length > 0) {
      const formattedUsers = users.map(user => ({
        value: user.id,
        label: user.name,
        role: user.role
      }));
      setAvailableMembers(formattedUsers);
    }
  }, [users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

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
    
    if (!formData.name.trim()) {
      newErrors.name = "Team name is required";
    }
    
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
      onUpdate(formData);
    }
  };

  if (!isOpen || !team) return null;

  // Find selected project option
  const selectedProject = projects.find(p => p.id === formData.project_id);
  const projectOption = selectedProject ? { value: selectedProject.id, label: selectedProject.title } : null;

  // Find selected members options
  const selectedMembersOptions = availableMembers.filter(member => 
    formData.member_ids.includes(member.value)
  );

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Team</h5>
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
                    <label className="form-label">Team Name*</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter team name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && (
                      <div className="text-danger mt-1">{errors.name}</div>
                    )}
                  </div>
                </div>

                <div className="col-12 mb20">
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Brief description of the team's purpose"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <div className="col-12 mb20">
                  <div className="form-group">
                    <label className="form-label">Project*</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      name="project_id"
                      options={projects.map(project => ({
                        value: project.id,
                        label: project.title
                      }))}
                      value={projectOption}
                      placeholder="Select Project"
                      onChange={handleProjectChange}
                    />
                    {errors.project_id && (
                      <div className="text-danger mt-1">{errors.project_id}</div>
                    )}
                  </div>
                </div>

                <div className="col-12 mb20">
                  <div className="form-group">
                    <label className="form-label">Team Members*</label>
                    <Select
                      isMulti
                      className="basic-multi-select"
                      classNamePrefix="select"
                      name="member_ids"
                      options={availableMembers}
                      value={selectedMembersOptions}
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
                    />
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;