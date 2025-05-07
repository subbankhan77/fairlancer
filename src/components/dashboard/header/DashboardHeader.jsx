// "use client";
// import { useEffect, useState } from "react";
// import { dasboardNavigation } from "@/data/dashboard";
// import toggleStore from "@/store/toggleStore";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useSession, signOut } from "next-auth/react";
// import toast from 'react-hot-toast';

// import { DEFAULT_AVATAR } from "@/config/constant";
// // menu
// import {menuConfig} from "@/config/menuConfig";
// // Import freelancerService
// import { freelancerService } from '@/services/freelancer';

// export default function DashboardHeader() {
//   const { data: session } = useSession();
//   const [user, setUser] = useState(null);
//   const [menus, setMenus] = useState([]);
//   const [deactivating, setDeactivating] = useState(false);
//   const toggle = toggleStore((state) => state.dashboardSlidebarToggleHandler);
//   const path = usePathname();
//   const router = useRouter();

//   // Function to handle account deactivation using the service
//   const handleDeactivateAccount = async () => {
//     if (deactivating) return; // Prevent multiple clicks

//     // Confirm with the user before proceeding
//     if (!confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       setDeactivating(true);
      
//       // Call the deactivate API through the service
//       await freelancerService.deactivateAccount();
      
//       // Show success message
//       toast.success('Your account has been deactivated.');
      
//       // Sign out the user
//       await signOut({ redirect: false });
      
//       // Redirect to home page
//       router.push('/');
//     } catch (error) {
//       console.error('Error deactivating account:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to deactivate account. Please try again.';
//       toast.error(errorMessage);
//     } finally {
//       setDeactivating(false);
//     }
//   };

//   // Determine if user is company/agency or individual
//   const isCompanyOrAgency = () => {
//     return session?.user?.role === 'company' || session?.user?.role === 'agency';
//   };

//   // Get the proper settings name based on user role
//   const getSettingsName = () => {
//     if (session?.user?.role === 'company') return 'Company Settings';
//     if (session?.user?.role === 'agency') return 'Agency Settings';
//     return 'Settings';
//   };

//   // Navigate to teams page or company/agency settings
//   const handleTeamsNavigation = () => {
//     const role = session?.user?.role;
//     if (role === 'company') {
//       router.push('/company/settings?tab=teams');
//     } else if (role === 'agency') {
//       router.push('/agency/settings?tab=teams');
//     }
//   };

//   useEffect(() => {
//     if (session?.user) {
//       // Fix image path if it contains duplicate "/images/" segments
//       const userData = { ...session.user };
//       if (userData.image && userData.image.includes("/images//images/")) {
//         userData.image = userData.image.replace("/images//images/", "/images/");
//       }
//       setUser(userData);
      
//       // Get menus from menuConfig based on user role
//       let userMenus = { ...menuConfig[userData.role] || menuConfig.default || {} };
      
//       // For proper logging and debugging
//       console.log("Original menus:", userMenus);
      
//       setMenus(userMenus);
//     } else {
//       setUser(null);
//     }
    
//     // Log for debugging
//     console.log("Profile image path:", session?.user?.image);
//   }, [session]);

//   // Function to get proper image path or fallback to default
//   const getUserImagePath = () => {
//     if (!user?.image) return DEFAULT_AVATAR;
    
//     // Check if URL has duplicate domain prefix
//     if (user.image.includes('https://fairlancer.org/https://fairlancer.org/')) {
//       return user.image.replace('https://fairlancer.org/https://fairlancer.org/', 'https://fairlancer.org/');
//     }
    
//     // Check for other common path issues
//     if (user.image.includes('/images//images/')) {
//       return user.image.replace('/images//images/', '/images/');
//     }
    
//     // Return the original path if no issues found
//     return user.image;
//   };

