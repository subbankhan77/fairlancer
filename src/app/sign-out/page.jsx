"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { authService } from "@/services/auth";
import toast from 'react-hot-toast';

const PageSignOut = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // console.log(session);
    async function init() {
      if(session?.accessToken) {  
        await authService.logout()
        .then((res) => {
          // console.log(res);
          signOut({
            redirect: false,
          });
          router.push("/login");
          // toast.success("Logout successful");
        })
        .catch((error) => {
          signOut({
            redirect: false,
          });
          console.error("Logout failed:", error);
        });
      }else{
        signOut({
          redirect: false,
        });
        router.push("/login");
        // toast.success("Logout successful");
      }
    }
    init();
  }, [session]);
};

export default PageSignOut;
