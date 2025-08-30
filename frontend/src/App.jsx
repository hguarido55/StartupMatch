import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout from './components/Layout.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPasswordPage from './pages/ResetPassword.jsx';
import LandingPage from './pages/LandingPage.jsx';

const App = () => {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen" data-theme="dracula">
      <Routes>
        {/* Landing pública */}
        <Route path="/" element={<LandingPage />} />

        {/* Home privado */}
        <Route path="/home" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <HomePage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )} />

        <Route
          path="/signup"
          element={
            !isAuthenticated
              ? <SignUpPage />
              : <Navigate to={isOnboarded ? "/home" : "/onboarding"} />
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated
              ? <LoginPage />
              : <Navigate to={isOnboarded ? "/home" : "/onboarding"} />
          }
        />

        <Route
          path="/notifications"
          element={isAuthenticated && isOnboarded ? (
            <Layout showSidebar={true}>
              <NotificationsPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )}
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated
              ? (!isOnboarded ? <OnboardingPage /> : <Navigate to="/home" />)
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/forgot-password"
          element={
            !isAuthenticated
              ? <ForgotPassword />
              : <Navigate to={isOnboarded ? "/home" : "/onboarding"} />
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            !isAuthenticated
              ? <ResetPasswordPage />
              : <Navigate to={isOnboarded ? "/home" : "/onboarding"} />
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;