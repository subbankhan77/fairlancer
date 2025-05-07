// "use client";

// import { useState } from "react";
// import toggleStore from "@/store/toggleStore";
// import DashboardHeader from "./header/DashboardHeader";
// import DashboardSidebar from "./sidebar/DashboardSidebar";
// import DashboardFooter from "./footer/DashboardFooter";
// import { freelancerService } from "@/services/freelancer";

// // Confirmation Popup Component
// const ConfirmationPopup = ({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel }) => {
//   if (!isOpen) return null;
  
//   return (
//     <div className="confirmation-overlay">
//       <div className="confirmation-container">
//         <div className="confirmation-header">
//           <h3>{title}</h3>
//         </div>
//         <div className="confirmation-body">
//           <p>{message}</p>
//         </div>
//         <div className="confirmation-actions">
//           <button 
//             type="button"
//             className="btn btn-cancel" 
//             onClick={onCancel}
//           >
//             {cancelText || "Cancel"}
//           </button>
//           <button 
//             type="button"
//             className="btn btn-confirm" 
//             onClick={onConfirm}
//           >
//             {confirmText || "Confirm"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function DashboardLayout({ children }) {
//   const isActive = toggleStore((state) => state.isDasboardSidebarActive);
//   const [showProjectForm, setShowProjectForm] = useState(false);
//   const [showQuestionForm, setShowQuestionForm] = useState(false);
//   const [showFinalDetails, setShowFinalDetails] = useState(false);
//   const [projectIdea, setProjectIdea] = useState("");
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [questionCounter, setQuestionCounter] = useState(0);
//   const [questionAnswers, setQuestionAnswers] = useState([]);
//   const [finalProjectDetails, setFinalProjectDetails] = useState(null);
//   const [maxQuestions] = useState(6); // Maximum number of questions allowed
//   const [minQuestions] = useState(5); // Minimum number of questions required
  
//   // New states for confirmation popups
//   const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
//   const [showNewProjectConfirmation, setShowNewProjectConfirmation] = useState(false);

//   // Function to handle initial project idea submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError("");
    
//     try {
//       // Send the project idea to the API
//       const data = await freelancerService.startQuestionnaire({
//         idea: projectIdea
//       });
      
//       console.log("Project created:", data);
      
//       // Show the question modal with the first question
//       if (data.status && data.data && data.data.question) {
//         setCurrentQuestion(data.data.question);
//         setShowProjectForm(false);
//         setShowQuestionForm(true);
//         setQuestionCounter(1); // Start counting questions
//         setQuestionAnswers([]); // Reset question answers
//       } else {
//         throw new Error("Invalid response format");
//       }
      
//     } catch (err) {
//       console.error("Failed to create project:", err);
//       setError("Failed to create project. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Function to handle question answer submission
//   const handleNextQuestion = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError("");
    
//     try {
//       // Add current Q&A to the array
//       const currentQA = { question: currentQuestion, answer: answer };
//       const updatedQA = [...questionAnswers, currentQA];
//       setQuestionAnswers(updatedQA);
      
//       // Increment question counter
//       const newCounter = questionCounter + 1;
//       setQuestionCounter(newCounter);
      
//       // Check if we've reached max questions or minimum questions
//       if (newCounter >= maxQuestions) {
//         // If we've reached max questions, finalize the project
//         await finalizeProject(updatedQA);
//       } else if (newCounter >= minQuestions) {
//         // If we've reached minimum questions, check if user clicked "Finalize Project"
//         if (e.nativeEvent.submitter?.innerText === "Finalize Project") {
//           // User clicked Finalize, so finalize the project regardless of how many questions
//           await finalizeProject(updatedQA);
//         } else {
//           // Otherwise try to get one more question (but only up to the max)
//           try {
//             const data = await freelancerService.nextQuestion({
//               question: currentQuestion,
//               answer: answer
//             });
            
//             if (data.status && data.data && data.data.question && newCounter < maxQuestions) {
//               // Still have more questions within limits, show next question
//               setCurrentQuestion(data.data.question);
//               setAnswer("");
//             } else {
//               // No more questions available or max reached, finalize project
//               await finalizeProject(updatedQA);
//             }
//           } catch (err) {
//             // Error getting next question, finalize with what we have
//             console.error("Error getting next question, finalizing project:", err);
//             await finalizeProject(updatedQA);
//           }
//         }
//       } else {
//         // Less than minimum questions, get next question
//         try {
//           const data = await freelancerService.nextQuestion({
//             question: currentQuestion,
//             answer: answer
//           });
          
