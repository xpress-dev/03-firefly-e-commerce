import { useState } from "react";
import { Link } from "react-router-dom";
import useEcommerceStore from "../store/FireflyStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const { forgotPassword, authLoading, authError } = useEcommerceStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setIsSubmitted(true);
        setMessage(response.message);
      }
    } catch (error) {
      setMessage(error.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Forgot your password?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {!isSubmitted ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
                  placeholder="Email address"
                />
              </div>

              {message && (
                <div
                  className={`rounded-md p-4 ${
                    authError ? "bg-red-50" : "bg-blue-50"
                  }`}
                >
                  <div className="text-sm">
                    <p className={authError ? "text-red-700" : "text-blue-700"}>
                      {message}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="group relative flex w-full justify-center rounded-md bg-gray-900 py-2 px-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-50"
                >
                  {authLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Check your email
              </h3>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
              <p className="mt-4 text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage("");
                  }}
                  className="text-gray-900 hover:underline"
                >
                  try again
                </button>
              </p>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="group relative flex w-full justify-center rounded-md bg-gray-900 py-2 px-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
