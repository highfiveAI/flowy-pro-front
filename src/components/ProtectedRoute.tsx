import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // 현재 페이지 정보

  if (loading) return <div>로딩 중...</div>;

  if (!user) {
    // 로그인 페이지로 이동하면서, 현재 경로를 state로 전달
    return <Navigate to="/sign_in" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