//           if (data.status && data.data && data.data.question) {
//             // Got next question successfully
//             setCurrentQuestion(data.data.question);
//             setAnswer("");
//           } else {
//             // No more questions but less than minimum, use backup questions
//             const backupQuestions = [
//               "What features do you want to prioritize?",
//               "What platforms should the solution work on?",
//               "What is your timeline for this project?",
//               "What is your budget expectation?",
//               "Any specific technologies you want to use?",
//               "What are your quality expectations for this project?"
//             ];
            
//             // Use a backup question we haven't used yet
//             // Find questions that haven't been asked yet
//             const askedQuestions = updatedQA.map(item => item.question);
//             const unusedBackupQuestions = backupQuestions.filter(
//               question => !askedQuestions.includes(question)
//             );
            
//             if (unusedBackupQuestions.length > 0) {
//               // Use the first unused backup question
//               setCurrentQuestion(unusedBackupQuestions[0]);
//               setAnswer("");
//             } else {
//               // Fallback if we somehow run out of backup questions
//               setCurrentQuestion("Any additional requirements for this project?");
//               setAnswer("");
//             }
//           }
//         } catch (err) {
//           console.error("Failed to get next question:", err);
//           setError("Failed to process your answer. Please try again.");
//         }
//       }
      
//     } catch (err) {
//       console.error("Failed to process question:", err);
//       setError("Failed to process your answer. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   // Function to finalize the project
//   const finalizeProject = async (qa) => {
//     try {
//       setIsSubmitting(true);
      
//       // Format the data for the API exactly as specified
//       const apiPayload = {
//         idea: projectIdea,
//         qa: qa.map(item => ({
//           question: item.question,
//           answer: item.answer
//         }))
//       };
      
//       console.log("Sending finalize payload:", apiPayload);
      
//       // Call the finalize-project API
//       const response = await freelancerService.finalizeProject(apiPayload);
      
//       console.log("Project finalized:", response);
      
//       if (response.status && response.data) {
//         // Store final project details
//         setFinalProjectDetails(response.data);
        
//         // Show the final details modal
//         setShowQuestionForm(false);
//         setShowFinalDetails(true);
//         setSuccess(true);
//       } else {
//         throw new Error("Failed to finalize project");
//       }
//     } catch (err) {
//       console.error("Failed to finalize project:", err);
//       setError("Failed to finalize project. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Function to handle creating a new project
//   const handleCreateProject = () => {
//     // Reset all state variables
//     setShowProjectForm(true);
//     setShowQuestionForm(false);
//     setShowFinalDetails(false);
//     setError("");
//     setSuccess(false);
//     setProjectIdea("");
//     setCurrentQuestion("");
//     setAnswer("");
//     setQuestionCounter(0);
//     setQuestionAnswers([]);
//     setFinalProjectDetails(null);
//     setIsSubmitting(false);
//   };
  
//   // Function to close the final details modal
//   const handleCloseFinalDetails = () => {
//     setShowFinalDetails(false);
//     // You could navigate to a project details page here if needed
//   };
  
//   // Functions for confirmation popups
//   const handleCancelClick = () => {
//     setShowCancelConfirmation(true);
//   };
  
//   const handleCreateNewClick = () => {
//     setShowNewProjectConfirmation(true);
//   };
  
//   const confirmCancel = () => {
//     setShowCancelConfirmation(false);
//     handleCloseFinalDetails();
//   };
  
//   const confirmCreateNew = () => {
//     setShowNewProjectConfirmation(false);
//     handleCreateProject();
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
//                           disabled={isSubmitting || !projectIdea.trim()}
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
                  
//                   <form onSubmit={handleNextQuestion}>
//                     {error && <div className="error-message">{error}</div>}
                    
//                     <div className="question-counter">
//                       Question {questionCounter} of {minQuestions}{questionCounter >= minQuestions ? "+" : ""}
//                     </div>
                    
//                     <div className="form-group">
//                       <label htmlFor="currentQuestion" className="question-label">{currentQuestion}</label>
//                       <textarea
//                         id="answer"
//                         className="form-control"
//                         rows="4"
//                         placeholder="Your answer..."
//                         value={answer}
//                         onChange={(e) => setAnswer(e.target.value)}
//                         required
//                         disabled={isSubmitting}
//                       />
//                     </div>
                    
