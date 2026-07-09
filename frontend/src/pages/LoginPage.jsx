import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth as useLoginHook } from "../hooks/useAuth";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import logo from "../assets/icons/gradnet-logo.png";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const [googleError, setGoogleError] = useState("");

  const {
    usn,
    setUsn,
    error: usnError,
    isLoading,
    handleLoginSubmit,
  } = useLoginHook();

  const { isLoggedIn, loading: authLoading } = useAuth();

  /* Handle Google OAuth errors */
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const errorMsg = queryParams.get("error");

    if (errorMsg) {
      setGoogleError(decodeURIComponent(errorMsg));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  /* Redirect if already logged in */
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, authLoading, navigate]);

  if (authLoading || isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-400">Loading...</p>
      </div>
    );
  }

  /* Google OAuth redirect */
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/google`;
  };

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl sm:p-8 border border-border">

        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="GradNet" className="h-14 w-14" />
        </div>

        {/* Title */}
        <h1 className="mt-4 text-center text-2xl font-semibold text-foreground">
          GradNet
        </h1>

        {/* Subtitle */}
        <p className="mt-1 text-center text-sm text-muted">
          Connecting AITM, Across Generations
        </p>

        {/* Errors */}
        {(usnError || googleError) && (
          <p className="mt-4 text-center text-sm text-red-400">
            {usnError || googleError}
          </p>
        )}

        {/* USN Form */}
        <form
          onSubmit={(e) => handleLoginSubmit(e)}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-foreground">
              University Seat Number or ID
            </label>
            <input
              type="text"
              value={usn}
              onChange={(e) => setUsn(e.target.value.toUpperCase())}
              placeholder="Enter your USN or ID"
              required
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-solid w-full text-blue-400"
          >
            {isLoading ? "Sending OTP..." : "Continue"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-700" />
          <span className="text-xs text-neutral-400">OR</span>
          <div className="h-px flex-1 bg-neutral-700" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="btn btn-primary w-full gap-2 text-blue-500"
        >
          <svg className="h-4 w-4" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.4H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1 7.4 2.6l5.7-5.7C33.4 6.3 28.9 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.5 0 19-8.5 19-19 0-1.3-.1-2.3-.4-3.6z"
            />
          </svg>
          Login with Google
        </button>
      </div>
      <div className="absolute bottom-8 w-full text-center">
        <p className="text-sm text-neutral-500 font-medium">
          By CSE Department, AITM
        </p>
        <p className="text-sm text-neutral-500 font-medium">
         <a href="https://portfolio.sneax.quest"> Sudeep </a>| <a href="https://satyamunje.github.io/">Satya</a> | <a href="https://sanjaychavan05.github.io/sanjay-portfolio/">Sanjay</a> | <a href="https://www.linkedin.com/in/sridhar-hulikavi-058a86252/">Sridar</a>
        </p>
        </div>
    </div>
  );
}

export default Login;
