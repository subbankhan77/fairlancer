"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import SidebarMenuSkeleton from '@/components/custom/loader/SidebarMenuSkeleton';

// menu
import {menuConfig} from "@/config/menuConfig";

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [menus, setMenus] = useState(null);
  const path = usePathname();
  const role = session?.user?.role;

  useEffect(() => {
    try {
      if (role && menuConfig[role]) {
        setMenus(menuConfig[role]);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setIsLoading(false);
    }
  }, [role, menuConfig]);

  return (
    <>
      <div className="dashboard__sidebar d-none d-lg-block">
        <div className="dashboard_sidebar_list">
          {isLoading ? (
            <SidebarMenuSkeleton />
          ) : (
            <>
              <p className="fz15 fw400 ff-heading pl30">Manage</p>
              {menus?.manage?.map((item,i) => (
                <div key={i} className="sidebar_list_item mb-1">
                  <Link
                    href={item.path}
                    className={`items-center ${
                      path === item.path ? "-is-active" : ""
                    }`}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.name}
                  </Link>
                </div>
              ))}

              <p className="fz15 fw400 ff-heading pl30 mt30">Account</p>
              {menus?.account?.map((item,i) => (
                <div key={i} className="sidebar_list_item mb-1">
                  <Link
                    href={item.path}
                    className={`items-center ${
                      path === item.path ? "-is-active" : ""
                    }`}
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