//                     <div className="form-actions">
//                       <button 
//                         type="button" 
//                         className="btn btn-cancel"
//                         onClick={() => setShowQuestionForm(false)}
//                         disabled={isSubmitting}
//                       >
//                         Cancel
//                       </button>
//                       <button 
//                         type="submit" 
//                         className="btn btn-submit"
//                         disabled={isSubmitting || !answer.trim()}
//                       >
//                         {isSubmitting ? "Processing..." : 
//                           questionCounter >= minQuestions ? "Finalize Project" : "Next"}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             )}
            
//             {/* Final Project Details */}
//             {showFinalDetails && finalProjectDetails && (
//               <div className="project-form-overlay">
//                 <div className="project-form-container final-details-container">
//                   <div className="project-form-header">
//                     <h3>{finalProjectDetails.title_category?.title || "Project Details"}</h3>
//                     <button 
//                       onClick={handleCancelClick}
//                       className="close-btn"
//                     >
//                       ×
//                     </button>
//                   </div>
                  
//                   <div className="final-project-details">
//                     <div className="success-message mb-20">
//                       Your project has been created successfully!
//                     </div>
                    
                    
//                     {/* List of Questions and Answers */}
//                     <div className="details-section">
//                       <h4>Project Questionnaire Responses</h4>
//                       <div className="qa-list">
//                         {questionAnswers.map((qa, index) => (
//                           <div key={index} className="qa-item">
//                             <div className="qa-question">
//                               <strong>Q{index + 1}:</strong> {qa.question}
//                             </div>
//                             <div className="qa-answer">
//                               <strong>A:</strong> {qa.answer}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
                    
//                     <div className="details-section">
//                       <h4>Project Description</h4>
//                       <div className="markdown-content">
//                         {finalProjectDetails.description}
//                       </div>
//                     </div>
                    
//                     <div className="details-section">
//                       <h4>Category</h4>
//                       <p>{finalProjectDetails.title_category?.category || "N/A"}</p>
//                     </div>
                    
//                     <div className="details-section">
//                       <h4>Required Skills</h4>
//                       <div className="skills-list">
//                         {finalProjectDetails.skills && finalProjectDetails.skills.map((skill, index) => (
//                           <span key={index} className="skill-tag">{skill}</span>
//                         ))}
//                       </div>
//                     </div>
                    
//                     <div className="details-section">
//                       <h4>Budget Guidance</h4>
//                       <p><strong>Complexity:</strong> {finalProjectDetails.budget_guidance?.complexity || "N/A"}</p>
//                       <p><strong>Budget Range:</strong> {finalProjectDetails.budget_guidance?.budget_range_usd || "N/A"}</p>
//                       <p>{finalProjectDetails.budget_guidance?.guidance || ""}</p>
//                     </div>
                    
//                     <div className="details-section">
//                       <h4>Timeline</h4>
//                       <p><strong>Duration:</strong> {finalProjectDetails.duration_value || "N/A"} {finalProjectDetails.duration_unit || ""}</p>
//                       <p><strong>Estimated Start:</strong> {finalProjectDetails.estimated_start || "N/A"}</p>
//                       <p><strong>Estimated Deadline:</strong> {finalProjectDetails.estimated_deadline || "N/A"}</p>
//                     </div>
                    
