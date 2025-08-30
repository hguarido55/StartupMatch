import React, { useState } from "react";
import { Lock, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { forgotPassword } from "../lib/api.js";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSent, setIsSent] = useState(false); // 👈 nuevo estado

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const res = await forgotPassword({ email });
      toast.success(res.message || "Email sent successfully!");
      setIsSent(true); // 👈 cambiar a pantalla de éxito
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="synthwave"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        
        {/* Left column */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center text-center">
          {!isSent ? (
            <>
              <div className="mb-6 flex items-center justify-center gap-2">
                <Lock className="size-8 text-primary" />
                <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Forgot Password
                </span>
              </div>

              <p className="text-center text-sm opacity-70 mb-6">
                Enter your email below and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <CheckCircle className="size-20 text-success mb-4" />
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-sm opacity-70">
                We’ve sent a reset link to <span className="font-mono">{email}</span>.  
                Follow the instructions there to reset your password.
              </p>
            </>
          )}
        </div>

        {/* Right column: image (se mantiene siempre) */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/forgotPassword.png"
                alt="Forgot password illustration"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;