"use client";
import React, { useState, useEffect } from "react";
import api from '@/lib/axios';
import toast from "react-hot-toast";

export default function FreelancerSearch() {
  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    query: "",
    location: "",
    skills: [],
    per_page: 10,
    page: 1
  });

  // State for search results
  const [freelancers, setFreelancers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total: 0
  });

  // State for skill input
  const [skillInput, setSkillInput] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding a skill
  const handleAddSkill = () => {
    if (skillInput.trim() && !searchParams.skills.includes(skillInput.trim())) {
      setSearchParams(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove) => {
    setSearchParams(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Handle search submission
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    searchFreelancers();
  };

  // Handle pagination
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.total_pages) return;
    
    setSearchParams(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Search freelancers API call
  const searchFreelancers = async () => {
    setIsLoading(true);
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      
      if (searchParams.query) queryParams.append('query', searchParams.query);
      if (searchParams.location) queryParams.append('location', searchParams.location);
      
      // Join skills as comma-separated value if skills exist
      if (searchParams.skills.length > 0) {
        queryParams.append('skills', searchParams.skills.join(','));
      }
      
      queryParams.append('per_page', searchParams.per_page);
      queryParams.append('page', searchParams.page);
      
      // Make API call
      const response = await api.get(`/users/search?${queryParams.toString()}`);
      
      if (response && response.data) {
        setFreelancers(response.data.data || []);
        
        // Set pagination info
        setPagination({
          current_page: response.data.current_page || 1,
          total_pages: response.data.last_page || 1,
          total: response.data.total || 0
        });
      }
    } catch (error) {
      console.error("Error searching freelancers:", error);
      toast.error("Failed to search freelancers");
      setFreelancers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    searchFreelancers();
  }, [searchParams.page, searchParams.per_page]);

  return (
    <div className="freelancer-search-container">
      {/* Search Form */}
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25">
          <h5 className="list-title">Find Freelancers</h5>
        </div>
        
        <form onSubmit={handleSearch} className="row g-3">
          {/* Search Query */}
          <div className="col-md-6">
            <label htmlFor="query" className="form-label">Search</label>
            <input
              type="text"
              id="query"
              name="query"
              className="form-control"
              placeholder="Search by name, title, or description"
              value={searchParams.query}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Location */}
          <div className="col-md-6">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-control"
              placeholder="Filter by location"
              value={searchParams.location}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Skills */}
          <div className="col-12">
            <label htmlFor="skills" className="form-label">Skills</label>
            <div className="d-flex">
              <input
                type="text"
                id="skills"
                className="form-control"
                placeholder="Enter a skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button 
                type="button" 
                className="btn btn-thm ms-2" 
                onClick={handleAddSkill}
              >
                Add
              </button>
            </div>
            
            {/* Display selected skills */}
            {searchParams.skills.length > 0 && (
              <div className="selected-skills mt-2 d-flex flex-wrap">
                {searchParams.skills.map((skill, index) => (
                  <span key={index} className="badge bg-light text-dark me-2 mb-2 p-2">
                    {skill}
                    <button 
                      type="button" 
                      className="btn-close ms-2" 
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label="Remove skill"
                    ></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Results per page */}
          <div className="col-md-6">
            <label htmlFor="per_page" className="form-label">Results per page</label>
            <select
              id="per_page"
              name="per_page"
              className="form-select"
              value={searchParams.per_page}
              onChange={handleInputChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          
          {/* Search Button */}
          <div className="col-md-6 d-flex align-items-end">
            <button 
              type="submit" 
              className="btn btn-thm w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Searching...
                </>
              ) : 'Search Freelancers'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Search Results */}
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25 d-flex justify-content-between align-items-center">
          <h5 className="list-title mb-0">Search Results</h5>
          <span className="text-muted">{pagination.total} freelancers found</span>
        </div>
        
        {isLoading && freelancers.length === 0 ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-thm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : freelancers.length === 0 ? (
          <div className="alert alert-info mb-0">
            <i className="fas fa-info-circle me-2"></i>
            No freelancers found matching your criteria. Try adjusting your search filters.
          </div>
        ) : (
          <>
            {/* Freelancer List */}
            <div className="freelancer-list">
              {Array.isArray(freelancers) && freelancers.map((freelancer) => (
                <div key={freelancer.id || Math.random().toString(36).substr(2, 9)} className="freelancer-card bdrb1 pb20 mb20">
                  <div className="d-flex">
                    {/* Avatar */}
                    <div className="me-3">
                      <img 
                        src={freelancer.avatar || "/images/default-avatar.png"} 
                        alt={freelancer.name || "Freelancer"} 
                        className="rounded-circle" 
                        style={{ width: "70px", height: "70px", objectFit: "cover" }}
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="mb-1">
                            <a href={`/freelancer/${freelancer.id || '#'}`} className="text-decoration-none">
                              {freelancer.name || "Unnamed Freelancer"}
                            </a>
                          </h5>
                          <p className="text-muted mb-2">{freelancer.title || "Freelancer"}</p>
                        </div>
                        
                        {/* Rating */}
                        {freelancer.rating && (
                          <div className="d-flex align-items-center">
                            <span className="fw-bold me-1">{parseFloat(freelancer.rating).toFixed(1)}</span>
                            <i className="fas fa-star text-warning"></i>
                          </div>
                        )}
                      </div>
                      
                      {/* Location */}
                      {freelancer.location && (
                        <p className="mb-2">
                          <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                          {freelancer.location}
                        </p>
                      )}
                      
                      {/* Skills */}
                      {freelancer.skills && Array.isArray(freelancer.skills) && freelancer.skills.length > 0 && (
                        <div className="skills d-flex flex-wrap">
                          {freelancer.skills.slice(0, 5).map((skill, i) => (
                            <span key={i} className="badge bg-light text-dark me-2 mb-2">
                              {skill}
                            </span>
                          ))}
                          {freelancer.skills.length > 5 && (
                            <span className="badge bg-light text-dark me-2 mb-2">
                              +{freelancer.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="pagination-container d-flex justify-content-center mt-4">
                <nav aria-label="Freelancer search results pages">
                  <ul className="pagination">
                    {/* Previous Page Button */}
                    <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => changePage(pagination.current_page - 1)}
                        aria-label="Previous page"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                    </li>
                    
                    {/* Page Numbers */}
                    {[...Array(pagination.total_pages).keys()]
                      .filter(pageNum => {
                        // Show first page, last page, current page, and pages around current
                        const page = pageNum + 1;
                        return (
                          page === 1 || 
                          page === pagination.total_pages ||
                          Math.abs(page - pagination.current_page) <= 2
                        );
                      })
                      .map((pageNum, index, array) => {
                        const page = pageNum + 1;
                        // Add ellipsis where there are gaps
                        const prevPage = index > 0 ? array[index - 1] + 1 : null;
                        const showEllipsis = prevPage && page - prevPage > 1;
                        
                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <li className="page-item disabled">
                                <span className="page-link">...</span>
                              </li>
                            )}
                            <li className={`page-item ${pagination.current_page === page ? 'active' : ''}`}>
                              <button 
                                className="page-link" 
                                onClick={() => changePage(page)}
                              >
                                {page}
                              </button>
                            </li>
                          </React.Fragment>
                        );
                      })}
                    
                    {/* Next Page Button */}
                    <li className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => changePage(pagination.current_page + 1)}
                        aria-label="Next page"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
      
      <style jsx>{`
        .btn-thm {
          background-color: var(--thm-color, #5BBB7B);
          color: white;
        }
        
        .btn-thm:hover {
          background-color: var(--thm-color-hover, #4A9A6A);
          color: white;
        }
        
        .text-thm {
          color: var(--thm-color, #5BBB7B) !important;
        }
        
        .freelancer-card:last-child {
          border-bottom: none !important;
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
        }
        
        .pagination .page-item.active .page-link {
          background-color: var(--thm-color, #5BBB7B);
          border-color: var(--thm-color, #5BBB7B);
        }
        
        .pagination .page-link {
          color: var(--thm-color, #5BBB7B);
        }
      `}</style>
    </div>
  );
}