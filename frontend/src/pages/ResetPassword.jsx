import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router";
import { resetPassword } from "../lib/api.js";

const ResetPasswordPage = () => {
  const { token } = useParams(); // token from URL (/reset-password/:token)
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsPending(true);
    try {
      const res = await resetPassword(token, newPassword);
      toast.success(res.message || "Password reset successful!");
      navigate("/login"); // optional: redirect to login after success
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const isDisabled =
    !newPassword || !confirmPassword || newPassword !== confirmPassword || isPending;

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="synthwave"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Left column: form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <KeyRound className="size-8 text-primary" />
            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Reset Password
            </span>
          </div>

          <p className="text-center text-sm opacity-70 mb-6">
            Enter your new password below. Make sure both fields match.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isDisabled}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>

        {/* Right column: image */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/resetPassword.png"
                alt="Reset password illustration"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;