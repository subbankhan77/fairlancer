"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import SelectInput from "../option/SelectInput";

// Import the FreelancerReviewSummary component
import FreelancerReviewSummary from "@/components/project/FreelancerReviewSummary";

// filepond
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

// API service import
import { commonService } from '@/services/common';
import api from '@/lib/axios';

// Validation schemas
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  languages: z.array(z.string()).optional()
});

// Updated skill schema for multi-select
const skillSchema = z.object({
  selectedSkills: z.array(z.number()).min(1, 'Please select at least one skill')
});

export default function ProfileWithSkills() {
  const { data: session } = useSession();
  
  // Profile state
  const [profile, setProfile] = useState(null);
  const [files, setFiles] = useState([]);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [getLanguage, setLanguage] = useState({
    option: "Select",
    value: []
  });
  
  // Skills state
  const [availableSkills, setAvailableSkills] = useState([]); // All skills for dropdown
  const [selectedSkills, setSelectedSkills] = useState([]); // For multi-select
  const [isSkillSubmitting, setIsSkillSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAvailableSkills, setIsLoadingAvailableSkills] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");

  // Profile form setup
  const {
    register: registerProfile,
    setValue: setProfileValue,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors }
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // Skills form setup
  const {
    handleSubmit: handleSkillSubmit,
    setValue: setSkillValue,
    formState: { errors: skillErrors },
    reset: resetSkill
  } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      selectedSkills: []
    }
  });

  // Load profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await commonService.getProfile();
        const userData = response.data.user;
        setProfile(userData);
        
        // Initialize all form fields
        resetProfile(userData);
        
        // Set language state if available from profile
        if (userData.languages) {
          let languagesArray = [];
          try {
            // Try to parse if it's a JSON string
            if (typeof userData.languages === 'string') {
              languagesArray = JSON.parse(userData.languages);
            } else if (Array.isArray(userData.languages)) {
              languagesArray = userData.languages;
            } else {
              languagesArray = [userData.languages];
            }
          } catch (e) {
            console.error("Error parsing languages:", e);
            languagesArray = [];
          }
          
          if (languagesArray.length > 0) {
            // Map values to options for display
            const languageOptions = languagesArray.map(lang => {
              // Find matching option for the language value
              const option = [
                { option: "English", value: "english" },
                { option: "French", value: "french" },
                { option: "German", value: "german" },
                { option: "Japanese", value: "japanese" },
              ]?.find(item => item.value === lang)?.option || lang;
              
              return { option, value: lang };
            });
            
            setLanguage({
              option: languageOptions.map(opt => opt.option).join(', '),
              value: languagesArray
            });
            
            // Make sure the form value is updated too
            setProfileValue('languages', languagesArray);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
        setErrorMessage("Failed to load profile data. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [resetProfile, setProfileValue]);

  // Load user avatar
  useEffect(() => {
    if (session?.user?.image) {
      setFiles([{
        source: session.user.image,
        options: {
          type: 'local',
          metadata: {
            poster: session.user.image
          }
        }
      }]);
    }
  }, [session]);

  // IMPROVED: Fetch available skills for dropdown
  useEffect(() => {
    const fetchAvailableSkills = async () => {
      setIsLoadingAvailableSkills(true);
      setErrorMessage("");
      
      try {
        // Get skills for dropdown
        const skillsResponse = await commonService.getSkills();
        
        if (skillsResponse && skillsResponse.data && Array.isArray(skillsResponse.data.skills)) {
          // Make sure we're setting the skills array to the state
          setAvailableSkills(skillsResponse.data.skills);
        } else {
          console.warn("Skills data format unexpected:", skillsResponse);
          setAvailableSkills([]);
          setErrorMessage("Skills data format is unexpected. Using empty list.");
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        toast.error("Failed to load skills");
        setAvailableSkills([]);
        setErrorMessage("Failed to load skills. Please try refreshing the page.");
      } finally {
        setIsLoadingAvailableSkills(false);
      }
    };

    fetchAvailableSkills();
  }, []);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll('.custom-dropdown');
      
      const isOutside = Array.from(dropdowns).every(dropdown => {
        return dropdown && !dropdown.contains(event.target);
      });
      
      if (isOutside && isSkillDropdownOpen) {
        setIsSkillDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSkillDropdownOpen]);

  // Profile submission handler
  const onProfileSubmit = async (data) => {
    setIsProfileSubmitting(true);
    setErrorMessage("");
    try {
      // Make sure to include languages from state
      const updatedData = {
        ...data,
        languages: getLanguage.value // Use the state value to ensure consistency
      };
      
      await commonService.updateProfile(updatedData);
      
      // Refresh profile data after update
      const response = await commonService.getProfile();
      setProfile(response.data.user);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error("Update error:", error);
      const errorMsg = error.response?.data?.message || 'Update failed';
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  // Handle checkbox change for skills
  const handleSkillCheckboxChange = (e) => {
    const skillId = parseInt(e.target.value);
    
    if (e.target.checked) {
      const updatedSkills = [...selectedSkills, skillId];
      setSelectedSkills(updatedSkills);
      setSkillValue('selectedSkills', updatedSkills);
    } else {
      const updatedSkills = selectedSkills.filter(id => id !== skillId);
      setSelectedSkills(updatedSkills);
      setSkillValue('selectedSkills', updatedSkills);
    }
  };

  // Handle removing a skill
  const handleDeleteSkill = async (skillId) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    
    setIsSkillSubmitting(true);
    setErrorMessage("");
    try {
      const response = await commonService.deleteSkill(skillId);
      
      // Refresh profile to get updated skills
      const profileResponse = await commonService.getProfile();
      setProfile(profileResponse.data.user);
      
      toast.success("Skill deleted successfully");
    } catch (error) {
      console.error("Error deleting skill:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete skill";
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setIsSkillSubmitting(false);
    }
  };

  // Skills submission handler - Add multiple skills
  const onSkillSubmit = async (data) => {
    if (data.selectedSkills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }
    
    setIsSkillSubmitting(true);
    setErrorMessage("");
    try {
      // Add multiple skills to profile
      await addSkillsToProfile(data.selectedSkills);
      
      // Reset form
      resetSkill({ selectedSkills: [] });
      setSelectedSkills([]);
      setIsSkillDropdownOpen(false); // Close dropdown after submission
      
    } catch (error) {
      console.error("Error with skill operation:", error);
      const errorMsg = error.response?.data?.message || "Operation failed";
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setIsSkillSubmitting(false);
    }
  };

  // Function to add multiple skills to profile by IDs
  const addSkillsToProfile = async (skillIds) => {
    try {
      const response = await api.patch('/freelancer/skills/add', {
        skills: skillIds 
      });
      
      if (response && response.data && response.data.status) {
        // Refresh profile to get updated skills
        const profileResponse = await commonService.getProfile();
        setProfile(profileResponse.data.user);
        
        toast.success("Skills added successfully");
      } else {
        const errorMsg = response?.data?.message || "Failed to add skills";
        toast.error(errorMsg);
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error("Error adding skills:", error);
      throw error; // Rethrow for the parent function to handle
    }
  };

  // Filter skills based on search term
  const filteredSkills = availableSkills.filter(skill => 
    skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase())
  );

  // Language handler
  const languageHandler = (selectedOptions) => {
    // Handle both single and multiple selections
    if (!selectedOptions) {
      setLanguage({ option: "Select", value: [] });
      setProfileValue('languages', []);
      return;
    }
  
    // If it's an array (multiple selections)
    if (Array.isArray(selectedOptions)) {
      const languageValues = selectedOptions.map(opt => opt.value);
      setLanguage({ 
        option: selectedOptions.map(opt => opt.option).join(', '),
        value: languageValues
      });
      setProfileValue('languages', languageValues);
    }

    // If it's a single selection
    else {
      setLanguage({
        option: selectedOptions.option,
        value: [selectedOptions.value]
      });
      setProfileValue('languages', [selectedOptions.value]);
    }
  };

  return (
    <div className="container">
      {/* Profile Details Section */}
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25">
          <h5 className="list-title">Profile Details</h5>
        </div>

        <div className="col-xl-7">
          <div className="profile-box d-sm-flex align-items-center mb30">
            <div className="profile-img mb20-sm">
              <FilePond
                files={files}
                allowReorder={true}
                onupdatefiles={setFiles}
                allowMultiple={false}
                maxFiles={1}
                server={{
                  process: async (fieldName, file, metadata, load) => {
                    try {
                      await commonService.updateAvatar(file);
                      load(file);
                      toast.success('Avatar updated');
                    } catch (error) {
                      toast.error('Avatar update failed');
                    }
                  }
                }}
                name="avatar"
                labelIdle='Drag & Drop your picture or <span class="filepond--label-action">Browse</span>'
                acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg', 'image/gif']}
                imagePreviewHeight={170}
                imageCropAspectRatio="1:1"
                imageResizeTargetWidth={200}
                imageResizeTargetHeight={200}
                stylePanelLayout="compact circle"
                styleLoadIndicatorPosition="center bottom"
                styleProgressIndicatorPosition="right bottom"
                styleButtonRemoveItemPosition="left bottom"
                styleButtonProcessItemPosition="right bottom"
                className="profile-filepond"
              />
            </div>
            <div className="profile-content ml20 ml0-xs">
              <p className="text mb-0">
                Max file size is 1MB, Minimum dimension: 330x300 And Suitable
                files are .jpg &amp; .png
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-7">
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="form-style1">
            <div className="row">
              <div className="col-sm-6">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${profileErrors.name ? 'is-invalid' : ''}`}
                    {...registerProfile('name')}
                  />
                  {profileErrors.name && (
                    <span className="text-danger">{profileErrors.name.message}</span>
                  )}
                </div>
              </div>
              
              <div className="col-sm-6">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={profile?.email}
                    disabled
                  />
                </div>
              </div>
              
              <div className="col-sm-6">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Headline
                  </label>
                  <input
                    type="text"
                    className={`form-control ${profileErrors.headline ? 'is-invalid' : ''}`}
                    {...registerProfile('headline')}
                  />
                  {profileErrors.headline && (
                    <span className="text-danger">{profileErrors.headline.message}</span>
                  )}
                </div>
              </div>
              
              <div className="col-sm-6">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Location
                  </label>
                  <input
                    type="text"
                    className={`form-control ${profileErrors.location ? 'is-invalid' : ''}`}
                    {...registerProfile('location')}
                  />
                  {profileErrors.location && (
                    <span className="text-danger">{profileErrors.location.message}</span>
                  )}
                </div>
              </div>
              
              <div className="col-md-12">
                <div className="mb10">
                  <label className="heading-color ff-heading fw500 mb10">
                    Bio
                  </label>
                  <textarea 
                    cols={30} 
                    rows={6} 
                    className={`form-control ${profileErrors.bio ? 'is-invalid' : ''}`}
                    {...registerProfile('bio')}
                  />
                  {profileErrors.bio && (
                    <span className="text-danger">{profileErrors.bio.message}</span>
                  )}
                </div>
              </div>
              
              <div className="col-md-12">
                <div className="text-start">
                  <button 
                    type="submit" 
                    className="ud-btn btn-thm"
                    disabled={isProfileSubmitting}
                  >
                    {isProfileSubmitting ? 'Saving...' : 'Save Changes'}
                    <i className="fal fa-arrow-right-long" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Feedback Summary Section */}
      <FreelancerReviewSummary />

      {/* Skills Section */}
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25">
          <h5 className="list-title">Skills</h5>
          <p className="fz14 mb0">Showcase your expertise by adding relevant skills.</p>
        </div>
        
        {/* Display error message if any */}
        {errorMessage && (
          <div className="alert alert-danger mb20">
            <i className="fas fa-exclamation-circle me-2"></i>
            {errorMessage}
          </div>
        )}
        
        {/* Skills List with Loading State */}
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-thm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : profile?.skills?.length > 0 ? (
          <div className="row mb30">
            {profile.skills.map((skill) => (
              <div key={skill.id} className="col-sm-6 col-xl-4 mb20">
                <div className="skill-item p20 bdrs4 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb10">
                    <h6 className="mb-0 text-thm">{skill.name}</h6>
                  </div>
                  <div className="skill-actions position-absolute">
                    <button 
                      className="btn p-0" 
                      onClick={() => handleDeleteSkill(skill.id)}
                      title="Delete"
                      disabled={isSkillSubmitting}
                    >
                      <i className="fas fa-trash-alt text-danger"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info mb30">
            <i className="fas fa-info-circle me-2"></i>
            No skills added yet. Add your professional skills below to showcase your expertise.
          </div>
        )}

        {/* Add Multiple Skills Form with Fixed Dropdown Scrolling */}
        <div className="col-lg-7" id="skillForm">
          <form onSubmit={handleSkillSubmit(onSkillSubmit)} className="form-style1">
            <div className="row">
              <div className="col-sm-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Select Skills (check multiple)
                  </label>
                  
                  <div className="custom-dropdown">
                    {/* Dropdown Toggle Button */}
                    <button 
                      type="button"
                      className="form-control text-start d-flex justify-content-between align-items-center"
                      onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
                      disabled={isLoadingAvailableSkills}
                    >
                      <span>
                        {selectedSkills.length > 0 
                          ? `${selectedSkills.length} skill${selectedSkills.length > 1 ? 's' : ''} selected` 
                          : 'Select skills'}
                      </span>
                      <i className={`fa fa-chevron-${isSkillDropdownOpen ? 'up' : 'down'}`}></i>
                    </button>
                    
                    {/* Dropdown Menu with Search and Checkboxes */}
                    {isSkillDropdownOpen && (
                      <div className="custom-dropdown-menu">
                        {/* Search input */}
                        <div className="dropdown-search p-2">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search skills..."
                            value={skillSearchTerm}
                            onChange={(e) => setSkillSearchTerm(e.target.value)}
                          />
                        </div>
                        
                        {isLoadingAvailableSkills ? (
                          <div className="text-center p-3">
                            <div className="spinner-border spinner-border-sm text-thm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <span className="ms-2">Loading skills...</span>
                          </div>
                        ) : availableSkills.length > 0 ? (
                          <>
                            <div className="custom-dropdown-options">
                              {filteredSkills.length > 0 ? (
                                filteredSkills.map(skill => (
                                  <div key={skill.id} className="custom-dropdown-item">
                                    <label>
                                      <input
                                        type="checkbox"
                                        value={skill.id}
                                        checked={selectedSkills.includes(skill.id)}
                                        onChange={handleSkillCheckboxChange}
                                      />
                                      <span>{skill.name}</span>
                                    </label>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center p-3">
                                  <p className="mb-0">No skills match your search</p>
                                </div>
                              )}
                            </div>
                            <div className="dropdown-actions d-flex justify-content-between">
                              <button 
                                type="button" 
                                className="btn btn-sm btn-outline-secondary" 
                                onClick={() => {
                                  setSelectedSkills([]);
                                  setSkillValue('selectedSkills', []);
                                }}
                              >
                                Clear
                              </button>
                              <button 
                                type="button"
                                className="btn btn-sm btn-thm" 
                                onClick={() => setIsSkillDropdownOpen(false)}
                              >
                                Done
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="p-3 text-center">No skills available</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Error message */}
                  {skillErrors.selectedSkills && (
                    <span className="text-danger fz14">{skillErrors.selectedSkills.message}</span>
                  )}
                </div>
              </div>
              
              {/* Selected skills counter outside dropdown */}
              {selectedSkills.length > 0 && (
                <div className="col-sm-12 mb-3">
                  <div className="selected-skills-count">
                    <span className="badge bg-primary-soft text-primary">
                      {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                </div>
              )}
              
              <div className="col-md-12">
                <div className="d-flex align-items-center">
                  <button 
                    type="submit" 
                    className="ud-btn btn-thm"
                    disabled={isSkillSubmitting || isLoadingAvailableSkills || selectedSkills.length === 0}
                  >
                    {isSkillSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding Skills...
                      </>
                    ) : (
                      <>
                        Add Selected Skills
                        <i className="fal fa-arrow-right-long ms-1"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <style jsx>{`
          .skill-item {
            background-color: #f7f7f7;
            transition: all 0.3s ease;
            border: 1px solid transparent;
          }
          
          .skill-item:hover {
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            border-color: #eaeaea;
          }
          
          .skill-actions {
            top: 15px;
            right: 15px;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .skill-item:hover .skill-actions {
            opacity: 1;
          }
          
          /* Fixed dropdown styling for scrolling issues */
          .custom-dropdown {
            position: relative;
            margin-bottom: 20px;
          }
          
          .custom-dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 1060; /* Higher z-index to avoid being hidden */
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-top: 5px;
            max-height: 350px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          
          .dropdown-search {
            background-color: #f9f9f9;
            border-bottom: 1px solid #eee;
            position: sticky;
            top: 0;
            z-index: 5;
            padding: 8px !important;
          }
          
          /* Fixed scrollable section */
          .custom-dropdown-options {
            overflow-y: auto !important;
            max-height: 200px !important;
            min-height: 100px;
            scrollbar-width: thin;
            -webkit-overflow-scrolling: touch; /* For smoother scrolling on iOS */
          }
          
          .custom-dropdown-options::-webkit-scrollbar {
            width: 8px;
          }
          
          .custom-dropdown-options::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          
          .custom-dropdown-options::-webkit-scrollbar-thumb {
            background: #bbb;
            border-radius: 4px;
          }
          
          .custom-dropdown-options::-webkit-scrollbar-thumb:hover {
            background: #999;
          }
          
          .custom-dropdown-item {
            cursor: pointer;
            transition: background-color 0.2s;
            padding: 0;
          }
          
          .custom-dropdown-item:hover {
            background-color: #f5f5f5;
          }
          
          .custom-dropdown-item label {
            cursor: pointer;
            width: 100%;
            margin: 0;
            padding: 8px 12px;
            display: flex;
            align-items: center;
          }
          
          .dropdown-actions {
            background-color: #f9f9f9;
            border-top: 1px solid #ddd;
            padding: 10px;
            position: sticky;
            bottom: 0;
            z-index: 5;
          }
          
          .custom-dropdown-item input[type="checkbox"] {
            min-width: 16px;
            height: 16px;
            margin-right: 8px;
          }
          
          .custom-dropdown-item input[type="checkbox"]:checked + span {
            color: #5BBB7B;
            font-weight: 500;
          }
          
          .selected-skills-count {
            display: inline-block;
          }
          
          .bg-primary-soft {
            background-color: rgba(91, 187, 123, 0.15);
          }
          
          .text-primary {
            color: #5BBB7B !important;
          }
        `}</style>
      </div>
    </div>
  );
}