// "use client";
// import React, { useState, useEffect } from "react";
// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import SelectInput from "../option/SelectInput";

// const projectSchema = z.object({
//   title: z.string().min(1, 'Project title is required'),
//   description: z.string().min(1, 'Project description is required'),
//   budget: z.string().min(1, 'Budget is required'),
//   deadline: z.string().optional(),
//   skills: z.array(z.string()).optional(),
//   category_id: z.string().optional(),
//   status: z.string().optional()
// });

// export default function EditProjectModal({ project, isOpen, onClose, onUpdate, isSubmitting }) {
//   const [getCategory, setCategory] = useState({
//     option: project?.category?.name || "Select",
//     value: project?.category_id || null,
//   });
  
//   const [getStatus, setStatus] = useState({
//     option: project?.status || "active",
//     value: project?.status || "active",
//   });
  
//   const [getSkills, setSkills] = useState({
//     option: project?.skills?.map(skill => skill.name).join(', ') || "Select",
//     value: project?.skills?.map(skill => skill.id) || []
//   });

//   const {
//     register,
//     setValue,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm({
//     resolver: zodResolver(projectSchema),
//     defaultValues: {
//       title: project?.title || '',
//       description: project?.description || '',
//       budget: project?.budget || '',
//       deadline: project?.deadline || '',
//       skills: project?.skills?.map(skill => skill.id) || [],
//       category_id: project?.category_id || '',
//       status: project?.status || 'active'
//     }
//   });

//   // Update form values when project changes
//   useEffect(() => {
//     if (project) {
//       reset({
//         title: project.title || '',
//         description: project.description || '',
//         budget: project.budget || '',
//         deadline: project.deadline || '',
//         skills: project.skills?.map(skill => skill.id) || [],
//         category_id: project.category_id || '',
//         status: project.status || 'active'
//       });
      
//       // Update state for selects
//       if (project.category) {
//         setCategory({
//           option: project.category.name || "Select",
//           value: project.category_id || null,
//         });
//       }
      
//       if (project.skills && project.skills.length > 0) {
//         setSkills({
//           option: project.skills.map(skill => skill.name).join(', '),
//           value: project.skills.map(skill => skill.id)
//         });
//       }
      
//       setStatus({
//         option: project.status || "active",
//         value: project.status || "active",
//       });
//     }
//   }, [project, reset]);

//   const categoryHandler = (option, value) => {
//     setCategory({ option, value });
//     setValue('category_id', value);
//   };

//   const statusHandler = (option, value) => {
//     setStatus({ option, value });
//     setValue('status', value);
//   };

//   const skillsHandler = (selectedOptions) => {
//     // Handle both single and multiple selections
//     if (!selectedOptions) {
//       setSkills({ option: "Select", value: [] });
//       setValue('skills', []);
//       return;
//     }
  
//     // If it's an array (multiple selections)
//     if (Array.isArray(selectedOptions)) {
//       const skillValues = selectedOptions.map(opt => opt.value);
//       setSkills({ 
//         option: selectedOptions.map(opt => opt.option).join(', '),
//         value: skillValues
//       });
//       setValue('skills', skillValues);
//     } 
//     // If it's a single selection
//     else {
//       setSkills({
//         option: selectedOptions.option,
//         value: [selectedOptions.value]
//       });
//       setValue('skills', [selectedOptions.value]);
//     }
//   };

//   const onSubmit = (data) => {
//     // Make sure to include values from state selectors
//     const updatedData = {
//       ...data,
//       skills: getSkills.value,
//       category_id: getCategory.value,
//       status: getStatus.value
//     };
//     console.log("updatedDataupdatedDataupdatedData",updatedData);
    
