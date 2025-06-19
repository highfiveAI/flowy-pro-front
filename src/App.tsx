import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Layout from './components/Layout';
import InsertConferenceInfo from './pages/insert_conference_info/InsertConferenceInfo';
import Result from './pages/result/Result';
import SignUp from './pages/sign_up/SignUp';
import SocialSignUp from './pages/social_sign_up/SocialSignUp';
import DocsAgentTest from './pages/docs_agent_test/docs_agent_test';
import AdminUser from './pages/admin/AdminUser';
import AdminCompany from './pages/admin/superadmin/AdminCompany';
import AdminPosition from './pages/admin/AdminPosition';
import AdminTemplate from './pages/admin/AdminTemplate';
import Login from './pages/log_in/Login';
import ChooseMethod from './pages/sign_up_choose/choose_method';
import MyPage from './pages/mypage/MyPage';
import AlterInfo from './pages/mypage/alterInfo';
import Calendar from './pages/calendar/Calendar';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectListPage from './pages/dashboard/projectlist';
import ConferenceListPage from './pages/dashboard/conferencelist';
import AdminAdmin from './pages/admin/superadmin/AdminAdmin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          {/* 공개 라우트 */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign_up" element={<ChooseMethod />} />
          <Route path="/sign_up/form" element={<SignUp />} />
          <Route path="/social_sign_up" element={<SocialSignUp />} />
          <Route path="/result" element={<Result />} />

          <Route
            path="/dashboard/:meetingId"
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
          <Route
            path="/docs_agent_test"
            element={
              <ProtectedRoute>
                <DocsAgentTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/user"
            element={
              <ProtectedRoute>
                <AdminUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/company"
            element={
              <ProtectedRoute>
                <AdminCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/position"
            element={
              <ProtectedRoute>
                <AdminPosition />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/template"
            element={
              <ProtectedRoute>
                <AdminTemplate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admin"
            element={
              <ProtectedRoute>
                <AdminAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mypage/alterInfo"
            element={
              <ProtectedRoute>
                <AlterInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projectlist"
            element={
              <ProtectedRoute>
                <ProjectListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/conferencelist/:projectId"
            element={
              <ProtectedRoute>
                <ConferenceListPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
