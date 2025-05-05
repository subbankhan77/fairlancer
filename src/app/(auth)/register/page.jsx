// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { signIn, useSession } from "next-auth/react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import Link from "next/link";
// import toast from "react-hot-toast";

// import Footer from "@/components/footer/Footer";
// import Header20 from "@/components/header/Header20";
// import Option2 from "@/components/ui-elements/options/Option2";
// import { ROLE_OPTIONS } from "@/config/constant";

// // API service
// import { authService } from "@/services/auth";

// // Validation schema using Yup
// const registerValidationSchema = Yup.object({
//   name: Yup.string().trim().required("Name is required"),
//   email: Yup.string()
//     .trim()
//     .email("Please enter a valid email address")
//     .required("Email is required"),
//   password: Yup.string()
//     .min(8, "Password must be at least 8 characters")
//     .matches(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
//     )
//     .required("Password is required"),
//   terms: Yup.boolean()
//     .oneOf([true], "You must accept the terms and conditions")
//     .required("You must accept the terms and conditions"),
// });

// // Password strength checker
// const getPasswordStrength = (password) => {
//   if (!password) return { strength: 0, label: "Empty", color: "bg-gray-300" };

//   // Check for length (8+), uppercase, lowercase, number, and special character
//   const hasLength = password.length >= 8;
//   const hasUppercase = /[A-Z]/.test(password);
//   const hasLowercase = /[a-z]/.test(password);
//   const hasNumber = /\d/.test(password);
//   const hasSpecial = /[@$!%*?&]/.test(password);

//   const checks = [hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial];
//   const passedChecks = checks.filter(Boolean).length;

//   // Calculate strength percentage (0-100%)
//   const strength = Math.floor((passedChecks / checks.length) * 100);

//   if (strength <= 20)
//     return { strength, label: "Very Weak", color: "bg-danger" };
//   if (strength <= 40) return { strength, label: "Weak", color: "bg-danger" };
//   if (strength <= 60) return { strength, label: "Medium", color: "bg-warning" };
//   if (strength <= 80) return { strength, label: "Strong", color: "bg-info" };
//   return { strength, label: "Very Strong", color: "bg-success" };
// };

// export default function RegisterPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedRole, setSelectedRole] = useState([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordValue, setPasswordValue] = useState("");
//   const nameInputRef = useRef(null);
//   const isSessionLoading = status === "loading";

//   // Focus name input on initial load
//   useEffect(() => {
//     if (nameInputRef.current && !isSessionLoading) {
//       nameInputRef.current.focus();
//     }
//   }, [isSessionLoading]);

//   // Redirect if user is already logged in
//   useEffect(() => {
//     if (session?.accessToken) {
//       router.push("/dashboard");
//     }
//   }, [session, router]);

//   const handleRoleSelect = (role) => {
//     setSelectedRole([role]);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handlePasswordChange = (e, formikHandleChange) => {
//     setPasswordValue(e.target.value);
//     formikHandleChange(e);
//   };

//   const passwordStrength = getPasswordStrength(passwordValue);

//   const handleSubmit = async (values, { resetForm, setSubmitting }) => {
//     if (!selectedRole.length) {
//       toast.error("Please select a role");
//       setSubmitting(false);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const registerData = {
//         name: values.name.trim(),
//         email: values.email.toLowerCase().trim(),
//         password: values.password,
//         role: selectedRole[0].toLowerCase(),
//       };

//       const response = await authService.register(registerData);

//       if (response.data.token) {
//         resetForm();
//         setPasswordValue("");
//         toast.success("Registration successful");

//         // Auto login
//         const loginResult = await signIn("credentials", {
//           email: values.email.toLowerCase().trim(),
//           password: values.password,
//           role: selectedRole[0].toLowerCase(),
//           redirect: false,
//         });