//   return (
//     <>
//       <header className="header-nav nav-innerpage-style menu-home4 dashboard_header main-menu">
//         <nav className="posr">
//           <div className="container-fluid pr30 pr15-xs pl30 posr menu_bdrt1">
//             <div className="row align-items-center justify-content-between">
//               <div className="col-6 col-lg-auto">
//                 <div className="text-center text-lg-start d-flex align-items-center">
//                   <div className="dashboard_header_logo position-relative me-2 me-xl-5">
//                     <Link href="/" className="logo">
//                       <Image
//                         height={40}
//                         width={133}
//                         src="/images/header-logo-dark.svg"
//                         alt="logo"
//                       />
//                     </Link>
//                   </div>
//                   <div className="fz20 ml90">
//                     <a
//                       onClick={toggle}
//                       className="dashboard_sidebar_toggle_icon vam"
//                     >
//                       <Image
//                         height={18}
//                         width={20}
//                         src="/images/dashboard-navicon.svg"
//                         alt="navicon"
//                       />
//                     </a>
//                   </div>
//                   <a
//                     className="login-info d-block d-xl-none ml40 vam"
//                     data-bs-toggle="modal"
//                     href="#exampleModalToggle"
//                   >
//                     {/* <span className="flaticon-loupe" /> */}
//                   </a>
//                   <div className="ml40 d-none d-xl-block">
//                     <div className="search_area dashboard-style">
//                       {/* <input
//                         type="text"
//                         className="form-control border-0"
//                         placeholder="What service are you looking for today?"
//                       /> */}
//                       {/* <label>
//                         <span className="flaticon-loupe" />
//                       </label> */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-6 col-lg-auto">
//                 <div className="text-center text-lg-end header_right_widgets">
//                   <ul className="dashboard_dd_menu_list d-flex align-items-center justify-content-center justify-content-sm-end mb-0 p-0">
//                     {/* Quick Action Button - NEW */}
//                     {isCompanyOrAgency() && (
//                       <li className="d-none d-sm-block me-3">
//                         <div className="dropdown">
//                           <button
//                             className="ud-btn btn-thm dropdown-toggle"
//                             type="button"
//                             data-bs-toggle="dropdown"
//                             aria-expanded="false"
//                           >
//                             <i className="flaticon-add me-1"></i> Quick Actions
//                           </button>
//                           <ul className="dropdown-menu dropdown-menu-end">
//                             <li>
//                               <Link className="dropdown-item" href="/projects/create">
//                                 <i className="flaticon-document me-2"></i> New Project
//                               </Link>
//                             </li>
//                             <li>
//                               <a className="dropdown-item" href="#" onClick={handleTeamsNavigation}>
//                                 <i className="flaticon-group me-2"></i> Manage Teams
//                               </a>
//                             </li>
//                             <li>
//                               <Link className="dropdown-item" href="/tasks/create">
//                                 <i className="flaticon-checklist me-2"></i> New Task
//                               </Link>
//                             </li>
//                           </ul>
//                         </div>
//                       </li>
//                     )}
                    
//                     {/* Deactivate Account Button */}
//                     <li className="d-none d-sm-block me-3">
//                       <button
//                         onClick={handleDeactivateAccount}
//                         className="ud-btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
//                         style={{ width: "40px", height: "40px" }}
//                         title="Deactivate Account"
//                         disabled={deactivating}
//                       >
//                         {deactivating ? (
//                           <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//                         ) : (
//                           <i className="flaticon-delete fz16"></i>
//                         )}
//                       </button>
//                     </li>
                    
