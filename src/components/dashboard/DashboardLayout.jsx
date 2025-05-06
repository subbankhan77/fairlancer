// "use client";

// import { useState } from "react";
// import toggleStore from "@/store/toggleStore";
// import DashboardHeader from "./header/DashboardHeader";
// import DashboardSidebar from "./sidebar/DashboardSidebar";
// import DashboardFooter from "./footer/DashboardFooter";
// import { commonService } from "@/services/common";
// import { freelancerService } from "@/services/freelancer";

// export default function DashboardLayout({ children }) {
//   const isActive = toggleStore((state) => state.isDasboardSidebarActive);
//   const [showProjectForm, setShowProjectForm] = useState(false);
//   const [showQuestionForm, setShowQuestionForm] = useState(false);
//   const [projectIdea, setProjectIdea] = useState("");
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   // Function to handle initial project idea submission
//  // Function to handle initial project idea submission
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);
//   setError("");
  
//   try {
//     // Send the project idea to the API
//     const data = await freelancerService.startQuestionnaire({
//       idea: projectIdea
//     });
    
//     console.log("Project created:", data);
    
//     // Show the question modal with the first question
//     if (data.status && data.data && data.data.question) {
//       setCurrentQuestion(data.data.question);
//       setShowProjectForm(false);
//       setShowQuestionForm(true);
//     } else {
//       throw new Error("Invalid response format");
//     }
    
//   } catch (err) {
//     console.error("Failed to create project:", err);
//     setError("Failed to create project. Please try again.");
//   } finally {
//     setIsSubmitting(false);
//   }
// };

// // Function to handle question answer submission
// const handleNextQuestion = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);
//   setError("");
  
//   try {
//     // Send the answer to the next-question API
//     const data = await freelancerService.nextQuestion({
//       question: currentQuestion,
//       answer: answer
//     });
    
//     console.log("Next question:", data);
    
//     // If there's another question, update the current question
//     if (data.status && data.data && data.data.question) {
//       setCurrentQuestion(data.data.question);
//       setAnswer("");
//     } else if (data.status && data.message === "Questionnaire completed") {
//       // If questionnaire is completed
//       setSuccess(true);
      
//       // Close the form after a short delay
//       setTimeout(() => {
//         setShowQuestionForm(false);
//         setSuccess(false);
//       }, 2000);
//     } else {
//       throw new Error("Invalid response format");
//     }
    
//   } catch (err) {
//     console.error("Failed to get next question:", err);
//     setError("Failed to process your answer. Please try again.");
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   // Function to handle creating a new project
//   const handleCreateProject = () => {
//     setShowProjectForm(true);
//     setShowQuestionForm(false);
//     setError("");
//     setSuccess(false);
//     setProjectIdea("");
//     setCurrentQuestion("");
//     setAnswer("");
//   };

//   return (
//     <>
//       <DashboardHeader />
//       <div className="dashboard_content_wrapper">
//         <div
//           className={`dashboard dashboard_wrapper pr30 pr0-xl ${
//             isActive ? "dsh_board_sidebar_hidden" : ""
//           }`}
//         >
//           <DashboardSidebar onCreateProject={handleCreateProject} />
//           <div className="dashboard__main pl0-md">
//             {/* Initial Project Idea Form */}
//             {showProjectForm && (
//               <div className="project-form-overlay">
//                 <div className="project-form-container">
//                   <div className="project-form-header">
//                     <h3>Create New Project</h3>
//                     <button 
//                       onClick={() => setShowProjectForm(false)}
//                       className="close-btn"
//                     >
//                       ×
//                     </button>
//                   </div>
                  
//                   {success ? (
//                     <div className="success-message">
//                       Project created successfully!
//                     </div>
//                   ) : (
//                     <form onSubmit={handleSubmit}>
//                       {error && <div className="error-message">{error}</div>}
                      
//                       <div className="form-group">
//                         <label htmlFor="projectIdea">Tell us your project idea</label>
//                         <textarea
//                           id="projectIdea"
//                           className="form-control"
//                           rows="4"
//                           placeholder="I want to create an AI tool that helps summarize customer reviews..."
//                           value={projectIdea}
//                           onChange={(e) => setProjectIdea(e.target.value)}
//                           required
//                           disabled={isSubmitting}
//                         />
//                       </div>
                      
//                       <div className="form-actions">
//                         <button 
//                           type="button" 
//                           className="btn btn-cancel"
//                           onClick={() => setShowProjectForm(false)}
//                           disabled={isSubmitting}
//                         >
//                           Cancel
//                         </button>
//                         <button 
//                           type="submit" 
//                           className="btn btn-submit"
//                           disabled={isSubmitting}
//                         >
//                           {isSubmitting ? "Starting..." : "Start Questionnaire"}
//                         </button>
//                       </div>
//                     </form>
//                   )}
//                 </div>
//               </div>
//             )}
            