//     onUpdate(updatedData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Edit Project</h5>
//             <button type="button" className="btn-close" onClick={onClose}></button>
//           </div>
//           <div className="modal-body">
//             <form onSubmit={handleSubmit(onSubmit)} className="form-style1">
//               <div className="row">
//                 <div className="col-sm-12">
//                   <div className="mb20">
//                     <label className="heading-color ff-heading fw500 mb10">
//                       Project Title
//                     </label>
//                     <input
//                       type="text"
//                       className={`form-control ${errors.title ? 'is-invalid' : ''}`}
//                       placeholder="Enter project title"
//                       {...register('title')}
//                     />
//                     {errors.title && (
//                       <span className="text-danger">{errors.title.message}</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-sm-6">
//                   <div className="mb20">
//                     <SelectInput
//                       label="Category"
//                       defaultSelect={{
//                         option: typeof getCategory.option === 'string' ? getCategory.option : "Select",
//                         value: getCategory.value
//                       }}
//                       data={[
//                         { option: "Web Development", value: "1" },
//                         { option: "Mobile App", value: "2" },
//                         { option: "Design", value: "3" },
//                         { option: "Writing", value: "4" },
//                       ]}
//                       handler={categoryHandler}
//                     />
//                     {errors.category_id && (
//                       <span className="text-danger">{errors.category_id.message}</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-sm-6">
//                   <div className="mb20">
//                     <label className="heading-color ff-heading fw500 mb10">
//                       Budget
//                     </label>
//                     <input
//                       type="text"
//                       className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
//                       placeholder="Enter budget"
//                       {...register('budget')}
//                     />
//                     {errors.budget && (
//                       <span className="text-danger">{errors.budget.message}</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-sm-6">
//                   <div className="mb20">
//                     <label className="heading-color ff-heading fw500 mb10">
//                       Deadline
//                     </label>
//                     <input
//                       type="date"
//                       className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
//                       {...register('deadline')}
//                     />
//                     {errors.deadline && (
//                       <span className="text-danger">{errors.deadline.message}</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-sm-6">
//                   <div className="mb20">
//                     <SelectInput
//                       label="Status"
//                       defaultSelect={{
//                         option: typeof getStatus.option === 'string' ? getStatus.option : "Active",
//                         value: getStatus.value
//                       }}
//                       data={[
//                         { option: "Active", value: "active" },
//                         { option: "Completed", value: "completed" },
//                         { option: "Cancelled", value: "cancelled" },
//                       ]}
//                       handler={statusHandler}
//                     />
//                     {errors.status && (
//                       <span className="text-danger">{errors.status.message}</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-sm-12">
//                   <div className="mb20">
//                     <SelectInput
//                       label="Skills"
//                       defaultSelect={{
//                         option: typeof getSkills.option === 'string' ? getSkills.option : "Select",
//                         value: getSkills.value
//                       }}
//                       data={[
//                         { option: "HTML", value: "1" },
//                         { option: "CSS", value: "2" },
//                         { option: "JavaScript", value: "3" },
//                         { option: "React", value: "4" },
//                         { option: "Node.js", value: "5" },
//                         { option: "PHP", value: "6" },
//                         { option: "Laravel", value: "7" },
//                       ]}
//                       handler={skillsHandler}
//                       isMulti={true}
//                     />
//                     {errors.skills && (
//                       <span className="text-danger">{errors.skills.message}</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-md-12">
//                   <div className="mb20">
//                     <label className="heading-color ff-heading fw500 mb10">
//                       Project Description
//                     </label>
//                     <textarea 
//                       cols={30} 
//                       rows={6} 
//                       className={`form-control ${errors.description ? 'is-invalid' : ''}`}
//                       placeholder="Write project description"
//                       {...register('description')}
//                     />
//                     {errors.description && (
//                       <span className="text-danger">{errors.description.message}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="modal-footer border-top-0 pt-0">
//                 <button type="button" className="ud-btn btn-light" onClick={onClose}>
//                   Close
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="ud-btn btn-thm"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? 'Updating...' : 'Update Project'}
//                   <i className="fal fa-arrow-right-long" />
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SelectInput from "../option/SelectInput";
import { commonService } from "@/services/common";

const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Project description is required'),
  budget: z.string().min(1, 'Budget is required'),
  deadline: z.string().optional(),
  skills: z.array(z.string()).optional(),
  category_id: z.string().optional(),
  status: z.string().optional()
});

