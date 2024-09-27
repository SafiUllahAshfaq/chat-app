import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const HostRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "host") {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.type !== "host") {
    return null; // Optionally render a loading spinner or message
  }

  return <>{children}</>;
};

export default HostRoute;
