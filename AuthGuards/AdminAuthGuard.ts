import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "admin") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.type !== "admin") {
    return null; // Optionally render a loading spinner or message
  }

  return children;
};

export default AdminRoute;