//                     <div className="form-actions">
//                       <button 
//                         type="button" 
//                         className="btn btn-cancel"
//                         onClick={handleCancelClick}
//                       >
//                         Cancel
//                       </button>
//                       <button 
//                         type="button" 
//                         className="btn btn-create-new"
//                         onClick={handleCreateNewClick}
//                       >
//                         Create New Project
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {/* Confirmation Popups */}
//             {showCancelConfirmation && (
//               <div className="confirmation-overlay">
//                 <div className="confirmation-container">
//                   <div className="confirmation-header">
//                     <h3>Close Project Details</h3>
//                   </div>
//                   <div className="confirmation-body">
//                     <p>Are you sure you want to close the project details? You can always view this project later in your dashboard.</p>
//                   </div>
//                   <div className="confirmation-actions">
//                     <button 
//                       type="button"
//                       className="btn btn-cancel" 
//                       onClick={() => setShowCancelConfirmation(false)}
//                     >
//                       No, Stay Here
//                     </button>
//                     <button 
//                       type="button"
//                       className="btn btn-confirm" 
//                       onClick={confirmCancel}
//                     >
//                       Yes, Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {showNewProjectConfirmation && (
//               <div className="confirmation-overlay">
//                 <div className="confirmation-container">
//                   <div className="confirmation-header">
//                     <h3>Create New Project</h3>
//                   </div>
//                   <div className="confirmation-body">
//                     <p>Do you want to start creating a new project? Your current project will still be saved.</p>
//                   </div>
//                   <div className="confirmation-actions">
//                     <button 
//                       type="button"
//                       className="btn btn-cancel" 
//                       onClick={() => setShowNewProjectConfirmation(false)}
//                     >
//                       No, Cancel
//                     </button>
//                     <button 
//                       type="button"
//                       className="btn btn-confirm" 
//                       onClick={confirmCreateNew}
//                     >
//                       Yes, Create New
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {children}
//             <DashboardFooter />
//           </div>
//         </div>
//       </div>
      
//       {/* CSS for the forms and confirmation popups */}
//       <style jsx>{`
//         .project-form-overlay,
//         .confirmation-overlay {
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
        
//         .confirmation-overlay {
//           z-index: 1100; /* Higher z-index to appear above other modals */
//         }
        
//         .project-form-container,
//         .confirmation-container {
//           background-color: white;
//           border-radius: 8px;
//           width: 90%;
//           max-width: 500px;
//           padding: 20px;
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//           max-height: 90vh;
//           overflow-y: auto;
//         }
        
//         .confirmation-container {
//           max-width: 400px;
//         }
        
//         .final-details-container {
//           max-width: 700px;
//         }
        
//         .project-form-header,
//         .confirmation-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 20px;
//         }
        
//         .confirmation-header {
//           border-bottom: 1px solid #eee;
//           padding-bottom: 10px;
//           margin-bottom: 15px;
//         }
        
//         .confirmation-body {
//           padding: 10px 0;
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
        
//         .question-counter {
//           font-size: 14px;
//           color: #666;
//           margin-bottom: 10px;
//           text-align: right;
//         }
        
//         .form-control {
//           width: 100%;
//           padding: 12px;
//           border: 1px solid #ddd;
//           border-radius: 4px;
//           font-family: inherit;
//           font-size: 14px;
//         }
        
//         .form-actions,
//         .confirmation-actions {
//           display: flex;
//           justify-content: flex-end;
//           gap: 10px;
//           margin-top: 20px;
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
        
//         .btn-submit,
//         .btn-confirm {
//           background-color: #007bff;
//           color: white;
//         }
        
//         .btn-create-new {
//           background-color: #28a745;
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
//           padding: 12px;
//           text-align: center;
//           font-weight: 500;
//           background-color: #d4edda;
//           border-radius: 4px;
//         }
        
//         .mb-20 {
//           margin-bottom: 20px;
//         }
        
//         .final-project-details {
//           padding: 0 10px;
//         }
        
//         .details-section {
//           margin-bottom: 20px;
//         }
        
//         .details-section h4 {
//           margin-bottom: 10px;
//           padding-bottom: 5px;
//           border-bottom: 1px solid #eee;
//         }
        
//         .markdown-content {
//           white-space: pre-wrap;
//           font-size: 14px;
//           line-height: 1.5;
//         }
        
//         .skills-list {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 8px;
//         }
        
//         .skill-tag {
//           background-color: #e9f5ff;
//           color: #007bff;
//           padding: 4px 10px;
//           border-radius: 4px;
//           font-size: 13px;
//         }
        
//         .qa-list {
//           margin-bottom: 20px;
//         }
        
//         .qa-item {
//           padding: 12px;
//           margin-bottom: 12px;
//           background-color: #f9f9f9;
//           border-radius: 6px;
//           border-left: 3px solid #007bff;
//         }
        
//         .qa-question {
//           margin-bottom: 8px;
//           font-weight: 500;
//         }
        
//         .qa-answer {
//           color: #333;
//           padding-left: 10px;
//           border-left: 2px solid #ddd;
//         }
        
//         .json-content {
//           background-color: #f5f5f5;
//           padding: 10px;
//           border-radius: 4px;
//           font-family: monospace;
//           font-size: 12px;
//           white-space: pre-wrap;
//           max-height: 200px;
//           overflow-y: auto;
//           border: 1px solid #ddd;
//         }
        
