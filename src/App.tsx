import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Layout from './components/Layout';
import InsertConferenceInfo from './pages/insert_conference_info/InsertConferenceInfo';
import Result from './pages/result/Result';
import SignUp from './pages/sign_up/SignUp';
import SignIn from './sign_in/SignIn';
import SocialSignUp from './pages/social_sign_up/SocialSignUp';
import DocsAgentTest from './pages/docs_agent_test/docs_agent_test';
import AdminUser from './pages/admin/AdminUser';
import AdminCom from './pages/admin/AdminCom';
import AdminPosition from './pages/admin/AdminPosition';
import AdminTemplate from './pages/admin/AdminTemplate';

import Login from './pages/log_in/Login';
import ChooseMethod from './pages/sign_up/choose_method';
import MyPage from './pages/mypage/MyPage';
import AlterInfo from './pages/mypage/alterInfo';
import Calendar from './pages/calendar/Calendar';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insert_info"
            element={
              <ProtectedRoute>
                <InsertConferenceInfo />
              </ProtectedRoute>
            }
          />
          <Route path="/result" element={<Result />} />
          <Route path="/sign_up" element={<ChooseMethod />} />
          <Route path="/sign_up/form" element={<SignUp />} />
          <Route path="/sign_in" element={<SignIn />} />
          <Route path="/social_sign_up" element={<SocialSignUp />} />
          <Route path="/docs_agent_test" element={<DocsAgentTest />} />
          <Route path="/admin/user" element={<AdminUser />} />
          <Route path="/admin/company" element={<AdminCom />} />
          <Route path="/admin/position" element={<AdminPosition />} />
          <Route path="/admin/template" element={<AdminTemplate />} />
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route path="/mypage/alterInfo" element={<AlterInfo />} />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
