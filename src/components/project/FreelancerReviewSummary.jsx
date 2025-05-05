"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from '@/lib/axios';
import { freelancerService } from "@/services/freelancer";

export default function FreelancerReviewSummary() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Fetch reviews for the freelancer
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual endpoint for fetching reviews
        const response = await freelancerService.summarizeReviews();
        if (response && response.data && response.data.reviews) {
          setReviews(response.data.reviews);
          
          // If we have reviews, get the summary
          if (response.data.reviews.length > 0) {
            generateReviewSummary(response.data.reviews);
          } else {
            setIsLoading(false);
          }
        } else {
          setReviews([]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
        setReviews([]);
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Generate review summary using the AI API
  const generateReviewSummary = async (reviewsData) => {
    setIsSummarizing(true);
    try {
      // Format the reviews for the API as specified in your curl example
      const reviewsForApi = reviewsData.map(review => ({
        comment: review.comment || review.text || review.content || "",
        rating: review.rating || 5
      }));

      // Call the summarize API with the specified endpoint and payload format
      const response = await api.post('/ai/summarize-reviews', {
        reviews: reviewsForApi
      });
      console.log("responseresponse",response);
      

      if (response && response.data && response.data.summary) {
        setSummary(response.data.summary);
      } else {
        setSummary("No summary available yet.");
      }
    } catch (error) {
      console.error("Error generating review summary:", error);
      setSummary("Unable to generate summary at this time.");
    } finally {
      setIsSummarizing(false);
      setIsLoading(false);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + (review.rating || 5), 0) / reviews.length).toFixed(1)
    : "N/A";

  // Get star distributions
  const getStarDistribution = () => {
    if (reviews.length === 0) return [0, 0, 0, 0, 0]; // 1-star, 2-star, 3-star, 4-star, 5-star
    
    const distribution = [0, 0, 0, 0, 0];
    
    reviews.forEach(review => {
      const rating = review.rating || 5;
      if (rating >= 1 && rating <= 5) {
        distribution[rating - 1]++;
      }
    });
    
    return distribution;
  };

  const starDistribution = getStarDistribution();

  if (reviews.length === 0 && !isLoading) {
    return (
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25">
          <h5 className="list-title">Feedback Summary</h5>
        </div>
        <div className="alert alert-info mb0">
          <i className="fas fa-info-circle me-2"></i>
          No reviews available yet. As clients provide feedback, a summary will appear here.
        </div>
      </div>
    );
  }

  return (
    <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
      <div className="bdrb1 pb15 mb25">
        <h5 className="list-title">Feedback Summary</h5>
      </div>
      
      {isLoading ? (
        <div className="d-flex justify-content-center py-4">
          <div className="spinner-border text-thm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="feedback-summary-content">
          <div className="row">
            {/* Rating and Summary */}
            <div className="col-md-12 mb-4">
              <div className="d-md-flex align-items-start">
                {/* Rating Display */}
                <div className="text-center me-md-4 mb-3 mb-md-0">
                  <div className="rating-value">
                    <span className="fs-1 fw-bold text-thm">{averageRating}</span>
                    <div className="d-flex justify-content-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                          key={star} 
                          className={`fas fa-star ${star <= Math.round(averageRating) ? 'text-warning' : 'text-muted opacity-25'}`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-muted">{reviews.length} reviews</span>
                  </div>
                </div>
                
                {/* AI Summary */}
                <div className="flex-grow-1 ps-md-3">
                  <div className="summary-box">
                    <h6 className="mb-2">Client Feedback Summary:</h6>
                    {isSummarizing ? (
                      <div className="text-center p-3">
                        <div className="spinner-border spinner-border-sm text-thm me-2" role="status"></div>
                        Generating summary...
                      </div>
                    ) : (
                      <blockquote className="ps-3 border-start border-3 border-thm">
                        <p className="mb-0">{summary}</p>
                      </blockquote>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Rating Statistics */}
            <div className="col-md-12">
              <div className="row">
                {/* 5-star reviews */}
                <div className="col-6 col-md-3 mb-3">
                  <div className="text-center p-3 border rounded h-100">
                    <div className="mb-2">5 <i className="fas fa-star text-warning"></i></div>
                    <h4 className="mb-0">{starDistribution[4]}</h4>
                    <div className="text-muted small">reviews</div>
                  </div>
                </div>
                
                {/* 4-star reviews */}
                <div className="col-6 col-md-3 mb-3">
                  <div className="text-center p-3 border rounded h-100">
                    <div className="mb-2">4 <i className="fas fa-star text-warning"></i></div>
                    <h4 className="mb-0">{starDistribution[3]}</h4>
                    <div className="text-muted small">reviews</div>
                  </div>
                </div>
                
                {/* Completion Rate */}
                <div className="col-6 col-md-3 mb-3">
                  <div className="text-center p-3 border rounded h-100">
                    <div className="mb-2"><i className="fas fa-check-circle text-success"></i></div>
                    <h4 className="mb-0">100%</h4>
                    <div className="text-muted small">completion</div>
                  </div>
                </div>
                
                {/* On-time Delivery */}
                <div className="col-6 col-md-3 mb-3">
                  <div className="text-center p-3 border rounded h-100">
                    <div className="mb-2"><i className="fas fa-clock text-primary"></i></div>
                    <h4 className="mb-0">100%</h4>
                    <div className="text-muted small">on-time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .rating-value {
          min-width: 100px;
        }
        
        .summary-box {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
        }
        
        blockquote {
          font-style: italic;
          color: #555;
        }
        
        .border-thm {
          border-color: var(--thm-color, #5BBB7B) !important;
        }
        
        .text-thm {
          color: var(--thm-color, #5BBB7B) !important;
        }
      `}</style>
    </div>
  );
}