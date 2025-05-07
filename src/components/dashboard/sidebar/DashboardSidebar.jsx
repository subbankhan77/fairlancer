// // "use client";
// // import { useState, useEffect } from "react";
// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import { useSession } from "next-auth/react";

// // import SidebarMenuSkeleton from '@/components/custom/loader/SidebarMenuSkeleton';

// // // Force a fresh import of the menu config
// // import { menuConfig } from "@/config/menuConfig";

// // export default function DashboardSidebar() {
// //   const { data: session } = useSession();
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [menus, setMenus] = useState(null);
// //   const path = usePathname();
// //   const role = session?.user?.role;
// //   console.log("rolerolerole", role);

// //   // Force component to re-render when session or route changes
// //   useEffect(() => {
// //     try {
// //       if (role && menuConfig[role]) {
// //         // Get a copy of the menu configuration for the current role
// //         const menuCopy = JSON.parse(JSON.stringify(menuConfig[role]));
        
// //         // If the role is "client", add the "Create New Project" menu item
// //         if (role === "client") {
// //           // Add "Create New Project" to the manage array
// //           menuCopy.manage.push({
// //             id: 4,
// //             name: "Create New Project",
// //             icon: "flaticon-add",
// //             path: "/create-project",
// //           });
// //         }
        
// //         setMenus(menuCopy);
// //         console.log("Menu loaded for role:", role, menuCopy);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching menu:', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }, [role, path]);

// //   return (
// //     <>
// //       <div key={`${role}-${path}`} className="dashboard__sidebar d-none d-lg-block">
// //         <div className="dashboard_sidebar_list">
// //           {isLoading ? (
// //             <SidebarMenuSkeleton />
// //           ) : (
// //             <>
// //               <p className="fz15 fw400 ff-heading pl30">Manage</p>
// //               {menus?.manage?.map((item, i) => (
// //                 <div key={`${item.id}-${i}`} className="sidebar_list_item mb-1">
// //                   <Link
// //                     href={item.path}
// //                     className={`items-center ${
// //                       path === item.path ? "-is-active" : ""
// //                     }`}
// //                   >
// //                     <i className={`${item.icon} mr15`} />
// //                     {item.name}
// //                   </Link>
// //                 </div>
// //               ))}

// //               <p className="fz15 fw400 ff-heading pl30 mt30">Account</p>
// //               {menus?.account?.map((item, i) => (
// //                 <div key={`${item.id}-${i}`} className="sidebar_list_item mb-1">
// //                   <Link
// //                     href={item.path}
// //                     className={`items-center ${
// //                       path === item.path ? "-is-active" : ""
// //                     }`}
// //                   >
// //                     <i className={`${item.icon} mr15`} />
// //                     {item.name}
// //                   </Link>
// //                 </div>
// //               ))}
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // In your DashboardSidebar.js file
// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useSession } from "next-auth/react";

// import SidebarMenuSkeleton from '@/components/custom/loader/SidebarMenuSkeleton';

// // Force a fresh import of the menu config
// import { menuConfig } from "@/config/menuConfig";

// export default function DashboardSidebar({ onCreateProject }) {
//   const { data: session } = useSession();
//   const [isLoading, setIsLoading] = useState(true);
//   const [menus, setMenus] = useState(null);
//   const path = usePathname();
//   const role = session?.user?.role;

//   // Handle menu item click
//   const handleMenuItemClick = (e, item) => {
//     // Check if it's the Create New Project item
//     if (item.name === "Create New Project" || item.path === "/create-project") {
//       e.preventDefault();
//       if (onCreateProject) {
//         onCreateProject();
//       }
//     }
//   };

//   useEffect(() => {
//     try {
//       if (role && menuConfig[role]) {
//         // Get a copy of the menu configuration for the current role
//         const menuCopy = JSON.parse(JSON.stringify(menuConfig[role]));
        
//         // If the role is "client", add the "Create New Project" menu item if it doesn't exist
//         if (role === "client") {
//           const createProjectExists = menuCopy.manage.some(item => 
//             item.name === "Create New Project" || item.path === "/create-project"
//           );
          
//           if (!createProjectExists) {
//             menuCopy.manage.push({
//               id: 4,
//               name: "Create New Project",
//               icon: "flaticon-add",
//               path: "/create-project",
//             });
//           }
//         }
        
//         setMenus(menuCopy);
//       }
//     } catch (error) {
//       console.error('Error fetching menu:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [role]);

