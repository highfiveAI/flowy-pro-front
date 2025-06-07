import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import DashBoard from "./pages/dash_board/DashBoard";
import Layout from "./components/Layout";
import InsertConferenceInfo from "./pages/inerst_conference_info/InsertConferenceInfo";
import Result from "./pages/result/Result";
import SignUp from "./pages/sign_up/SignUp";
import SignIn from "./sign_in/SignIn";
import { useEffect } from "react";
import SocialSignUp from "./pages/social_sign_up/SocialSignUp";
import DocsAgentTest from "./pages/docs_agent_test/docs_agent_test";
import AdminUser from "./pages/admin/AdminUser";
import AdminCom from "./pages/admin/AdminCom";
import AdminPosition from "./pages/admin/AdminPosition";

function App() {
  async function checkAuth() {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/auth/check`,
      {
        method: "GET",
        credentials: "include", // 쿠키 포함 필수
      }
    );

    if (res.ok) {
      const data = await res.json();
      console.log("현재 접속중:", data);
      return data.authenticated;
    } else {
      console.log("로그인 필요");
      return false;
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/insert_info" element={<InsertConferenceInfo />} />
        <Route path="/result" element={<Result />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/sign_in" element={<SignIn />} />
        <Route path="/social_sign_up" element={<SocialSignUp />} />
        <Route path="/docs_agent_test" element={<DocsAgentTest />} />
        <Route path="/admin/user" element={<AdminUser />} />
        <Route path="/admin/company" element={<AdminCom />} />
        <Route path="/admin/position" element={<AdminPosition />} />
      </Route>
    </Routes>
  );
}

export default App;