//                     <li className="d-none d-sm-block">
//                       <a
//                         className="text-center mr5 text-thm2 dropdown-toggle fz20"
//                         type="button"
//                         data-bs-toggle="dropdown"
//                       >
//                         <span className="flaticon-notification" />
//                       </a>
//                       <div className="dropdown-menu">
//                         <div className="dboard_notific_dd px30 pt10 pb15">
//                           <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
//                             <Image
//                               height={40}
//                               width={40}
//                               src="/images/resource/notif-1.png"
//                               alt="notif"
//                             />
//                             <div className="details ml10">
//                               <p className="text mb-0">Your resume</p>
//                               <p className="text mb-0">updated!</p>
//                             </div>
//                           </div>
//                           <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
//                             <Image
//                               height={40}
//                               width={40}
//                               src="/images/resource/notif-2.png"
//                               alt="notif"
//                             />
//                             <div className="details ml10">
//                               <p className="text mb-0">You changed</p>
//                               <p className="text mb-0">password</p>
//                             </div>
//                           </div>
//                           <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
//                             <Image
//                               height={40}
//                               width={40}
//                               src="/images/resource/notif-3.png"
//                               alt="notif"
//                             />
//                             <div className="details ml10">
//                               <p className="text mb-0">Your account has been</p>
//                               <p className="text mb-0">created successfully</p>
//                             </div>
//                           </div>
//                           <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
//                             <Image
//                               height={40}
//                               width={40}
//                               src="/images/resource/notif-4.png"
//                               alt="notif"
//                             />
//                             <div className="details ml10">
//                               <p className="text mb-0">
//                                 You applied for a job{" "}
//                               </p>
//                               <p className="text mb-0">Front-end Developer</p>
//                             </div>
//                           </div>
//                           <div className="notif_list d-flex align-items-center">
//                             <Image
//                               height={40}
//                               width={40}
//                               src="/images/resource/notif-5.png"
//                               alt="notif"
//                             />
//                             <div className="details ml10">
//                               <p className="text mb-0">Your course uploaded</p>
//                               <p className="text mb-0">successfully</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="d-none d-sm-block">
//                       <a
//                         className="text-center mr5 text-thm2 dropdown-toggle fz20"
//                         type="button"
//                         data-bs-toggle="dropdown"
//                       >
//                         <span className="flaticon-mail" />
//                       </a>
//                       <div className="dropdown-menu">
//                         <div className="dboard_notific_dd px30 pt20 pb15">
//                           <div className="notif_list d-flex align-items-start bdrb1 pb25 mb10">
//                             <Image
//                               height={50}
//                               width={50}
//                               className="img-2"
//                               src="/images/testimonials/testi-1.png"
//                               alt="testimonials"
//                             />
//                             <div className="details ml15">
//                               <p className="dark-color fw500 mb-2">Ali Tufan</p>
//                               <p className="text mb-2">
//                                 Lorem ipsum dolor sit amet, consectetur
//                                 adipiscing.
//                               </p>
//                               <p className="mb-0 text-thm">4 hours ago</p>
//                             </div>
//                           </div>
//                           <div className="notif_list d-flex align-items-start mb25">
//                             <Image
//                               height={50}
//                               width={50}
//                               className="img-2"
//                               src="/images/testimonials/testi-2.png"
//                               alt="testimonials"
//                             />
//                             <div className="details ml15">
//                               <p className="dark-color fw500 mb-2">Ali Tufan</p>
//                               <p className="text mb-2">
//                                 Lorem ipsum dolor sit amet, consectetur
//                                 adipiscing.
//                               </p>
//                               <p className="mb-0 text-thm">4 hours ago</p>
//                             </div>
//                           </div>
//                           <div className="d-grid">
//                             <Link
//                               href="/message"
//                               className="ud-btn btn-thm w-100"
//                             >
//                               View All Messages
//                               <i className="fal fa-arrow-right-long" />
//                             </Link>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="d-none d-sm-block">
//                       <a
//                         className="text-center mr5 text-thm2 dropdown-toggle fz20"
//                         type="button"
//                         data-bs-toggle="dropdown"
//                       >
//                         <span className="flaticon-like" />
//                       </a>
//                       <div className="dropdown-menu">
//                         <div className="dboard_notific_dd px30 pt10 pb15">
//                           <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
//                             <Image
//                               height={40}
//                               width={40}
//                               src="/images/resource/notif-1.png"
//                               alt="notif"
//                             />
//                             <div className="details ml10">
//                               <p className="text mb-0">Your resume</p>
//                               <p className="text mb-0">updated!</p>
//                             </div>
//                           </div>
//                           <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
//                             <Image
//                               height={40}
//                               width={40}
//                               src="/images/resource/notif-2.png"
//                               alt="notif"
//                             />
//                             <div className="details ml10">
//                               <p className="text mb-0">You changed</p>
//                               <p className="text mb-0">password</p>
//                             </div>
//                           </div>
//                           <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
//                             <Image
//                               height={40}
//                               width={40}
//                               src="/images/resource/notif-3.png"
//                               alt="notif"
//                             />
//                             <div className="details ml10">
//                               <p className="text mb-0">Your account has been</p>
//                               <p className="text mb-0">created successfully</p>
//                             </div>
//                           </div>
//                           <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
//                             <Image
//                               height={40}
//                               width={40}
//                               src="/images/resource/notif-4.png"
//                               alt="notif"
//                             />
//                             <div className="details ml10">
//                               <p className="text mb-0">
//                                 You applied for a job{" "}
//                               </p>
//                               <p className="text mb-0">Front-end Developer</p>
//                             </div>
//                           </div>
//                           <div className="notif_list d-flex align-items-center">
//                             <Image
//                               height={40}
//                               width={40}
//                               src="/images/resource/notif-5.png"
//                               alt="notif"
//                             />
//                             <div className="details ml10">
//                               <p className="text mb-0">Your course uploaded</p>
//                               <p className="text mb-0">successfully</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="user_setting">
//                       <div className="dropdown">
//                         <a className="btn" data-bs-toggle="dropdown">
//                           <Image
//                             height={50}
//                             width={50}
//                             src={getUserImagePath()}
//                             alt="user"
//                           />
//                         </a>
//                         <div className="dropdown-menu dropdown-menu-end" style={{ transform: "translate(0px, 54px) !important" }}>
//                           <div className="user_setting_content">
//                             <p className="fz15 fw400 ff-heading mb10 pl30">
//                               Account
//                             </p>
//                             {/* Render original menu items */}
//                             {menus?.account?.map((item,i) => (
//                               <Link
//                                 key={i}
//                                 className={`dropdown-item ${
//                                   path === item.path ? "active" : ""
//                                 }`}
//                                 href={item.path}
//                               >
//                                 <i className={`${item.icon} mr10`} />
//                                 {item.name}
//                               </Link>
//                             ))}
                            
