"use client";
import { commonService } from "@/services/common";
import { useState, useEffect } from "react";

export default function CreateProjectModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    budget_type: "fixed", // Default value
    skills: [],
    category_id: "", // New field for category
    duration: "",
    deadline: "",
    attachment: null
  });
  
  const [errors, setErrors] = useState({});
  const [skillOptions, setSkillOptions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]); // New state for categories
  const [promptText, setPromptText] = useState(""); // New state for prompt input
  const [wordCount, setWordCount] = useState(0); // Track word count
  const [isGenerating, setIsGenerating] = useState(false); // Track description generation status
  
  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await commonService.getSkills();
        console.log("Skills response:", response);
        
        if (response.status && response.data && response.data.skills) {
          // Transform the API response to match the format your component expects
          const skillOptions = response.data.skills.map(skill => ({
            value: skill.id,
            label: skill.name
          }));
          
          setSkillOptions(skillOptions);
        } else {
          console.error('Invalid skills response format:', response);
          // Fallback list if response format is unexpected
          setSkillOptions([
            { value: 1, label: "Laravel" },
            { value: 2, label: "PHP" }
          ]);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        // Fallback list if API call fails
        setSkillOptions([
          { value: 1, label: "Laravel" },
          { value: 2, label: "PHP" }
        ]);
      }
    };

    fetchSkills();
  }, []);
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await commonService.getCategories(); // You need to implement this method in your commonService
        console.log("Categories response:", response);
        
        if (response.status && response.data && response.data.categories) {
          // Transform the API response to match the format your component expects
          const categoryOptions = response.data.categories.map(category => ({
            value: category.id,
            label: category.name
          }));
          
          setCategoryOptions(categoryOptions);
        } else {
          console.error('Invalid categories response format:', response);
          // Fallback list if response format is unexpected
          setCategoryOptions([
            { value: 1, label: "Web Development" },
            { value: 2, label: "Mobile Development" }
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback list if API call fails
        setCategoryOptions([
          { value: 1, label: "Web Development" },
          { value: 2, label: "Mobile Development" }
        ]);
      }
    };

    fetchCategories();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle prompt text input change and track word count
  const handlePromptChange = (e) => {
    const inputText = e.target.value;
    setPromptText(inputText);
    
    // Calculate word count
    const words = inputText.trim().split(/\s+/);
    const count = inputText.trim() === "" ? 0 : words.length;
    setWordCount(count);
  };
  
  // Function to generate description using an API
  const generateDescription = async () => {
    if (promptText.trim() === "") {
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Replace this with your actual API call to generate description
      // For example:
      const response = await commonService.generateDescription({
        prompt: promptText,
        title: formData.title || undefined,
        category: formData.category_id ? 
          categoryOptions?.find(cat => cat.value === parseInt(formData.category_id))?.label : 
          undefined
      });
      
      if (response.status && response.data && response.data.description) {
        setFormData({
          ...formData,
          description: response.data.description
        });
      } else {
        console.error('Invalid description generation response:', response);
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Error generating description:', error);
      // You might want to show an error message to the user
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSkillChange = (e) => {
    const skillId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    // Add or remove skill based on checkbox state
    let updatedSkills;
    if (isChecked) {
      updatedSkills = [...formData.skills, skillId];
      setSelectedSkills([...selectedSkills, skillId]);
    } else {
      updatedSkills = formData.skills.filter(id => id !== skillId);
      setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    }
    
    setFormData({
      ...formData,
      skills: updatedSkills
    });
    
    // Clear skills error
    if (errors.skills) {
      setErrors({
        ...errors,
        skills: null
      });
    }
  };
  
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      attachment: e.target.files[0]
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.budget || isNaN(formData.budget)) {
      newErrors.budget = "Valid budget is required";
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }
    
    if (!formData.category_id) {
      newErrors.category_id = "Category is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format data for API
      const projectData = new FormData();
      
      // Add form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'skills') {
          // For skills array
          formData.skills.forEach(skillId => {
            projectData.append('skills[]', skillId);
          });
        } else if (key === 'attachment' && formData[key]) {
          // For file upload
          projectData.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          // For other fields
          projectData.append(key, formData[key]);
        }
      });
      
      onSubmit(projectData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Project</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Project Title */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Project Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              
              {/* Category Dropdown */}
              <div className="mb-3">
                <label htmlFor="category_id" className="form-label">Category <span className="text-danger">*</span></label>
                <select
                  className={`form-select ${errors.category_id ? "is-invalid" : ""}`}
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category_id && <div className="invalid-feedback">{errors.category_id}</div>}
              </div>
              
              {/* AI Description Generator */}
              <div className="mb-3 border rounded p-3">
                <label htmlFor="prompt" className="form-label">Generate Description</label>
                <div className="input-group mb-2">
                  <textarea
                    className="form-control"
                    id="prompt"
                    rows="2"
                    value={promptText}
                    onChange={handlePromptChange}
                    placeholder="Enter  project description (max 50 words)"
                    maxLength={500}
                  ></textarea>
                  <button 
                    className="btn btn-outline-primary" 
                    type="button" 
                    onClick={generateDescription}
                    disabled={isGenerating || promptText.trim() === "" || wordCount > 50}
                  >
                    {isGenerating ? "Generating..." : "Generate"}
                  </button>
                </div>
                <div className={`small ${wordCount > 50 ? "text-danger" : "text-muted"}`}>
                  {wordCount}/50 words {wordCount > 50 ? "(limit exceeded)" : ""}
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description <span className="text-danger">*</span></label>
                <textarea
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter project description"
                ></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>
              
              {/* Budget & Budget Type */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="budget" className="form-label">Budget <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className={`form-control ${errors.budget ? "is-invalid" : ""}`}
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Enter budget"
                  />
                  {errors.budget && <div className="invalid-feedback">{errors.budget}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="budget_type" className="form-label">Budget Type</label>
                  <select
                    className="form-select"
                    id="budget_type"
                    name="budget_type"
                    value={formData.budget_type}
                    onChange={handleChange}
                  >
                    <option value="fixed">Fixed</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>
              
              {/* Skills */}
              <div className="mb-3">
                <label className="form-label">Skills <span className="text-danger">*</span></label>
                <div className={`border rounded p-3 ${errors.skills ? "border-danger" : ""}`}>
                  <div className="row">
                    {skillOptions.map(skill => (
                      <div className="col-md-4 mb-2" key={skill.value}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`skill-${skill.value}`}
                            value={skill.value}
                            checked={formData.skills.includes(skill.value)}
                            onChange={handleSkillChange}
                          />
                          <label className="form-check-label" htmlFor={`skill-${skill.value}`}>
                            {skill.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {errors.skills && <div className="text-danger mt-1 small">{errors.skills}</div>}
              </div>
              
              {/* Duration & Deadline */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="duration" className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 2 weeks, 1 month"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="deadline" className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* File Attachment */}
              <div className="mb-3">
                <label htmlFor="attachment" className="form-label">Attachment</label>
                <input
                  type="file"
                  className="form-control"
                  id="attachment"
                  name="attachment"
                  onChange={handleFileChange}
                />
                <div className="form-text">Attach any relevant files (PDF, DOC, etc.)</div>
              </div>
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
                type="submit"
                className="ud-btn btn-thm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}