//         if (loginResult?.ok) {
//           router.push("/dashboard");
//           router.refresh();
//         } else {
//           // If auto-login fails, still consider registration successful
//           // but redirect to login page instead
//           router.push("/login");
//         }
//       } else {
//         toast.error("Registration failed");
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error(error.response?.data?.message || "Registration failed");
//     } finally {
//       setIsLoading(false);
//       setSubmitting(false);
//     }
//   };

//   const handleGoogleRegister = async () => {
//     if (!selectedRole.length) {
//       toast.error("Please select a role");
//       return;
//     }

//     try {
//       await signIn("google", {
//         callbackUrl: "/dashboard",
//       });
//     } catch (error) {
//       console.error("Google login error:", error);
//       toast.error("Google registration failed");
//     }
//   };

//   if (isSessionLoading) {
//     return (
//       <div className="bgc-thm4 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Checking authentication status...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bgc-thm4">
//       <Header20 />
//       <section className="our-register py-5">
//         <div className="container">
//           <div className="row">
//             <div
//               className="col-lg-6 m-auto wow fadeInUp"
//               data-wow-delay="300ms"
//             >
//               <div className="main-title text-center">
//                 <h2 className="title">Create Your Account</h2>
//                 <p className="paragraph mt-3">
//                   Join our community and start your journey with us
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="row wow fadeInRight" data-wow-delay="300ms">
//             <div className="col-xl-6 mx-auto">
//               <div className="log-reg-form search-modal form-style1 bgc-white p50 p30-sm default-box-shadow1 bdrs12">
//                 <div className="mb30">
//                   <h4 className="mb-2">Let's get started!</h4>
//                   <p className="text mt20">
//                     Already have an account?{" "}
//                     <Link href="/login" className="text-thm fw-bold">
//                       Log In
//                     </Link>
//                   </p>
//                 </div>

//                 <div className="d-flex justify-content-center mb-4">
//                   <button
//                     type="button"
//                     onClick={handleGoogleRegister}
//                     className="ud-btn btn-google fz14 fw400 d-flex align-items-center justify-content-center w-100"
//                     disabled={isLoading || !selectedRole.length}
//                   >
//                     <i className="fab fa-google me-2" /> Sign up with Google
//                   </button>
//                 </div>

//                 <div className="hr_content mb20">
//                   <hr />
//                   <span className="hr_top_text">OR</span>
//                 </div>

//                 <Formik
//                   initialValues={{
//                     name: "",
//                     email: "",
//                     password: "",
//                     terms: false,
//                   }}
//                   validationSchema={registerValidationSchema}
//                   onSubmit={handleSubmit}
//                 >
//                   {({ isSubmitting, errors, touched, handleChange }) => (
//                     <Form noValidate className="mt-4">
//                       <div className="ui-content mb20">
//                         <label className="form-label fw500 dark-color mb-2">
//                           I want to join as
//                         </label>
//                         <Option2
//                           lebel=""
//                           data={ROLE_OPTIONS}
//                           selected={selectedRole}
//                           handler={handleRoleSelect}
//                         />
//                         {!selectedRole.length && (
//                           <div className="text-danger mt-1 fz14">
//                             Please select a role to continue
//                           </div>
//                         )}
//                       </div>

//                       <div className="mb20">
//                         <label
//                           htmlFor="name"
//                           className="form-label fw500 dark-color"
//                         >
//                           Full Name
//                         </label>
//                         <div className="input-group mb-1">
//                           <span className="input-group-text bg-transparent">
//                             <i className="far fa-user"></i>
//                           </span>
//                           <Field
//                             id="name"
//                             name="name"
//                             type="text"
//                             className={`form-control ${
//                               errors.name && touched.name ? "is-invalid" : ""
//                             }`}
//                             innerRef={nameInputRef}
//                             aria-invalid={
//                               errors.name && touched.name ? "true" : "false"
//                             }
//                             autoComplete="name"
//                             placeholder="John Doe"
//                           />
//                         </div>
//                         <ErrorMessage
//                           name="name"
//                           component="div"
//                           className="text-danger mt-1 fz14"
//                           role="alert"
//                         />
//                       </div>

