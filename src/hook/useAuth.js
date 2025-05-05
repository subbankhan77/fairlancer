'use client';
import { useSession, signIn, signOut } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  const login = async (email, password) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      return !result?.error;
    } catch (error) {
      return false;
    }
  };

  const logout = () => signOut();

  return {
    user: session?.user,
    isLoading: status === 'loading',
    login,
    logout,
  };
};