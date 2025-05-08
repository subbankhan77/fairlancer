"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import toast from "react-hot-toast";

import Footer from "@/components/footer/Footer";
import Header20 from "@/components/header/Header20";
import FullScreenLoader from "@/components/loaders/FullScreenLoader";
import { freelancerService } from "@/services/freelancer";

// Validation schema
const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Get token and email from URL
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!tokenParam || !emailParam) {
      console.error("Missing token or email in URL parameters");
      setErrorMessage("Invalid reset link. Missing required parameters.");
      setIsLoading(false);
      return;
    }

    // Set token and email from URL parameters
    setToken(tokenParam);
    setEmail(emailParam);
    setIsLoading(false);
    
  }, [searchParams]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsResetting(true);
    
    try {
      console.log("Sending reset password request", {
        token,
        email: email,
        password: values.password,
        password_confirmation: values.confirmPassword
      });
      
      try {
        const response = await freelancerService.resetPassword({
          token: token,
          email: email,
          password: values.password,
          password_confirmation: values.confirmPassword
        });
        
        console.log("Reset password response:", response);
        toast.success("Password has been reset successfully!");
        
        // After a short delay, redirect to login page
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (apiError) {
        console.error("API Error Details:", apiError);
        
        // More detailed error logging
        if (apiError.response) {
          console.log("Response status:", apiError.response.status);
          console.log("Response data:", apiError.response.data);
        }
        
        // Check if we have a meaningful error message from the server
        if (apiError.response && apiError.response.data && apiError.response.data.message) {
          toast.error(apiError.response.data.message);
        } else {
          toast.error("Failed to reset password. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsResetting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="bgc-thm4">
      {isLoading && <FullScreenLoader message="Preparing reset password page..." />}
      
      <Header20 />
      <section className="our-login py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 m-auto wow fadeInUp" data-wow-delay="300ms">
              <div className="main-title text-center">
                <h2 className="title">Reset Your Password</h2>
                <p className="paragraph mt-3">
                  Create a new password for your account
                </p>
              </div>
            </div>
          </div>
          <div className="row wow fadeInRight" data-wow-delay="300ms">
            <div className="col-xl-6 mx-auto">
              <div className="log-reg-form search-modal form-style1 bgc-white p50 p30-sm default-box-shadow1 bdrs12">
                {!isLoading ? (
                  <>
                    <div className="mb30">
                      <h4 className="mb-2">Create New Password</h4>
                      <p className="text">
                        Your new password must be different from previous passwords.
                      </p>
                    </div>

                    <Formik
                      initialValues={{
                        password: "",
                        confirmPassword: "",
                      }}
                      validationSchema={resetPasswordSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting, errors, touched }) => (
                        <Form noValidate>
                          {/* Display email to user */}
                          <div className="mb20">
                            <label className="form-label fw500 dark-color">
                              Email Address
                            </label>
                            <div className="input-group mb-1">
                              <span className="input-group-text bg-transparent">
                                <i className="far fa-envelope"></i>
                              </span>
                              <input
                                type="email"
                                className="form-control"
                                value={email}
                                readOnly
                                disabled
                              />
                            </div>
                          </div>

                          <div className="mb20">
                            <label className="form-label fw500 dark-color">
                              New Password
                            </label>
                            <div className="input-group mb-1">
                              <span className="input-group-text bg-transparent">
                                <i className="far fa-lock"></i>
                              </span>
                              <Field
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className={`form-control ${
                                  errors.password && touched.password ? "is-invalid" : ""
                                }`}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                              />
                              <button
                                type="button"
                                className="input-group-text bg-transparent"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Hide password" : "Show password"}
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
                            />
                          </div>

                          <div className="mb30">
                            <label className="form-label fw500 dark-color">
                              Confirm New Password
                            </label>
                            <div className="input-group mb-1">
                              <span className="input-group-text bg-transparent">
                                <i className="far fa-lock"></i>
                              </span>
                              <Field
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                className={`form-control ${
                                  errors.confirmPassword && touched.confirmPassword
                                    ? "is-invalid"
                                    : ""
                                }`}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                              />
                              <button
                                type="button"
                                className="input-group-text bg-transparent"
                                onClick={toggleConfirmPasswordVisibility}
                                aria-label={
                                  showConfirmPassword ? "Hide password" : "Show password"
                                }
                              >
                                <i
                                  className={`fa ${
                                    showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                                  }`}
                                ></i>
                              </button>
                            </div>
                            <ErrorMessage
                              name="confirmPassword"
                              component="div"
                              className="text-danger mt-1 fz14"
                            />
                          </div>

                          <div className="d-grid mb20">
                            <button
                              className="ud-btn btn-thm default-box-shadow2"
                              type="submit"
                              disabled={isResetting || isSubmitting}
                            >
                              {isResetting || isSubmitting ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Resetting Password...
                                </>
                              ) : (
                                <>
                                  Reset Password <i className="fal fa-arrow-right-long" />
                                </>
                              )}
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </>
                ) : (
                  !isLoading && errorMessage && (
                    <div className="text-center py-5">
                      <div className="mb30">
                        <i className="fas fa-exclamation-triangle fa-3x text-warning mb20"></i>
                        <h4>Invalid or Expired Link</h4>
                        <p className="mt3">
                          {errorMessage || "This password reset link is invalid or has expired. Please request a new one."}
                        </p>
                      </div>
                      <Link
                        href="/login"
                        className="ud-btn btn-thm default-box-shadow2"
                      >
                        Back to Login <i className="fal fa-arrow-right-long" />
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}