//                       <div className="mb20">
//                         <label
//                           htmlFor="email"
//                           className="form-label fw500 dark-color"
//                         >
//                           Email Address
//                         </label>
//                         <div className="input-group mb-1">
//                           <span className="input-group-text bg-transparent">
//                             <i className="far fa-envelope"></i>
//                           </span>
//                           <Field
//                             id="email"
//                             name="email"
//                             type="email"
//                             className={`form-control ${
//                               errors.email && touched.email ? "is-invalid" : ""
//                             }`}
//                             aria-invalid={
//                               errors.email && touched.email ? "true" : "false"
//                             }
//                             autoComplete="email"
//                             placeholder="example@domain.com"
//                           />
//                         </div>
//                         <ErrorMessage
//                           name="email"
//                           component="div"
//                           className="text-danger mt-1 fz14"
//                           role="alert"
//                         />
//                       </div>

//                       <div className="mb20">
//                         <label
//                           htmlFor="password"
//                           className="form-label fw500 dark-color"
//                         >
//                           Password
//                         </label>
//                         <div className="input-group mb-1">
//                           <span className="input-group-text bg-transparent">
//                             <i className="far fa-lock"></i>
//                           </span>
//                           <Field
//                             id="password"
//                             name="password"
//                             type={showPassword ? "text" : "password"}
//                             className={`form-control ${
//                               errors.password && touched.password
//                                 ? "is-invalid"
//                                 : ""
//                             }`}
//                             aria-invalid={
//                               errors.password && touched.password
//                                 ? "true"
//                                 : "false"
//                             }
//                             autoComplete="new-password"
//                             placeholder="••••••••"
//                             onChange={(e) =>
//                               handlePasswordChange(e, handleChange)
//                             }
//                           />
//                           <button
//                             type="button"
//                             className="input-group-text bg-transparent"
//                             onClick={togglePasswordVisibility}
//                             aria-label={
//                               showPassword ? "Hide password" : "Show password"
//                             }
//                           >
//                             <i
//                               className={`fa ${
//                                 showPassword ? "fa-eye-slash" : "fa-eye"
//                               }`}
//                             ></i>
//                           </button>
//                         </div>
//                         <ErrorMessage
//                           name="password"
//                           component="div"
//                           className="text-danger mt-1 fz14"
//                           role="alert"
//                         />

//                         {/* Password strength meter */}
//                         <div className="password-strength-meter my-2">
//                           <div className="d-flex justify-content-between align-items-center mb-1">
//                             <small className="text-muted">
//                               Password Strength:
//                             </small>
//                             <small
//                               className={`fw-bold text-${
//                                 passwordStrength.label === "Very Weak" ||
//                                 passwordStrength.label === "Weak"
//                                   ? "danger"
//                                   : passwordStrength.label === "Medium"
//                                   ? "warning"
//                                   : "success"
//                               }`}
//                             >
//                               {passwordStrength.label}
//                             </small>
//                           </div>
//                           <div className="progress" style={{ height: "8px" }}>
//                             <div
//                               className={`progress-bar ${passwordStrength.color}`}
//                               role="progressbar"
//                               style={{ width: `${passwordStrength.strength}%` }}
//                               aria-valuenow={passwordStrength.strength}
//                               aria-valuemin="0"
//                               aria-valuemax="100"
//                             ></div>
//                           </div>