//                             {/* Add Company/Agency Settings only if user is company/agency */}
//                             {isCompanyOrAgency() && (
//                               <Link
//                                 className={`dropdown-item ${
//                                   path === `/${session?.user?.role}/settings` ? "active" : ""
//                                 }`}
//                                 href={`/${session?.user?.role}/settings?tab=teams`}
//                               >
//                                 <i className="flaticon-setting mr10" />
//                                 {getSettingsName()}
//                               </Link>
//                             )}
                            
//                             {/* Add My Info Item */}
//                             <Link
//                               className={`dropdown-item ${
//                                 path === "/my-info" ? "active" : ""
//                               }`}
//                               href="/teams"
//                             >
//                               <i className="flaticon-user mr10" />
//                               My Info
//                             </Link>
                            
//                             {/* Add Logout Item */}
//                             {/* <a
//                               className="dropdown-item"
//                               href="#"
//                               onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
//                             >
//                               <i className="flaticon-logout mr10" />
//                               Logout
//                             </a> */}
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </nav>
//       </header>
//     </>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import toggleStore from "@/store/toggleStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import toast from 'react-hot-toast';

import { DEFAULT_AVATAR } from "@/config/constant";
// menu
import {menuConfig} from "@/config/menuConfig";
// Import freelancerService
import { freelancerService } from '@/services/freelancer';

