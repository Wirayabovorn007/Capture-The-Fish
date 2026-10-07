import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

type UserRouteProps = {
  children: ReactNode;
};

export default function UserRoute({ children }: UserRouteProps) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      const loggedIn = await isAuthenticated();

      if (active) {
        setAuthenticated(loggedIn);
        setChecking(false);
      }
    };

    void checkAuth();

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