//             {/* Question Answer Form */}
//             {showQuestionForm && (
//               <div className="project-form-overlay">
//                 <div className="project-form-container">
//                   <div className="project-form-header">
//                     <h3>Project Questionnaire</h3>
//                     <button 
//                       onClick={() => setShowQuestionForm(false)}
//                       className="close-btn"
//                     >
//                       ×
//                     </button>
//                   </div>
                  
//                   {success ? (
//                     <div className="success-message">
//                       Questionnaire completed successfully!
//                     </div>
//                   ) : (
//                     <form onSubmit={handleNextQuestion}>
//                       {error && <div className="error-message">{error}</div>}
                      
//                       <div className="form-group">
//                         <label htmlFor="currentQuestion" className="question-label">{currentQuestion}</label>
//                         <textarea
//                           id="answer"
//                           className="form-control"
//                           rows="4"
//                           placeholder="Your answer..."
//                           value={answer}
//                           onChange={(e) => setAnswer(e.target.value)}
//                           required
//                           disabled={isSubmitting}
//                         />
//                       </div>
                      
//                       <div className="form-actions">
//                         <button 
//                           type="button" 
//                           className="btn btn-cancel"
//                           onClick={() => setShowQuestionForm(false)}
//                           disabled={isSubmitting}
//                         >
//                           Cancel
//                         </button>
//                         <button 
//                           type="submit" 
//                           className="btn btn-submit"
//                           disabled={isSubmitting}
//                         >
//                           {isSubmitting ? "Processing..." : "Next"}
//                         </button>
//                       </div>
//                     </form>
//                   )}
//                 </div>
//               </div>
//             )}
            
//             {children}
//             <DashboardFooter />
//           </div>
//         </div>
//       </div>
      
//       {/* CSS for the forms */}
//       <style jsx>{`
//         .project-form-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: rgba(0, 0, 0, 0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//         }
        
//         .project-form-container {
//           background-color: white;
//           border-radius: 8px;
//           width: 90%;
//           max-width: 500px;
//           padding: 20px;
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//         }
        
//         .project-form-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 20px;
//         }
        
//         .close-btn {
//           background: none;
//           border: none;
//           font-size: 24px;
//           cursor: pointer;
//         }
        
//         .form-group {
//           margin-bottom: 20px;
//         }
        
//         label {
//           display: block;
//           margin-bottom: 8px;
//           font-weight: 500;
//         }
        
//         .question-label {
//           font-weight: 600;
//           font-size: 16px;
//           margin-bottom: 12px;
//         }
        
//         .form-control {
//           width: 100%;
//           padding: 12px;
//           border: 1px solid #ddd;
//           border-radius: 4px;
//           font-family: inherit;
//           font-size: 14px;
//         }
        
//         .form-actions {
//           display: flex;
//           justify-content: flex-end;
//           gap: 10px;
//         }
        
//         .btn {
//           padding: 10px 16px;
//           border-radius: 4px;
//           cursor: pointer;
//           border: none;
//           font-weight: 500;
//         }
        
//         .btn-cancel {
//           background-color: #f2f2f2;
//         }
        
//         .btn-submit {
//           background-color: #007bff;
//           color: white;
//         }
        
//         .btn:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }
        
//         .error-message {
//           color: #dc3545;
//           margin-bottom: 15px;
//           padding: 8px;
//           background-color: #f8d7da;
//           border-radius: 4px;
//         }
        
//         .success-message {
//           color: #28a745;
//           padding: 20px;
//           text-align: center;
//           font-weight: 500;
//         }
//       `}</style>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import toggleStore from "@/store/toggleStore";
import DashboardHeader from "./header/DashboardHeader";
import DashboardSidebar from "./sidebar/DashboardSidebar";
import DashboardFooter from "./footer/DashboardFooter";
import { commonService } from "@/services/common";
import { freelancerService } from "@/services/freelancer";

