import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdPerson,
  MdShoppingBag,
  MdSecurity,
  MdTrendingUp,
} from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading, authError, isAuthenticated, clearAuthError } =
    useEcommerceStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear auth errors on mount
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await login(formData);

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      // Navigate based on user role and intended destination
      const from = location.state?.from?.pathname;
      let redirectTo = "/dashboard"; // default for regular users

      // Check if user is admin and redirect accordingly
      if (response?.data?.role === "admin") {
        redirectTo = "/admin";
      }

      // If there was an intended destination, use that instead (unless it's login/signup)
      if (from && from !== "/login" && from !== "/signup") {
        redirectTo = from;
      }

      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const features = [
    {
      icon: MdShoppingBag,
      title: "Order Tracking",
      description: "Track your orders and delivery status in real-time",
    },
    {
      icon: MdPerson,
      title: "Personal Profile",
      description: "Manage your profile and shipping addresses",
    },
    {
      icon: MdSecurity,
      title: "Secure Shopping",
      description: "Shop with confidence with our secure payment system",
    },
    {
      icon: MdTrendingUp,
      title: "Exclusive Deals",
      description: "Get access to member-only discounts and offers",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-red-600 p-12 text-white">
        <div className="max-w-md mx-auto flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-orange-100 text-lg">
              Sign in to access your personalized shopping experience and
              exclusive member benefits.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <feature.icon className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-orange-100 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-xl border border-white/20">
            <p className="text-sm text-orange-100 mb-2">New to Firefly?</p>
            <Link
              to="/signup"
              className="text-white font-semibold hover:underline"
            >
              Create an account and get 20% off your first order →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Firefly
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{authError}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 focus:border-orange-500"
                  }`}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 focus:border-orange-500"
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <MdVisibilityOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <MdVisibility className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-500 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 focus:ring-4 focus:ring-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {authLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/signup"
              className="text-orange-600 hover:text-orange-500 font-semibold text-sm"
            >
              Create a new account
            </Link>
          </div>

          {/* Mobile Features Preview */}
          <div className="xl:hidden mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4">
              Why join Firefly?
            </h3>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <feature.icon className="text-orange-500 text-xl" />
                  <span className="text-sm text-gray-600">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