//                           <div className="password-requirements mt-2">
//                             <small className="d-block text-muted mb-1">
//                               Password must contain:
//                             </small>
//                             <ul
//                               className="ps-3 mb-0"
//                               style={{ fontSize: "0.8rem" }}
//                             >
//                               <li
//                                 className={
//                                   passwordValue.length >= 8
//                                     ? "text-success"
//                                     : "text-muted"
//                                 }
//                               >
//                                 At least 8 characters{" "}
//                                 {passwordValue.length >= 8 && "✓"}
//                               </li>
//                               <li
//                                 className={
//                                   /[A-Z]/.test(passwordValue)
//                                     ? "text-success"
//                                     : "text-muted"
//                                 }
//                               >
//                                 One uppercase letter{" "}
//                                 {/[A-Z]/.test(passwordValue) && "✓"}
//                               </li>
//                               <li
//                                 className={
//                                   /[a-z]/.test(passwordValue)
//                                     ? "text-success"
//                                     : "text-muted"
//                                 }
//                               >
//                                 One lowercase letter{" "}
//                                 {/[a-z]/.test(passwordValue) && "✓"}
//                               </li>
//                               <li
//                                 className={
//                                   /\d/.test(passwordValue)
//                                     ? "text-success"
//                                     : "text-muted"
//                                 }
//                               >
//                                 One number {/\d/.test(passwordValue) && "✓"}
//                               </li>
//                               <li
//                                 className={
//                                   /[@$!%*?&]/.test(passwordValue)
//                                     ? "text-success"
//                                     : "text-muted"
//                                 }
//                               >
//                                 One special character (@$!%*?&){" "}
//                                 {/[@$!%*?&]/.test(passwordValue) && "✓"}
//                               </li>
//                             </ul>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mb20">
//                         <div className="form-check custom-checkbox">
//                           <Field
//                             id="terms"
//                             name="terms"
//                             type="checkbox"
//                             className="form-check-input"
//                           />
//                           <label className="form-check-label" htmlFor="terms">
//                             I agree to the{" "}
//                             <Link href="/terms" className="text-thm">
//                               Terms of Service
//                             </Link>{" "}
//                             and{" "}
//                             <Link href="/privacy" className="text-thm">
//                               Privacy Policy
//                             </Link>
//                           </label>
//                         </div>
//                         <ErrorMessage
//                           name="terms"
//                           component="div"
//                           className="text-danger mt-1 fz14"
//                           role="alert"
//                         />
//                       </div>

//                       <div className="d-grid mb20">
//                         <button
//                           className="ud-btn btn-thm default-box-shadow2"
//                           type="submit"
//                           disabled={
//                             isLoading || isSubmitting || !selectedRole.length
//                           }
//                         >
//                           {isLoading || isSubmitting ? (
//                             <>
//                               <span
//                                 className="spinner-border spinner-border-sm me-2"
//                                 role="status"
//                                 aria-hidden="true"
//                               ></span>
//                               Creating Account...
//                             </>
//                           ) : (
//                             <>
//                               Create Account{" "}
//                               <i className="fal fa-arrow-right-long" />
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </Form>
//                   )}
//                 </Formik>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import toast from "react-hot-toast";

import Footer from "@/components/footer/Footer";
import Header20 from "@/components/header/Header20";
import Option2 from "@/components/ui-elements/options/Option2";
import { ROLE_OPTIONS } from "@/config/constant";

// API service
import { authService } from "@/services/auth";

// Validation schema using Yup - SIMPLIFIED PASSWORD VALIDATION
const registerValidationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  terms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

