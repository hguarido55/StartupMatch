import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow">
        <h1 className="text-2xl font-bold text-primary">StartupMatch</h1>
        <div className="space-x-4">
          <Link to="/login" className="btn btn-outline btn-sm">
            Login
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-grow flex flex-col lg:flex-row h-full">
        {/* Left column: text */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Connect. Collaborate. Build.
            </h2>
            <p className="max-w-md mb-6 opacity-80 mx-auto">
              StartupMatch helps founders and developers meet, collaborate, and
              launch startups together.
            </p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started
            </Link>
          </div>
        </div>

        {/* Right column: image */}
        <div className="flex-1 flex items-center justify-center p-8">
          <img
            src="/landingPage.png"
            alt="Landing illustration"
            className="max-w-md w-full h-auto"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs opacity-60">
        © {new Date().getFullYear()} StartupMatch. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;