import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdPerson,
  MdCheckCircle,
  MdCancel,
  MdShoppingBag,
  MdLocalShipping,
  MdSecurity,
  MdPercent,
} from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, authLoading, authError, isAuthenticated, clearAuthError } =
    useEcommerceStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear auth errors on mount
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  // Check password strength
  useEffect(() => {
    const password = formData.password;
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!Object.values(passwordStrength).every(Boolean)) {
      newErrors.password = "Password doesn't meet strength requirements";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
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
      const userData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
      };

      await register(userData);
      setSignupSuccess(true);

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Account created successfully! Please sign in." },
        });
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const getPasswordStrengthScore = () => {
    return Object.values(passwordStrength).filter(Boolean).length;
  };

  const getPasswordStrengthColor = () => {
    const score = getPasswordStrengthScore();
    if (score < 2) return "bg-red-500";
    if (score < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const benefits = [
    {
      icon: MdPercent,
      title: "20% Off First Order",
      description: "Get instant savings on your first purchase",
    },
    {
      icon: MdLocalShipping,
      title: "Free Shipping",
      description: "Free delivery on orders over $50",
    },
    {
      icon: MdShoppingBag,
      title: "Early Access",
      description: "Be first to shop new collections",
    },
    {
      icon: MdSecurity,
      title: "Secure Account",
      description: "Protected shopping with secure payments",
    },
  ];

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdCheckCircle className="text-3xl text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Account Created!
            </h2>
            <p className="text-gray-600 mb-6">
              Welcome to Firefly! Your account has been created successfully.
            </p>
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">Redirecting to sign in...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-red-600 p-12 text-white">
        <div className="max-w-md mx-auto flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Join Firefly Today!</h1>
            <p className="text-orange-100 text-lg">
              Create your account and unlock exclusive member benefits,
              personalized recommendations, and seamless shopping.
            </p>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <benefit.icon className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-orange-100 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-xl border border-white/20">
            <p className="text-sm text-orange-100 mb-2">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="text-white font-semibold hover:underline"
            >
              Sign in to your account →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Firefly
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join thousands of happy customers shopping with us.
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{authError}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdPerson className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 focus:border-orange-500"
                  }`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

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
                  placeholder="Create a password"
                  autoComplete="new-password"
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{
                          width: `${(getPasswordStrengthScore() / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {getPasswordStrengthScore()}/5
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div
                      className={`flex items-center gap-1 ${
                        passwordStrength.length
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {passwordStrength.length ? (
                        <MdCheckCircle />
                      ) : (
                        <MdCancel />
                      )}
                      8+ characters
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        passwordStrength.uppercase
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {passwordStrength.uppercase ? (
                        <MdCheckCircle />
                      ) : (
                        <MdCancel />
                      )}
                      Uppercase
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        passwordStrength.lowercase
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {passwordStrength.lowercase ? (
                        <MdCheckCircle />
                      ) : (
                        <MdCancel />
                      )}
                      Lowercase
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        passwordStrength.number
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {passwordStrength.number ? (
                        <MdCheckCircle />
                      ) : (
                        <MdCancel />
                      )}
                      Number
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        passwordStrength.special
                          ? "text-green-600"
                          : "text-gray-400"
                      } col-span-2`}
                    >
                      {passwordStrength.special ? (
                        <MdCheckCircle />
                      ) : (
                        <MdCancel />
                      )}
                      Special character
                    </div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : formData.confirmPassword &&
                        formData.password === formData.confirmPassword
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 focus:border-orange-500"
                  }`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <MdVisibilityOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <MdVisibility className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div>
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className={`h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1 ${
                    errors.terms ? "border-red-300" : ""
                  }`}
                />
                <div className="ml-3">
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-orange-600 hover:text-orange-500 font-medium"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-orange-600 hover:text-orange-500 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                  )}
                </div>
              </div>
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
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
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-orange-600 hover:text-orange-500 font-semibold text-sm"
            >
              Sign in to your account
            </Link>
          </div>

          {/* Mobile Benefits Preview */}
          <div className="xl:hidden mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4">
              Member Benefits
            </h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <benefit.icon className="text-orange-500 text-xl" />
                  <span className="text-sm text-gray-600">{benefit.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