// Simplified password strength checker
const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: "Empty", color: "bg-gray-300" };

  // Simple length-based strength calculation
  const length = password.length;
  
  if (length < 6) return { strength: 20, label: "Very Weak", color: "bg-danger" };
  if (length < 8) return { strength: 40, label: "Weak", color: "bg-danger" };
  if (length < 10) return { strength: 60, label: "Medium", color: "bg-warning" };
  if (length < 12) return { strength: 80, label: "Strong", color: "bg-info" };
  return { strength: 100, label: "Very Strong", color: "bg-success" };
};

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const nameInputRef = useRef(null);
  const isSessionLoading = status === "loading";

  // Focus name input on initial load
  useEffect(() => {
    if (nameInputRef.current && !isSessionLoading) {
      nameInputRef.current.focus();
    }
  }, [isSessionLoading]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (session?.accessToken) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleRoleSelect = (role) => {
    setSelectedRole([role]);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e, formikHandleChange) => {
    setPasswordValue(e.target.value);
    formikHandleChange(e);
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    if (!selectedRole.length) {
      toast.error("Please select a role");
      setSubmitting(false);
      return;
    }

    setIsLoading(true);

    try {
      const registerData = {
        name: values.name.trim(),
        email: values.email.toLowerCase().trim(),
        password: values.password,
        role: selectedRole[0].toLowerCase(),
      };

      const response = await authService.register(registerData);

      if (response.data.token) {
        resetForm();
        setPasswordValue("");
        toast.success("Registration successful");

        // Auto login
        const loginResult = await signIn("credentials", {
          email: values.email.toLowerCase().trim(),
          password: values.password,
          role: selectedRole[0].toLowerCase(),
          redirect: false,
        });

        if (loginResult?.ok) {
          router.push("/dashboard");
          router.refresh();
        } else {
          // If auto-login fails, still consider registration successful
          // but redirect to login page instead
          router.push("/login");
        }
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!selectedRole.length) {
      toast.error("Please select a role");
      return;
    }

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google registration failed");
    }
  };

  if (isSessionLoading) {
    return (
      <div className="bgc-thm4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bgc-thm4">
      <Header20 />
      <section className="our-register py-5">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 m-auto wow fadeInUp"
              data-wow-delay="300ms"
            >
              <div className="main-title text-center">
                <h2 className="title">Create Your Account</h2>
                <p className="paragraph mt-3">
                  Join our community and start your journey with us
                </p>
              </div>
            </div>
          </div>
          <div className="row wow fadeInRight" data-wow-delay="300ms">
            <div className="col-xl-6 mx-auto">
              <div className="log-reg-form search-modal form-style1 bgc-white p50 p30-sm default-box-shadow1 bdrs12">
                <div className="mb30">
                  <h4 className="mb-2">Let's get started!</h4>
                  <p className="text mt20">
                    Already have an account?{" "}
                    <Link href="/login" className="text-thm fw-bold">
                      Log In
                    </Link>
                  </p>
                </div>

                <div className="d-flex justify-content-center mb-4">
                  <button
                    type="button"
                    onClick={handleGoogleRegister}
                    className="ud-btn btn-google fz14 fw400 d-flex align-items-center justify-content-center w-100"
                    disabled={isLoading || !selectedRole.length}
                  >
                    <i className="fab fa-google me-2" /> Sign up with Google
                  </button>
                </div>

                <div className="hr_content mb20">
                  <hr />
                  <span className="hr_top_text">OR</span>
                </div>

                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    terms: false,
                  }}
                  validationSchema={registerValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched, handleChange }) => (
                    <Form noValidate className="mt-4">
                      <div className="ui-content mb20">
                        <label className="form-label fw500 dark-color mb-2">
                          I want to join as
                        </label>
                        <Option2
                          lebel=""
                          data={ROLE_OPTIONS}
                          selected={selectedRole}
                          handler={handleRoleSelect}
                        />
                        {!selectedRole.length && (
                          <div className="text-danger mt-1 fz14">
                            Please select a role to continue
                          </div>
                        )}
                      </div>

                      <div className="mb20">
                        <label
                          htmlFor="name"
                          className="form-label fw500 dark-color"
                        >
                          Full Name
                        </label>
                        <div className="input-group mb-1">
                          <span className="input-group-text bg-transparent">
                            <i className="far fa-user"></i>
                          </span>
                          <Field
                            id="name"
                            name="name"
                            type="text"
                            className={`form-control ${
                              errors.name && touched.name ? "is-invalid" : ""
                            }`}
                            innerRef={nameInputRef}
                            aria-invalid={
                              errors.name && touched.name ? "true" : "false"
                            }
                            autoComplete="name"
                            placeholder="John Doe"
                          />
                        </div>
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger mt-1 fz14"
                          role="alert"
                        />
                      </div>

                      <div className="mb20">
                        <label
                          htmlFor="email"
                          className="form-label fw500 dark-color"
                        >
                          Email Address
                        </label>
                        <div className="input-group mb-1">
                          <span className="input-group-text bg-transparent">
                            <i className="far fa-envelope"></i>
                          </span>
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            className={`form-control ${
                              errors.email && touched.email ? "is-invalid" : ""
                            }`}
                            aria-invalid={
                              errors.email && touched.email ? "true" : "false"
                            }
                            autoComplete="email"
                            placeholder="example@domain.com"
                          />
                        </div>
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger mt-1 fz14"
                          role="alert"
                        />
                      </div>

                      <div className="mb20">
                        <label
                          htmlFor="password"
                          className="form-label fw500 dark-color"
                        >
                          Password
                        </label>
                        <div className="input-group mb-1">
                          <span className="input-group-text bg-transparent">
                            <i className="far fa-lock"></i>
                          </span>
                          <Field
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${
                              errors.password && touched.password
                                ? "is-invalid"
                                : ""
                            }`}
                            aria-invalid={
                              errors.password && touched.password
                                ? "true"
                                : "false"
                            }
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) =>
                              handlePasswordChange(e, handleChange)
                            }
                          />
                          <button
                            type="button"
                            className="input-group-text bg-transparent"
                            onClick={togglePasswordVisibility}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            <i
                              className={`fa ${
                                showPassword ? "fa-eye-slash" : "fa-eye"
                              }`}
                            ></i>
                          </button>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger mt-1 fz14"
                          role="alert"
                        />

                        {/* Simplified Password strength meter */}
                        <div className="password-strength-meter my-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">
                              Password Strength:
                            </small>
                            <small
                              className={`fw-bold text-${
                                passwordStrength.label === "Very Weak" ||
                                passwordStrength.label === "Weak"
                                  ? "danger"
                                  : passwordStrength.label === "Medium"
                                  ? "warning"
                                  : "success"
                              }`}
                            >
                              {passwordStrength.label}
                            </small>
                          </div>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className={`progress-bar ${passwordStrength.color}`}
                              role="progressbar"
                              style={{ width: `${passwordStrength.strength}%` }}
                              aria-valuenow={passwordStrength.strength}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>

                          {/* Simplified password requirements */}
                          <div className="password-requirements mt-2">
                            <small className="d-block text-muted mb-1">
                              Password requirements:
                            </small>
                            <ul
                              className="ps-3 mb-0"
                              style={{ fontSize: "0.8rem" }}
                            >
                              <li
                                className={
                                  passwordValue.length >= 6
                                    ? "text-success"
                                    : "text-muted"
                                }
                              >
                                At least 6 characters{" "}
                                {passwordValue.length >= 6 && "✓"}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="mb20">
                        <div className="form-check custom-checkbox">
                          <Field
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="form-check-input"
                          />
                          <label className="form-check-label" htmlFor="terms">
                            I agree to the{" "}
                            <Link href="/terms" className="text-thm">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-thm">
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
                        <ErrorMessage
                          name="terms"
                          component="div"
                          className="text-danger mt-1 fz14"
                          role="alert"
                        />
                      </div>

                      <div className="d-grid mb20">
                        <button
                          className="ud-btn btn-thm default-box-shadow2"
                          type="submit"
                          disabled={
                            isLoading || isSubmitting || !selectedRole.length
                          }
                        >
                          {isLoading || isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Creating Account...
                            </>
                          ) : (
                            <>
                              Create Account{" "}
                              <i className="fal fa-arrow-right-long" />
                            </>
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}