"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Footer from "@/components/footer/Footer";
import Header20 from "@/components/header/Header20";
import Option2 from "@/components/ui-elements/options/Option2";
import { ROLE_OPTIONS } from "@/config/constant";

// Validation schema using Yup
const loginValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean().default(false),
});

// Forgot password validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

// ForgotPasswordModal component
function ForgotPasswordModal({ isOpen, onClose, defaultEmail = "" }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });

  // Set default email when prop changes
  useEffect(() => {
    if (defaultEmail) {
      setValue("email", defaultEmail);
    }
  }, [defaultEmail, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
          }),
        }
      );

      const result = await response.json();

      if (result.status) {
        setSuccess(true);
        toast.success("Password reset link sent to your email");
        reset();
      } else {
        toast.error(result.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle closing the modal
  const handleClose = () => {
    // Reset form state when closing
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
      <div
        className="modal fade show"
        tabIndex="-1"
        style={{ display: "block", zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reset Your Password</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {success ? (
                <div className="text-center">
                  <div className="icon-success mb20">
                    <i className="fas fa-check-circle fa-3x text-success"></i>
                  </div>
                  <h4 className="mb20">Email Sent Successfully!</h4>
                  <p className="mb30">
                    We've sent a password reset link to your email address.
                    <br />
                    Please check your inbox (and spam folder) and follow the
                    instructions.
                  </p>
                  <div className="d-grid mb20">
                    <button className="ud-btn btn-thm" onClick={handleClose}>
                      Back to Login <i className="fal fa-arrow-right-long"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb30 text-center">
                    <div className="mb20">
                      <i className="fas fa-unlock-alt fa-3x text-thm"></i>
                    </div>
                    <h4>Forgot Your Password?</h4>
                    <p className="text">
                      Enter your email address below and we'll send you
                      instructions to reset your password.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb30">
                      <label className="form-label fw600 dark-color">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bgc-white border-right-0">
                          <i className="far fa-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className={`form-control border-left-0 ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="Your email address"
                          {...register("email")}
                        />
                      </div>
                      {errors.email && (
                        <div className="text-danger mt-1 fz14">
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="d-grid mb20">
                      <button
                        className="ud-btn btn-thm"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Reset Link{" "}
                            <i className="fal fa-arrow-right-long"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [countdownTime, setCountdownTime] = useState(60);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const emailInputRef = useRef(null);
  const isSessionLoading = status === "loading";

  // Focus email input on initial load
  useEffect(() => {
    if (emailInputRef.current && !isSessionLoading) {
      emailInputRef.current.focus();
    }
  }, [isSessionLoading]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (session?.accessToken) {
      router.push("/dashboard");
    }
  }, [session, router]);

  // Track excessive login attempts and countdown timer
  useEffect(() => {
    if (loginAttempts >= 5) {
      const timer = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setLoginAttempts(0);
            setCountdownTime(60);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loginAttempts]);

  const handleRoleSelect = (role) => {
    setSelectedRole([role]);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    // Rate limiting for excessive attempts
    if (loginAttempts >= 5) {
      toast.error(
        `Too many login attempts. Please try again in ${countdownTime} seconds.`
      );
      setSubmitting(false);
      return;
    }

    // Uncomment if role selection is required
    // if (!selectedRole.length) {
    //   toast.error('Please select a role');
    //   setSubmitting(false);
    //   return;
    // }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email.toLowerCase().trim(),
        password: values.password,
        remember: values.rememberMe,
        redirect: false,
      });

      if (result?.ok) {
        resetForm();
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        setLoginAttempts((prev) => prev + 1);
        toast.error(result?.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginAttempts((prev) => prev + 1);
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Uncomment if role selection is required
    // if (!selectedRole.length) {
    //   toast.error('Please select a role');
    //   return;
    // }

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed");
    }
  };

  const openForgotPasswordModal = (email = "") => {
    setForgotPasswordEmail(email);
    setForgotPasswordModalOpen(true);
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
      <section className="our-login py-5">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 m-auto wow fadeInUp"
              data-wow-delay="300ms"
            >
              <div className="main-title text-center">
                <h2 className="title">Welcome Back</h2>
                <p className="paragraph mt-3">
                  Sign in to continue your journey with us
                </p>
              </div>
            </div>
          </div>
          <div className="row wow fadeInRight" data-wow-delay="300ms">
            <div className="col-xl-6 mx-auto">
              <div className="log-reg-form search-modal form-style1 bgc-white p50 p30-sm default-box-shadow1 bdrs12">
                <div className="mb30">
                  <h4 className="mb-2">Login to your account</h4>
                  <p className="text mt20">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-thm fw-bold">
                      Sign Up
                    </Link>
                  </p>
                </div>

                <div className="d-flex justify-content-center mb-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="ud-btn btn-google fz14 fw400 d-flex align-items-center justify-content-center w-100"
                    disabled={isLoading || loginAttempts >= 5}
                  >
                    <i className="fab fa-google me-2" /> Sign in with Google
                  </button>
                </div>

                <div className="hr_content mb20">
                  <hr />
                  <span className="hr_top_text">OR</span>
                </div>

                {loginAttempts >= 5 && (
                  <div
                    className="alert alert-warning mb20 d-flex align-items-center"
                    role="alert"
                  >
                    <i className="fas fa-exclamation-triangle me-2 fs-5"></i>
                    <div>
                      <strong>Account locked</strong>
                      <p className="mb-0">
                        Too many failed attempts. Please try again in{" "}
                        {countdownTime} seconds.
                      </p>
                    </div>
                  </div>
                )}

                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                    rememberMe: false,
                  }}
                  validationSchema={loginValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched, values }) => (
                    <Form noValidate className="mt-4">
                      {/* Role selection - uncomment if needed
                      <div className="ui-content mb20">
                        <label className="form-label fw500 dark-color mb-2">
                          Sign in as
                        </label>
                        <Option2
                          lebel=""
                          data={ROLE_OPTIONS}
                          selected={selectedRole}
                          handler={handleRoleSelect}
                        />
                      </div> */}

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
                            placeholder="example@domain.com"
                            innerRef={emailInputRef}
                            aria-invalid={
                              errors.email && touched.email ? "true" : "false"
                            }
                            autoComplete="email"
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
                        <div className="d-flex justify-content-between align-items-center">
                          <label
                            htmlFor="password"
                            className="form-label fw500 dark-color mb-0"
                          >
                            Password
                          </label>

                          <button
                            type="button"
                            className="btn p-0 border-0 bg-transparent fz14 fw500 text-thm"
                            onClick={() =>
                              openForgotPasswordModal(values.email)
                            }
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="input-group mt-2 mb-1">
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
                            placeholder="••••••••"
                            aria-invalid={
                              errors.password && touched.password
                                ? "true"
                                : "false"
                            }
                            autoComplete="current-password"
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
                      </div>

                      <div className="form-check custom-checkbox mb20">
                        <Field
                          id="rememberMe"
                          name="rememberMe"
                          type="checkbox"
                          className="form-check-input"
                        />
                        <label
                          className="form-check-label fz14"
                          htmlFor="rememberMe"
                        >
                          Keep me logged in
                        </label>
                      </div>

                      <div className="d-grid mb20">
                        <button
                          className="ud-btn btn-thm default-box-shadow2"
                          type="submit"
                          disabled={
                            isLoading || isSubmitting || loginAttempts >= 5
                          }
                        >
                          {isLoading || isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Signing in...
                            </>
                          ) : (
                            <>
                              Sign In <i className="fal fa-arrow-right-long" />
                            </>
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>

                <div className="mt-4 text-center">
                  <p className="mb-0 text-muted fz14">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="text-thm">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-thm">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordModalOpen}
        onClose={() => setForgotPasswordModalOpen(false)}
        defaultEmail={forgotPasswordEmail}
      />

      <Footer />
    </div>
  );
}
