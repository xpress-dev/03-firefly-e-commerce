import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useEcommerceStore from "../store/FireflyStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  const { verifyEmail, authLoading, resendVerificationEmail, user } =
    useEcommerceStore();

  useEffect(() => {
    const token = searchParams.get("token");

    const handleVerification = async (token) => {
      try {
        const response = await verifyEmail(token);
        if (response.success) {
          setVerificationStatus("success");
          setMessage(response.message);
        }
      } catch (error) {
        setVerificationStatus("error");
        setMessage(error.message || "Email verification failed.");
      }
    };

    if (token) {
      handleVerification(token);
    } else {
      setVerificationStatus("error");
      setMessage("No verification token provided.");
    }
  }, [searchParams, verifyEmail]);

  const handleResendVerification = async () => {
    try {
      const response = await resendVerificationEmail();
      if (response.success) {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage(error.message || "Failed to resend verification email.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            {verificationStatus === "verifying" && (
              <div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                  Verifying your email...
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please wait while we verify your email address.
                </p>
              </div>
            )}

            {verificationStatus === "success" && (
              <div>
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
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                  Email Verified Successfully!
                </h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <div className="mt-6">
                  <Link
                    to="/"
                    className="group relative flex w-full justify-center rounded-md bg-gray-900 py-2 px-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}

            {verificationStatus === "error" && (
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                  Verification Failed
                </h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>

                {user && (
                  <div className="mt-6 space-y-4">
                    <button
                      onClick={handleResendVerification}
                      disabled={authLoading}
                      className="group relative flex w-full justify-center rounded-md bg-gray-900 py-2 px-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-50"
                    >
                      {authLoading ? "Sending..." : "Resend Verification Email"}
                    </button>

                    <Link
                      to="/dashboard"
                      className="group relative flex w-full justify-center rounded-md border border-gray-300 py-2 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                )}

                {!user && (
                  <div className="mt-6">
                    <Link
                      to="/login"
                      className="group relative flex w-full justify-center rounded-md bg-gray-900 py-2 px-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                    >
                      Go to Login
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmailVerificationPage;