//   return (
//     <>
//       <div className="dashboard__sidebar d-none d-lg-block">
//         <div className="dashboard_sidebar_list">
//           {isLoading ? (
//             <SidebarMenuSkeleton />
//           ) : (
//             <>
//               <p className="fz15 fw400 ff-heading pl30">Manage</p>
//               {menus?.manage?.map((item, i) => (
//                 <div key={`${item.id}-${i}`} className="sidebar_list_item mb-1">
//                   <Link
//                     href={item.path}
//                     className={`items-center ${
//                       path === item.path ? "-is-active" : ""
//                     }`}
//                     onClick={(e) => handleMenuItemClick(e, item)}
//                   >
//                     <i className={`${item.icon} mr15`} />
//                     {item.name}
//                   </Link>
//                 </div>
//               ))}

//               <p className="fz15 fw400 ff-heading pl30 mt30">Account</p>
//               {menus?.account?.map((item, i) => (
//                 <div key={`${item.id}-${i}`} className="sidebar_list_item mb-1">
//                   <Link
//                     href={item.path}
//                     className={`items-center ${
//                       path === item.path ? "-is-active" : ""
//                     }`}
//                   >
//                     <i className={`${item.icon} mr15`} />
//                     {item.name}
//                   </Link>
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import SidebarMenuSkeleton from '@/components/custom/loader/SidebarMenuSkeleton';

// Force a fresh import of the menu config
import { menuConfig } from "@/config/menuConfig";

export default function DashboardSidebar({ onCreateProject }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [menus, setMenus] = useState(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const role = session?.user?.role;

  // Handle menu item click
  const handleMenuItemClick = (e, item) => {
    // Check if it's the Create New Project item
    if (item.name === "Create New Project" || item.path === "/create-project") {
      e.preventDefault();
      if (onCreateProject) {
        onCreateProject();
      }
    }
    
    // Handle logout
    if (item.name === "Logout" || item.path === "/logout" || item.path === "/sign-out") {
      e.preventDefault();
      handleLogout();
    }
  };

  // Handle logout function
  const handleLogout = async () => {
    setIsSigningOut(true);
    
    try {
      // Redirect to login page after signOut completes
      await signOut({ redirect: false });
      
      // Short timeout to ensure state updates before redirect
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 300);
    } catch (error) {
      console.error("Logout error:", error);
      setIsSigningOut(false);
    }
  };

  useEffect(() => {
    try {
      if (role && menuConfig[role]) {
        // Get a copy of the menu configuration for the current role
        const menuCopy = JSON.parse(JSON.stringify(menuConfig[role]));
        
        // If the role is "client", add the "Create New Project" menu item if it doesn't exist
        if (role === "client") {
          const createProjectExists = menuCopy.manage.some(item => 
            item.name === "Create New Project" || item.path === "/create-project"
          );
          
          if (!createProjectExists) {
            menuCopy.manage.push({
              id: 4,
              name: "Create New Project",
              icon: "flaticon-add",
              path: "/create-project",
            });
          }
        }
        
        setMenus(menuCopy);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  // Show loader when signing out
  if (isSigningOut) {
    return (
      <div className="dashboard__sidebar d-none d-lg-block">
        <div className="dashboard_sidebar_list">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100%', minHeight: '300px' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Logging out...</span>
              </div>
              <p>Signing out...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard__sidebar d-none d-lg-block">
        <div className="dashboard_sidebar_list">
          {isLoading ? (
            <SidebarMenuSkeleton />
          ) : (
            <>
              <p className="fz15 fw400 ff-heading pl30">Manage</p>
              {menus?.manage?.map((item, i) => (
                <div key={`${item.id}-${i}`} className="sidebar_list_item mb-1">
                  <Link
                    href={item.path}
                    className={`items-center ${
                      path === item.path ? "-is-active" : ""
                    }`}
                    onClick={(e) => handleMenuItemClick(e, item)}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.name}
                  </Link>
                </div>
              ))}

              <p className="fz15 fw400 ff-heading pl30 mt30">Account</p>
              {menus?.account?.map((item, i) => (
                <div key={`${item.id}-${i}`} className="sidebar_list_item mb-1">
                  <Link
                    href={item.path}
                    className={`items-center ${
                      path === item.path ? "-is-active" : ""
                    }`}
                    onClick={(e) => handleMenuItemClick(e, item)}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.name}
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}