export default function DashboardLayout({ children }) {
  const isActive = toggleStore((state) => state.isDasboardSidebarActive);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showFinalDetails, setShowFinalDetails] = useState(false);
  const [projectIdea, setProjectIdea] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [questionCounter, setQuestionCounter] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [finalProjectDetails, setFinalProjectDetails] = useState(null);

  // Function to handle initial project idea submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Send the project idea to the API
      const data = await freelancerService.startQuestionnaire({
        idea: projectIdea
      });
      
      console.log("Project created:", data);
      
      // Show the question modal with the first question
      if (data.status && data.data && data.data.question) {
        setCurrentQuestion(data.data.question);
        setShowProjectForm(false);
        setShowQuestionForm(true);
        setQuestionCounter(1); // Start counting questions
      } else {
        throw new Error("Invalid response format");
      }
      
    } catch (err) {
      console.error("Failed to create project:", err);
      setError("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle question answer submission
  const handleNextQuestion = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Add current Q&A to the array
      const currentQA = { question: currentQuestion, answer: answer };
      const updatedQA = [...questionAnswers, currentQA];
      setQuestionAnswers(updatedQA);
      
      // Increment question counter
      const newCounter = questionCounter + 1;
      setQuestionCounter(newCounter);
      
      // Check if we've reached 5 questions
      if (newCounter >= 5) {
        // If 5 or more questions answered, we can finalize
        // But first, get one more question if available
        const data = await freelancerService.nextQuestion({
          question: currentQuestion,
          answer: answer
        });
        
        if (data.status && data.data && data.data.question) {
          // Still have more questions, show next question
          setCurrentQuestion(data.data.question);
          setAnswer("");
        } else {
          // No more questions or error, finalize project
          await finalizeProject(updatedQA);
        }
      } else {
        // Less than 5 questions, get next question
        const data = await freelancerService.nextQuestion({
          question: currentQuestion,
          answer: answer
        });
        
        if (data.status && data.data && data.data.question) {
          setCurrentQuestion(data.data.question);
          setAnswer("");
        } else {
          // No more questions but less than 5, keep asking
          // This shouldn't happen normally but handling it just in case
          const dummyQuestions = [
            "What features do you want to prioritize?",
            "What platforms should the solution work on?",
            "What is your timeline for this project?",
            "What is your budget expectation?",
            "Any specific technologies you want to use?"
          ];
          
          // Find an unused question
          const index = newCounter - 1;
          if (index < dummyQuestions.length) {
            setCurrentQuestion(dummyQuestions[index]);
            setAnswer("");
          } else {
            // We've run out of questions, finalize
            await finalizeProject(updatedQA);
          }
        }
      }
      
    } catch (err) {
      console.error("Failed to get next question:", err);
      setError("Failed to process your answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to finalize the project
  const finalizeProject = async (qa) => {
    try {
      setIsSubmitting(true);
      
      // Call the finalize-project API
      const response = await freelancerService.finalizeProject({
        idea: projectIdea,
        qa: qa
      });
      
      console.log("Project finalized:", response);
      
      if (response.status && response.data) {
        // Store final project details
        setFinalProjectDetails(response.data);
        
        // Show the final details modal
        setShowQuestionForm(false);
        setShowFinalDetails(true);
        setSuccess(true);
      } else {
        throw new Error("Failed to finalize project");
      }
    } catch (err) {
      console.error("Failed to finalize project:", err);
      setError("Failed to finalize project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle creating a new project
  const handleCreateProject = () => {
    setShowProjectForm(true);
    setShowQuestionForm(false);
    setShowFinalDetails(false);
    setError("");
    setSuccess(false);
    setProjectIdea("");
    setCurrentQuestion("");
    setAnswer("");
    setQuestionCounter(0);
    setQuestionAnswers([]);
    setFinalProjectDetails(null);
  };
  
  // Function to close the final details modal
  const handleCloseFinalDetails = () => {
    setShowFinalDetails(false);
    // You could navigate to a project details page here if needed
  };

  return (
    <>
      <DashboardHeader />
      <div className="dashboard_content_wrapper">
        <div
          className={`dashboard dashboard_wrapper pr30 pr0-xl ${
            isActive ? "dsh_board_sidebar_hidden" : ""
          }`}
        >
          <DashboardSidebar onCreateProject={handleCreateProject} />
          <div className="dashboard__main pl0-md">
            {/* Initial Project Idea Form */}
            {showProjectForm && (
              <div className="project-form-overlay">
                <div className="project-form-container">
                  <div className="project-form-header">
                    <h3>Create New Project</h3>
                    <button 
                      onClick={() => setShowProjectForm(false)}
                      className="close-btn"
                    >
                      ×
                    </button>
                  </div>
                  
                  {success ? (
                    <div className="success-message">
                      Project created successfully!
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {error && <div className="error-message">{error}</div>}
                      
                      <div className="form-group">
                        <label htmlFor="projectIdea">Tell us your project idea</label>
                        <textarea
                          id="projectIdea"
                          className="form-control"
                          rows="4"
                          placeholder="I want to create an AI tool that helps summarize customer reviews..."
                          value={projectIdea}
                          onChange={(e) => setProjectIdea(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          type="button" 
                          className="btn btn-cancel"
                          onClick={() => setShowProjectForm(false)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Starting..." : "Start Questionnaire"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
            
            {/* Question Answer Form */}
            {showQuestionForm && (
              <div className="project-form-overlay">
                <div className="project-form-container">
                  <div className="project-form-header">
                    <h3>Project Questionnaire</h3>
                    <button 
                      onClick={() => setShowQuestionForm(false)}
                      className="close-btn"
                    >
                      ×
                    </button>
                  </div>
                  
                  <form onSubmit={handleNextQuestion}>
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="question-counter">
                      Question {questionCounter} of 5
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="currentQuestion" className="question-label">{currentQuestion}</label>
                      <textarea
                        id="answer"
                        className="form-control"
                        rows="4"
                        placeholder="Your answer..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn btn-cancel"
                        onClick={() => setShowQuestionForm(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : questionCounter >= 5 ? "Finalize Project" : "Next"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Final Project Details */}
            {showFinalDetails && finalProjectDetails && (
              <div className="project-form-overlay">
                <div className="project-form-container final-details-container">
                  <div className="project-form-header">
                    <h3>{finalProjectDetails.title_category?.title || "Project Details"}</h3>
                    <button 
                      onClick={handleCloseFinalDetails}
                      className="close-btn"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="final-project-details">
                    <div className="success-message mb-20">
                      Your project has been created successfully!
                    </div>
                    
                    {/* List of Questions and Answers */}
                    <div className="details-section">
                      <h4>Project Questionnaire Responses</h4>
                      <div className="qa-list">
                        {questionAnswers.map((qa, index) => (
                          <div key={index} className="qa-item">
                            <div className="qa-question">
                              <strong>Q{index + 1}:</strong> {qa.question}
                            </div>
                            <div className="qa-answer">
                              <strong>A:</strong> {qa.answer}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="details-section">
                      <h4>Project Description</h4>
                      <div className="markdown-content">
                        {finalProjectDetails.description}
                      </div>
                    </div>
                    
                    <div className="details-section">
                      <h4>Category</h4>
                      <p>{finalProjectDetails.title_category?.category || "N/A"}</p>
                    </div>
                    
                    <div className="details-section">
                      <h4>Required Skills</h4>
                      <div className="skills-list">
                        {finalProjectDetails.skills && finalProjectDetails.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="details-section">
                      <h4>Budget Guidance</h4>
                      <p><strong>Complexity:</strong> {finalProjectDetails.budget_guidance?.complexity || "N/A"}</p>
                      <p><strong>Budget Range:</strong> {finalProjectDetails.budget_guidance?.budget_range_usd || "N/A"}</p>
                      <p>{finalProjectDetails.budget_guidance?.guidance || ""}</p>
                    </div>
                    
                    <div className="details-section">
                      <h4>Timeline</h4>
                      <p><strong>Duration:</strong> {finalProjectDetails.duration_value || "N/A"} {finalProjectDetails.duration_unit || ""}</p>
                      <p><strong>Estimated Start:</strong> {finalProjectDetails.estimated_start || "N/A"}</p>
                      <p><strong>Estimated Deadline:</strong> {finalProjectDetails.estimated_deadline || "N/A"}</p>
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn btn-submit"
                        onClick={handleCloseFinalDetails}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {children}
            <DashboardFooter />
          </div>
        </div>
      </div>
      
      {/* CSS for the forms */}
      <style jsx>{`
        .project-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .project-form-container {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .final-details-container {
          max-width: 700px;
        }
        
        .project-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .question-label {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 12px;
        }
        
        .question-counter {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
          text-align: right;
        }
        
        .form-control {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 14px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        .btn {
          padding: 10px 16px;
          border-radius: 4px;
          cursor: pointer;
          border: none;
          font-weight: 500;
        }
        
        .btn-cancel {
          background-color: #f2f2f2;
        }
        
        .btn-submit {
          background-color: #007bff;
          color: white;
        }
        
        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #dc3545;
          margin-bottom: 15px;
          padding: 8px;
          background-color: #f8d7da;
          border-radius: 4px;
        }
        
        .success-message {
          color: #28a745;
          padding: 12px;
          text-align: center;
          font-weight: 500;
          background-color: #d4edda;
          border-radius: 4px;
        }
        
        .mb-20 {
          margin-bottom: 20px;
        }
        
        .final-project-details {
          padding: 0 10px;
        }
        
        .details-section {
          margin-bottom: 20px;
        }
        
        .details-section h4 {
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #eee;
        }
        
        .markdown-content {
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .skill-tag {
          background-color: #e9f5ff;
          color: #007bff;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 13px;
        }
        
        .qa-list {
          margin-bottom: 20px;
        }
        
        .qa-item {
          padding: 12px;
          margin-bottom: 12px;
          background-color: #f9f9f9;
          border-radius: 6px;
          border-left: 3px solid #007bff;
        }
        
        .qa-question {
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .qa-answer {
          color: #333;
          padding-left: 10px;
          border-left: 2px solid #ddd;
        }
      `}</style>
    </>
  );
}