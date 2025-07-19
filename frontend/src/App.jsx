import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CollectionsPage from "./pages/CollectionsPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Footer from "./components/Footer";
import useEcommerceStore from "./store/FireflyStore";
import { useEffect } from "react";

const App = () => {
  const {
    products,
    getAllProducts,
    productsLoading,
    productsError,
    initializeAuth,
  } = useEcommerceStore();

  useEffect(() => {
    // Initialize authentication from localStorage
    initializeAuth();

    // Fetch products when component mounts
    getAllProducts();
  }, [getAllProducts, initializeAuth]);

  useEffect(() => {
    // Log products when they change
    console.log("Products:", products);
    console.log("Loading:", productsLoading);
    console.log("Error:", productsError);
  }, [products, productsLoading, productsError]);

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* Auth Routes - No Navbar/Footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Public Routes - With Navbar/Footer */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <div className="px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw] xl:px-[9vw]">
                <Navbar />
              </div>
              <main className="flex-1">
                <div className="px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw] xl:px-[9vw]">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                    <Route path="/product/:slug" element={<ProductPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                  </Routes>
                </div>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