//         /* Add a loading indicator style for the finalize step */
//         .loading-indicator {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//         }
        
//         .loading-spinner {
//           border: 4px solid rgba(0, 0, 0, 0.1);
//           border-radius: 50%;
//           border-top: 4px solid #007bff;
//           width: 40px;
//           height: 40px;
//           animation: spin 1s linear infinite;
//           margin-bottom: 10px;
//         }
        
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
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
import { freelancerService } from "@/services/freelancer";

// Confirmation Popup Component
const ConfirmationPopup = ({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <h3>{title}</h3>
        </div>
        <div className="confirmation-body">
          <p>{message}</p>
        </div>
        <div className="confirmation-actions">
          <button 
            type="button"
            className="btn btn-cancel" 
            onClick={onCancel}
          >
            {cancelText || "Cancel"}
          </button>
          <button 
            type="button"
            className="btn btn-confirm" 
            onClick={onConfirm}
          >
            {confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [maxQuestions] = useState(6); // Maximum number of questions allowed
  const [minQuestions] = useState(5); // Minimum number of questions required
  
  // New states for confirmation popups
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showNewProjectConfirmation, setShowNewProjectConfirmation] = useState(false);

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
        setQuestionAnswers([]); // Reset question answers
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
      
      // Check if we've reached max questions or minimum questions
      if (newCounter >= maxQuestions) {
        // If we've reached max questions, finalize the project
        await finalizeProject(updatedQA);
      } else if (newCounter >= minQuestions) {
        // If we've reached minimum questions, check if user clicked "Finalize Project"
        if (e.nativeEvent.submitter?.innerText === "Finalize Project") {
          // User clicked Finalize, so finalize the project regardless of how many questions
          await finalizeProject(updatedQA);
        } else {
          // Otherwise try to get one more question (but only up to the max)
          try {
            const data = await freelancerService.nextQuestion({
              question: currentQuestion,
              answer: answer
            });
            
            if (data.status && data.data && data.data.question && newCounter < maxQuestions) {
              // Still have more questions within limits, show next question
              setCurrentQuestion(data.data.question);
              setAnswer("");
            } else {
              // No more questions available or max reached, finalize project
              await finalizeProject(updatedQA);
            }
          } catch (err) {
            // Error getting next question, finalize with what we have
            console.error("Error getting next question, finalizing project:", err);
            await finalizeProject(updatedQA);
          }
        }
      } else {
        // Less than minimum questions, get next question
        try {
          const data = await freelancerService.nextQuestion({
            question: currentQuestion,
            answer: answer
          });
          
          if (data.status && data.data && data.data.question) {
            // Got next question successfully
            setCurrentQuestion(data.data.question);
            setAnswer("");
          } else {
            // No more questions but less than minimum, use backup questions
            const backupQuestions = [
              "What features do you want to prioritize?",
              "What platforms should the solution work on?",
              "What is your timeline for this project?",
              "What is your budget expectation?",
              "Any specific technologies you want to use?",
              "What are your quality expectations for this project?"
            ];
            
            // Use a backup question we haven't used yet
            // Find questions that haven't been asked yet
            const askedQuestions = updatedQA.map(item => item.question);
            const unusedBackupQuestions = backupQuestions.filter(
              question => !askedQuestions.includes(question)
            );
            
            if (unusedBackupQuestions.length > 0) {
              // Use the first unused backup question
              setCurrentQuestion(unusedBackupQuestions[0]);
              setAnswer("");
            } else {
              // Fallback if we somehow run out of backup questions
              setCurrentQuestion("Any additional requirements for this project?");
              setAnswer("");
            }
          }
        } catch (err) {
          console.error("Failed to get next question:", err);
          setError("Failed to process your answer. Please try again.");
        }
      }
      
    } catch (err) {
      console.error("Failed to process question:", err);
      setError("Failed to process your answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to finalize the project
  const finalizeProject = async (qa) => {
    try {
      setIsSubmitting(true);
      
      // Format the data for the API exactly as specified
      const apiPayload = {
        idea: projectIdea,
        qa: qa.map(item => ({
          question: item.question,
          answer: item.answer
        }))
      };
      
      console.log("Sending finalize payload:", apiPayload);
      
      // Call the finalize-project API
      const response = await freelancerService.finalizeProject(apiPayload);
      
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
    // Reset all state variables
    setShowProjectForm(true);
    setShowQuestionForm(false);
    setShowFinalDetails(false);
    setShowNewProjectConfirmation(false); // Make sure to close the confirmation popup
    setError("");
    setSuccess(false);
    setProjectIdea("");
    setCurrentQuestion("");
    setAnswer("");
    setQuestionCounter(0);
    setQuestionAnswers([]);
    setFinalProjectDetails(null);
    setIsSubmitting(false);
  };
  
  // Function to close the final details modal
  const handleCloseFinalDetails = () => {
    setShowFinalDetails(false);
    setShowCancelConfirmation(false); // Make sure to close the confirmation popup
    // You could navigate to a project details page here if needed
  };
  
  // Functions for confirmation popups
  const handleCancelClick = () => {
    setShowCancelConfirmation(true);
  };
  
  const handleCreateNewClick = () => {
    setShowNewProjectConfirmation(true);
  };
  
  const confirmCancel = () => {
    setShowCancelConfirmation(false);
    handleCloseFinalDetails();
  };
  
  const confirmCreateNew = () => {
    setShowNewProjectConfirmation(false);
    // First close the final details screen
    setShowFinalDetails(false);
    // Then show the new project form
    setTimeout(() => {
      handleCreateProject();
    }, 100);
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
                          disabled={isSubmitting || !projectIdea.trim()}
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
                      Question {questionCounter} of {minQuestions}{questionCounter >= minQuestions ? "+" : ""}
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
                        disabled={isSubmitting || !answer.trim()}
                      >
                        {isSubmitting ? "Processing..." : 
                          questionCounter >= minQuestions ? "Finalize Project" : "Next"}
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
                      onClick={handleCancelClick}
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
                        className="btn btn-cancel"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-create-new"
                        onClick={handleCreateNewClick}
                      >
                        Create New Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Confirmation Popups */}
            {showCancelConfirmation && (
              <div className="confirmation-overlay">
                <div className="confirmation-container">
                  <div className="confirmation-header">
                    <h3>Close Project Details</h3>
                  </div>
                  <div className="confirmation-body">
                    <p>Are you sure you want to close the project details? You can always view this project later in your dashboard.</p>
                  </div>
                  <div className="confirmation-actions">
                    <button 
                      type="button"
                      className="btn btn-cancel" 
                      onClick={() => setShowCancelConfirmation(false)}
                    >
                      No, Stay Here
                    </button>
                    <button 
                      type="button"
                      className="btn btn-confirm" 
                      onClick={confirmCancel}
                    >
                      Yes, Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {showNewProjectConfirmation && (
              <div className="confirmation-overlay">
                <div className="confirmation-container">
                  <div className="confirmation-header">
                    <h3>Create New Project</h3>
                  </div>
                  <div className="confirmation-body">
                    <p>Do you want to start creating a new project? Your current project will still be saved.</p>
                  </div>
                  <div className="confirmation-actions">
                    <button 
                      type="button"
                      className="btn btn-cancel" 
                      onClick={() => setShowNewProjectConfirmation(false)}
                    >
                      No, Cancel
                    </button>
                    <button 
                      type="button"
                      className="btn btn-confirm" 
                      onClick={confirmCreateNew}
                    >
                      Yes, Create New
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {children}
            <DashboardFooter />
          </div>
        </div>
      </div>
      
      {/* CSS for the forms and confirmation popups */}
      <style jsx>{`
        .project-form-overlay,
        .confirmation-overlay {
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
        
        .confirmation-overlay {
          z-index: 1100; /* Higher z-index to appear above other modals */
        }
        
        .project-form-container,
        .confirmation-container {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .confirmation-container {
          max-width: 400px;
        }
        
        .final-details-container {
          max-width: 700px;
        }
        
        .project-form-header,
        .confirmation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .confirmation-header {
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        
        .confirmation-body {
          padding: 10px 0;
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
        
        .form-actions,
        .confirmation-actions {
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
        
        .btn-submit,
        .btn-confirm {
          background-color: #007bff;
          color: white;
        }
        
        .btn-create-new {
          background-color: #28a745;
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
        
        .json-content {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          white-space: pre-wrap;
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #ddd;
        }
        
        /* Add a loading indicator style for the finalize step */
        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #007bff;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}