export default function DashboardHeader() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);
  const [deactivating, setDeactivating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const toggle = toggleStore((state) => state.dashboardSlidebarToggleHandler);
  const path = usePathname();
  const router = useRouter();

  // Function to handle logout with proper redirection
  const handleLogout = async (e) => {
    e.preventDefault();
    
    if (isLoggingOut) return; // Prevent multiple clicks
    
    try {
      setIsLoggingOut(true);
      
      // First show a success message
      toast.success('Logging out...');
      
      // Then sign out without automatic redirect
      await signOut({ redirect: false });
      
      // Manual redirect after short delay to ensure state update
      setTimeout(() => {
        router.push('/login');
      }, 300);
      
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Logout failed. Please try again.');
      setIsLoggingOut(false);
    }
  };

  // Function to handle account deactivation using the service
  const handleDeactivateAccount = async () => {
    if (deactivating) return; // Prevent multiple clicks

    // Confirm with the user before proceeding
    if (!confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
      return;
    }

    try {
      setDeactivating(true);
      
      // Call the deactivate API through the service
      await freelancerService.deactivateAccount();
      
      // Show success message
      toast.success('Your account has been deactivated.');
      
      // Sign out the user
      await signOut({ redirect: false });
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error deactivating account:', error);
      const errorMessage = error.response?.data?.message || 'Failed to deactivate account. Please try again.';
      toast.error(errorMessage);
    } finally {
      setDeactivating(false);
    }
  };

  // Determine if user is company/agency or individual
  const isCompanyOrAgency = () => {
    return session?.user?.role === 'company' || session?.user?.role === 'agency';
  };

  // Get the proper settings name based on user role
  const getSettingsName = () => {
    if (session?.user?.role === 'company') return 'Company Settings';
    if (session?.user?.role === 'agency') return 'Agency Settings';
    return 'Settings';
  };

  // Navigate to teams page or company/agency settings
  const handleTeamsNavigation = () => {
    const role = session?.user?.role;
    if (role === 'company') {
      router.push('/company/settings?tab=teams');
    } else if (role === 'agency') {
      router.push('/agency/settings?tab=teams');
    }
  };

  useEffect(() => {
    if (session?.user) {
      // Fix image path if it contains duplicate "/images/" segments
      const userData = { ...session.user };
      if (userData.image && userData.image.includes("/images//images/")) {
        userData.image = userData.image.replace("/images//images/", "/images/");
      }
      setUser(userData);
      
      // Get menus from menuConfig based on user role
      let userMenus = { ...menuConfig[userData.role] || menuConfig.default || {} };
      
      // For proper logging and debugging
      console.log("Original menus:", userMenus);
      
      setMenus(userMenus);
    } else {
      setUser(null);
    }
    
    // Log for debugging
    console.log("Profile image path:", session?.user?.image);
  }, [session]);

  // Function to get proper image path or fallback to default
  const getUserImagePath = () => {
    if (!user?.image) return DEFAULT_AVATAR;
    
    // Check if URL has duplicate domain prefix
    if (user.image.includes('https://fairlancer.org/https://fairlancer.org/')) {
      return user.image.replace('https://fairlancer.org/https://fairlancer.org/', 'https://fairlancer.org/');
    }
    
    // Check for other common path issues
    if (user.image.includes('/images//images/')) {
      return user.image.replace('/images//images/', '/images/');
    }
    
    // Return the original path if no issues found
    return user.image;
  };

  // Render a simple loading state if logging out
  if (isLoggingOut) {
    return (
      <div className="logout-screen d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Logging out...</span>
          </div>
          <h5>Signing out...</h5>
          <p>You will be redirected shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="header-nav nav-innerpage-style menu-home4 dashboard_header main-menu">
        <nav className="posr">
          <div className="container-fluid pr30 pr15-xs pl30 posr menu_bdrt1">
            <div className="row align-items-center justify-content-between">
              <div className="col-6 col-lg-auto">
                <div className="text-center text-lg-start d-flex align-items-center">
                  <div className="dashboard_header_logo position-relative me-2 me-xl-5">
                    <Link href="/" className="logo">
                      <Image
                        height={40}
                        width={133}
                        src="/images/header-logo-dark.svg"
                        alt="logo"
                      />
                    </Link>
                  </div>
                  <div className="fz20 ml90">
                    <a
                      onClick={toggle}
                      className="dashboard_sidebar_toggle_icon vam"
                    >
                      <Image
                        height={18}
                        width={20}
                        src="/images/dashboard-navicon.svg"
                        alt="navicon"
                      />
                    </a>
                  </div>
                  <a
                    className="login-info d-block d-xl-none ml40 vam"
                    data-bs-toggle="modal"
                    href="#exampleModalToggle"
                  >
                    {/* <span className="flaticon-loupe" /> */}
                  </a>
                  <div className="ml40 d-none d-xl-block">
                    <div className="search_area dashboard-style">
                      {/* <input
                        type="text"
                        className="form-control border-0"
                        placeholder="What service are you looking for today?"
                      /> */}
                      {/* <label>
                        <span className="flaticon-loupe" />
                      </label> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-auto">
                <div className="text-center text-lg-end header_right_widgets">
                  <ul className="dashboard_dd_menu_list d-flex align-items-center justify-content-center justify-content-sm-end mb-0 p-0">
                    {/* Quick Action Button - NEW */}
                    {isCompanyOrAgency() && (
                      <li className="d-none d-sm-block me-3">
                        <div className="dropdown">
                          <button
                            className="ud-btn btn-thm dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="flaticon-add me-1"></i> Quick Actions
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <Link className="dropdown-item" href="/projects/create">
                                <i className="flaticon-document me-2"></i> New Project
                              </Link>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#" onClick={handleTeamsNavigation}>
                                <i className="flaticon-group me-2"></i> Manage Teams
                              </a>
                            </li>
                            <li>
                              <Link className="dropdown-item" href="/tasks/create">
                                <i className="flaticon-checklist me-2"></i> New Task
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </li>
                    )}
                    
                    {/* Deactivate Account Button */}
                    <li className="d-none d-sm-block me-3">
                      <button
                        onClick={handleDeactivateAccount}
                        className="ud-btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px" }}
                        title="Deactivate Account"
                        disabled={deactivating}
                      >
                        {deactivating ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <i className="flaticon-delete fz16"></i>
                        )}
                      </button>
                    </li>
                    
                    <li className="d-none d-sm-block">
                      <a
                        className="text-center mr5 text-thm2 dropdown-toggle fz20"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        <span className="flaticon-notification" />
                      </a>
                      <div className="dropdown-menu">
                        <div className="dboard_notific_dd px30 pt10 pb15">
                          <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
                            <Image
                              height={40}
                              width={40}
                              src="/images/resource/notif-1.png"
                              alt="notif"
                            />
                            <div className="details ml10">
                              <p className="text mb-0">Your resume</p>
                              <p className="text mb-0">updated!</p>
                            </div>
                          </div>
                          <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
                            <Image
                              height={40}
                              width={40}
                              src="/images/resource/notif-2.png"
                              alt="notif"
                            />
                            <div className="details ml10">
                              <p className="text mb-0">You changed</p>
                              <p className="text mb-0">password</p>
                            </div>
                          </div>
                          <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
                            <Image
                              height={40}
                              width={40}
                              src="/images/resource/notif-3.png"
                              alt="notif"
                            />
                            <div className="details ml10">
                              <p className="text mb-0">Your account has been</p>
                              <p className="text mb-0">created successfully</p>
                            </div>
                          </div>
                          <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
                            <Image
                              height={40}
                              width={40}
                              src="/images/resource/notif-4.png"
                              alt="notif"
                            />
                            <div className="details ml10">
                              <p className="text mb-0">
                                You applied for a job{" "}
                              </p>
                              <p className="text mb-0">Front-end Developer</p>
                            </div>
                          </div>
                          <div className="notif_list d-flex align-items-center">
                            <Image
                              height={40}
                              width={40}
                              src="/images/resource/notif-5.png"
                              alt="notif"
                            />
                            <div className="details ml10">
                              <p className="text mb-0">Your course uploaded</p>
                              <p className="text mb-0">successfully</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="d-none d-sm-block">
                      <a
                        className="text-center mr5 text-thm2 dropdown-toggle fz20"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        <span className="flaticon-mail" />
                      </a>
                      <div className="dropdown-menu">
                        <div className="dboard_notific_dd px30 pt20 pb15">
                          <div className="notif_list d-flex align-items-start bdrb1 pb25 mb10">
                            <Image
                              height={50}
                              width={50}
                              className="img-2"
                              src="/images/testimonials/testi-1.png"
                              alt="testimonials"
                            />
                            <div className="details ml15">
                              <p className="dark-color fw500 mb-2">Ali Tufan</p>
                              <p className="text mb-2">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing.
                              </p>
                              <p className="mb-0 text-thm">4 hours ago</p>
                            </div>
                          </div>
                          <div className="notif_list d-flex align-items-start mb25">
                            <Image
                              height={50}
                              width={50}
                              className="img-2"
                              src="/images/testimonials/testi-2.png"
                              alt="testimonials"
                            />
                            <div className="details ml15">
                              <p className="dark-color fw500 mb-2">Ali Tufan</p>
                              <p className="text mb-2">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing.
                              </p>
                              <p className="mb-0 text-thm">4 hours ago</p>
                            </div>
                          </div>
                          <div className="d-grid">
                            <Link
                              href="/message"
                              className="ud-btn btn-thm w-100"
                            >
                              View All Messages
                              <i className="fal fa-arrow-right-long" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="d-none d-sm-block">
                      <a
                        className="text-center mr5 text-thm2 dropdown-toggle fz20"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        <span className="flaticon-like" />
                      </a>
                      <div className="dropdown-menu">
                        <div className="dboard_notific_dd px30 pt10 pb15">
                          <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
                            <Image
                              height={40}
                              width={40}
                              src="/images/resource/notif-1.png"
                              alt="notif"
                            />
                            <div className="details ml10">
                              <p className="text mb-0">Your resume</p>
                              <p className="text mb-0">updated!</p>
                            </div>
                          </div>
                          <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
                            <Image
                              height={40}
                              width={40}
                              src="/images/resource/notif-2.png"
                              alt="notif"
                            />
                            <div className="details ml10">
                              <p className="text mb-0">You changed</p>
                              <p className="text mb-0">password</p>
                            </div>
                          </div>
                          <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
                            <Image
                              height={40}
                              width={40}
                              src="/images/resource/notif-3.png"
                              alt="notif"
                            />
                            <div className="details ml10">
                              <p className="text mb-0">Your account has been</p>
                              <p className="text mb-0">created successfully</p>
                            </div>
                          </div>
                          <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
                            <Image
                              height={40}
                              width={40}
                              src="/images/resource/notif-4.png"
                              alt="notif"
                            />
                            <div className="details ml10">
                              <p className="text mb-0">
                                You applied for a job{" "}
                              </p>
                              <p className="text mb-0">Front-end Developer</p>
                            </div>
                          </div>
                          <div className="notif_list d-flex align-items-center">
                            <Image
                              height={40}
                              width={40}
                              src="/images/resource/notif-5.png"
                              alt="notif"
                            />
                            <div className="details ml10">
                              <p className="text mb-0">Your course uploaded</p>
                              <p className="text mb-0">successfully</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="user_setting">
                      <div className="dropdown">
                        <a className="btn" data-bs-toggle="dropdown">
                          <Image
                            height={50}
                            width={50}
                            src={getUserImagePath()}
                            alt="user"
                          />
                        </a>
                        <div className="dropdown-menu dropdown-menu-end" style={{ transform: "translate(0px, 54px) !important" }}>
                          <div className="user_setting_content">
                            <p className="fz15 fw400 ff-heading mb10 pl30">
                              Account
                            </p>
                            {/* Render original menu items */}
                            {menus?.account?.map((item,i) => (
                              <Link
                                key={i}
                                className={`dropdown-item ${
                                  path === item.path ? "active" : ""
                                }`}
                                href={item.path}
                              >
                                <i className={`${item.icon} mr10`} />
                                {item.name}
                              </Link>
                            ))}
                            
                            {/* Add Company/Agency Settings only if user is company/agency */}
                            {isCompanyOrAgency() && (
                              <Link
                                className={`dropdown-item ${
                                  path === `/${session?.user?.role}/settings` ? "active" : ""
                                }`}
                                href={`/${session?.user?.role}/settings?tab=teams`}
                              >
                                <i className="flaticon-setting mr10" />
                                {getSettingsName()}
                              </Link>
                            )}
                            
                            {/* Add My Info Item */}
                            <Link
                              className={`dropdown-item ${
                                path === "/my-info" ? "active" : ""
                              }`}
                              href="/teams"
                            >
                              <i className="flaticon-user mr10" />
                              My Info
                            </Link>
                            
                            {/* Re-enabled Logout Item with proper handler */}
                            {/* <a
                              className="dropdown-item"
                              href="#"
                              onClick={handleLogout}
                            >
                              <i className="flaticon-logout mr10" />
                              Logout
                            </a> */}
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}