export default function EditProjectModal({ project, isOpen, onClose, onUpdate, isSubmitting }) {
  const [getCategory, setCategory] = useState({
    option: project?.category?.name || "Select",
    value: project?.category_id || null,
  });
  
  const [getStatus, setStatus] = useState({
    option: project?.status || "active",
    value: project?.status || "active",
  });
  
  const [getSkills, setSkills] = useState({
    option: project?.skills?.map(skill => skill.name).join(', ') || "Select",
    value: project?.skills?.map(skill => skill.id) || []
  });

  // Add state for storing skills from API
  const [skillOptions, setSkillOptions] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([
    { option: "Web Development", value: "1" },
    { option: "Mobile App", value: "2" },
    { option: "Design", value: "3" },
    { option: "Writing", value: "4" },
  ]);

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      budget: project?.budget || '',
      deadline: project?.deadline || '',
      skills: project?.skills?.map(skill => skill.id) || [],
      category_id: project?.category_id || '',
      status: project?.status || 'active'
    }
  });

  // Fetch skills from API
  useEffect(() => {
   // Replace your skills fetch function with this:

const fetchSkills = async () => {
  try {
    const response = await commonService.getSkills();
    console.log("Skills API Response:", response);
    
    // Check if the response has data and skills within that data
    if (response.status && response.data && response.data.skills) {
      // Transform the API response to match the format your SelectInput expects
      const options = response.data.skills.map(skill => ({
        option: skill.name,  // Use 'option' for SelectInput
        value: String(skill.id)  // Convert to string as SelectInput expects
      }));
      
      setSkillOptions(options);
      console.log("Transformed skill options:", options);
    } else {
      console.error('Invalid skills data structure:', response);
      // Fallback with empty array or default options
      setSkillOptions([]);
    }
  } catch (error) {
    console.error('Error fetching skills:', error);
    // Fallback with empty array
    setSkillOptions([]);
  }
};
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories'); 
        if (response.ok) {
          const data = await response.json();
          const options = data.map(category => ({
            option: category.name,
            value: String(category.id)
          }));
          setCategoriesOptions(options);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchSkills();
    fetchCategories(); // Optional
  }, []);

  // Update form values when project changes
  useEffect(() => {
    if (project) {
      reset({
        title: project.title || '',
        description: project.description || '',
        budget: project.budget || '',
        deadline: project.deadline || '',
        skills: project.skills?.map(skill => skill.id) || [],
        category_id: project.category_id || '',
        status: project.status || 'active'
      });
      
      // Update state for selects
      if (project.category) {
        setCategory({
          option: project.category.name || "Select",
          value: project.category_id || null,
        });
      }
      
      if (project.skills && project.skills.length > 0) {
        setSkills({
          option: project.skills.map(skill => skill.name).join(', '),
          value: project.skills.map(skill => skill.id)
        });
      }
      
      setStatus({
        option: project.status || "active",
        value: project.status || "active",
      });
    }
  }, [project, reset]);

  const categoryHandler = (option, value) => {
    setCategory({ option, value });
    setValue('category_id', value);
  };

  const statusHandler = (option, value) => {
    setStatus({ option, value });
    setValue('status', value);
  };

  const skillsHandler = (selectedOptions) => {
    // Handle both single and multiple selections
    if (!selectedOptions) {
      setSkills({ option: "Select", value: [] });
      setValue('skills', []);
      return;
    }
  
    // If it's an array (multiple selections)
    if (Array.isArray(selectedOptions)) {
      const skillValues = selectedOptions.map(opt => opt.value);
      setSkills({ 
        option: selectedOptions.map(opt => opt.option).join(', '),
        value: skillValues
      });
      setValue('skills', skillValues);
    } 
    // If it's a single selection
    else {
      setSkills({
        option: selectedOptions.option,
        value: [selectedOptions.value]
      });
      setValue('skills', [selectedOptions.value]);
    }
  };

  const onSubmit = (data) => {
    // Make sure to include values from state selectors
    const updatedData = {
      ...data,
      skills: getSkills.value,
      category_id: getCategory.value,
      status: getStatus.value
    };
    console.log("updatedData:", updatedData);
    
    onUpdate(updatedData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Project</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)} className="form-style1">
              <div className="row">
                <div className="col-sm-12">
                  <div className="mb20">
                    <label className="heading-color ff-heading fw500 mb10">
                      Project Title
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      placeholder="Enter project title"
                      {...register('title')}
                    />
                    {errors.title && (
                      <span className="text-danger">{errors.title.message}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="mb20">
                    <SelectInput
                      label="Category"
                      defaultSelect={{
                        option: typeof getCategory.option === 'string' ? getCategory.option : "Select",
                        value: getCategory.value
                      }}
                      data={categoriesOptions}
                      handler={categoryHandler}
                    />
                    {errors.category_id && (
                      <span className="text-danger">{errors.category_id.message}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="mb20">
                    <label className="heading-color ff-heading fw500 mb10">
                      Budget
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
                      placeholder="Enter budget"
                      {...register('budget')}
                    />
                    {errors.budget && (
                      <span className="text-danger">{errors.budget.message}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="mb20">
                    <label className="heading-color ff-heading fw500 mb10">
                      Deadline
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
                      {...register('deadline')}
                    />
                    {errors.deadline && (
                      <span className="text-danger">{errors.deadline.message}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="mb20">
                    <SelectInput
                      label="Status"
                      defaultSelect={{
                        option: typeof getStatus.option === 'string' ? getStatus.option : "Active",
                        value: getStatus.value
                      }}
                      data={[
                        { option: "Active", value: "active" },
                        { option: "Completed", value: "completed" },
                        { option: "Cancelled", value: "cancelled" },
                      ]}
                      handler={statusHandler}
                    />
                    {errors.status && (
                      <span className="text-danger">{errors.status.message}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="mb20">
                    <SelectInput
                      label="Skills"
                      defaultSelect={{
                        option: typeof getSkills.option === 'string' ? getSkills.option : "Select",
                        value: getSkills.value
                      }}
                      data={skillOptions}
                      handler={skillsHandler}
                      isMulti={true}
                    />
                    {errors.skills && (
                      <span className="text-danger">{errors.skills.message}</span>
                    )}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="mb20">
                    <label className="heading-color ff-heading fw500 mb10">
                      Project Description
                    </label>
                    <textarea 
                      cols={30} 
                      rows={6} 
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      placeholder="Write project description"
                      {...register('description')}
                    />
                    {errors.description && (
                      <span className="text-danger">{errors.description.message}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="ud-btn btn-light" onClick={onClose}>
                  Close
                </button>
                <button 
                  type="submit" 
                  className="ud-btn btn-thm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Project'}
                  <i className="fal fa-arrow-right-long" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}