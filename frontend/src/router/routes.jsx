import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Layout from '../layout/Layout.jsx';
import Signup from '../pages/Signup.jsx';
import VerifyEmail from '../pages/VerifyEmail.jsx';
import Login from '../pages/Login';
import Home from '../pages/Home.jsx';
import ProtectedRoutes from '../components/ProtectedRoutes.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import SetNewPassword from '../pages/SetNewPassword.jsx';
import DashboardLayout from '../layout/DashboardLayout.jsx';
import About from '../pages/About.jsx';
import Contact from '../pages/Contact.jsx';
import Profile from '../pages/Profile.jsx';
import ShowUsersToAdmin from '../pages/ShowUsersToAdmin.jsx';
import PublicRoutes from '../components/PublicRoutes.jsx';
import GroupPage from '../pages/GroupPage.jsx';
import InviteRedirect from '../pages/InviteRedirect.jsx';
import Groups from '../pages/Groups.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/*  */}
      <Route path="/invite/:token" element={<InviteRedirect />} />
      {/* Public Routes */}
      <Route element={<PublicRoutes />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="set-new-password" element={<SetNewPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile />} />
          <Route path="groups">
            <Route index element={<Groups />} />
            <Route path=":groupId" element={<GroupPage />} />
          </Route>
          <Route path="show-users-to-admin" element={<ShowUsersToAdmin />} />
        </Route>
      </Route>
    </Route>
  )
);

export default router;
