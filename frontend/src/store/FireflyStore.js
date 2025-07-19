import { create } from "zustand";
import { persist } from "zustand/middleware";

// Base URL for API calls
const BASE_URL = "http://localhost:5000/api";

// Helper function to make API calls with token
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
};

// Main store
const useEcommerceStore = create(
  persist(
    (set, get) => ({
      // AUTH STATE
      user: null,
      token: null,
      isAuthenticated: false,
      authLoading: false,
      authError: null,

      // PRODUCTS STATE
      products: [],
      currentProduct: null,
      productsLoading: false,
      productsError: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      filters: {
        category: "",
        gender: "",
        minPrice: "",
        maxPrice: "",
        search: "",
        inStock: null,
      },

      // CART STATE
      cartItems: [],
      cartTotal: 0,
      cartItemsCount: 0,
      cartLoading: false,
      cartError: null,
      isCartOpen: false,

      // SEARCH STATE
      searchQuery: "",
      searchResults: [],
      searchLoading: false,
      searchError: null,
      isSearchOpen: false,

      // ORDERS STATE
      orders: [],
      myOrders: [],
      currentOrder: null,
      ordersLoading: false,
      ordersError: null,

      // ADMIN STATE
      adminStats: {
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        recentOrders: [],
        topProducts: [],
        monthlyRevenue: [],
      },
      allUsers: [],
      adminLoading: false,
      adminError: null,

      // AUTH ACTIONS
      register: async (userData) => {
        set({ authLoading: true, authError: null });
        try {
          const response = await apiCall("/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
          });

          if (response.success) {
            set({ authLoading: false });
            return response;
          }
        } catch (error) {
          set({ authError: error.message, authLoading: false });
          throw error;
        }
      },

      login: async (credentials) => {
        set({ authLoading: true, authError: null });
        try {
          const response = await apiCall("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
          });

          if (response.success && response.data.token) {
            const { token, ...user } = response.data;
            localStorage.setItem("token", token);
            set({
              user,
              token,
              isAuthenticated: true,
              authLoading: false,
              authError: null,
            });
            return response;
          }
        } catch (error) {
          set({ authError: error.message, authLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          authError: null,
        });
      },

      clearAuthError: () => {
        set({ authError: null });
      },

      getUserProfile: async () => {
        set({ authLoading: true, authError: null });
        try {
          const response = await apiCall("/auth/profile");
          if (response.success) {
            set({ user: response.data, authLoading: false });
            return response;
          }
        } catch (error) {
          set({ authError: error.message, authLoading: false });
          throw error;
        }
      },

      updateUserProfile: async (userData) => {
        set({ authLoading: true, authError: null });
        try {
          const response = await apiCall("/auth/profile", {
            method: "PUT",
            body: JSON.stringify(userData),
          });

          if (response.success) {
            const { token, ...user } = response.data;
            // Update token if provided (backend returns new token)
            if (token) {
              localStorage.setItem("token", token);
              set({ user, token, authLoading: false });
            } else {
              set({ user, authLoading: false });
            }
            return response;
          }
        } catch (error) {
          set({ authError: error.message, authLoading: false });
          throw error;
        }
      },

      verifyEmail: async (token) => {
        set({ authLoading: true, authError: null });
        try {
          const response = await apiCall("/auth/verify-email", {
            method: "POST",
            body: JSON.stringify({ token }),
          });

          if (response.success) {
            // After successful verification, refresh the user profile
            // to update the isEmailVerified status in the frontend
            try {
              const profileResponse = await apiCall("/auth/profile");
              if (profileResponse.success) {
                set({ user: profileResponse.data, authLoading: false });
              } else {
                set({ authLoading: false });
              }
            } catch (profileError) {
              // Even if profile fetch fails, verification was successful
              console.warn(
                "Failed to refresh profile after verification:",
                profileError
              );
              set({ authLoading: false });
            }
            return response;
          }
        } catch (error) {
          set({ authError: error.message, authLoading: false });
          throw error;
        }
      },

      forgotPassword: async (email) => {
        set({ authLoading: true, authError: null });
        try {
          const response = await apiCall("/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
          });

          if (response.success) {
            set({ authLoading: false });
            return response;
          }
        } catch (error) {
          set({ authError: error.message, authLoading: false });
          throw error;
        }
      },

      resetPassword: async (token, password) => {
        set({ authLoading: true, authError: null });
        try {
          const response = await apiCall("/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({ token, password }),
          });

          if (response.success) {
            set({ authLoading: false });
            return response;
          }
        } catch (error) {
          set({ authError: error.message, authLoading: false });
          throw error;
        }
      },

      resendVerificationEmail: async () => {
        set({ authLoading: true, authError: null });
        try {
          const response = await apiCall("/auth/resend-verification", {
            method: "POST",
          });

          if (response.success) {
            set({ authLoading: false });
            return response;
          }
        } catch (error) {
          set({ authError: error.message, authLoading: false });
          throw error;
        }
      },

      // PRODUCTS ACTIONS
      getAllProducts: async (params = {}) => {
        set({ productsLoading: true, productsError: null });
        try {
          const queryParams = new URLSearchParams();

          // Add pagination params
          queryParams.append("page", params.page || get().pagination.page);
          queryParams.append("limit", params.limit || get().pagination.limit);

          // Add sort param if provided
          if (params.sort) {
            queryParams.append("sort", params.sort);
          }

          // Add filter params
          const filters = { ...get().filters, ...params };
          Object.entries(filters).forEach(([key, value]) => {
            if (
              value !== "" &&
              value !== null &&
              value !== undefined &&
              key !== "sort"
            ) {
              queryParams.append(key, value);
            }
          });

          const response = await apiCall(`/products?${queryParams}`);

          if (response.success) {
            set({
              products: response.data, // products array is directly in response.data
              pagination: {
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                totalPages: response.pagination.pages, // backend uses 'pages', not 'totalPages'
              },
              productsLoading: false,
            });
            return response;
          }
        } catch (error) {
          set({ productsError: error.message, productsLoading: false });
          throw error;
        }
      },

      getProductById: async (productId) => {
        set({ productsLoading: true, productsError: null });
        try {
          const response = await apiCall(`/products/${productId}`);
          if (response.success) {
            set({ currentProduct: response.data, productsLoading: false });
            return response;
          }
        } catch (error) {
          set({ productsError: error.message, productsLoading: false });
          throw error;
        }
      },

      getProductBySlug: async (slug) => {
        set({ productsLoading: true, productsError: null });
        try {
          const response = await apiCall(`/products/slug/${slug}`);
          if (response.success) {
            set({ currentProduct: response.data, productsLoading: false });
            return response;
          }
        } catch (error) {
          set({ productsError: error.message, productsLoading: false });
          throw error;
        }
      },

      createProduct: async (productData) => {
        set({ productsLoading: true, productsError: null });
        try {
          const response = await apiCall("/products", {
            method: "POST",
            body: JSON.stringify(productData),
          });

          if (response.success) {
            // Add new product to the beginning of the products array
            set((state) => ({
              products: [response.data, ...state.products],
              productsLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ productsError: error.message, productsLoading: false });
          throw error;
        }
      },

      updateProduct: async (productId, productData) => {
        set({ productsLoading: true, productsError: null });
        try {
          const response = await apiCall(`/products/${productId}`, {
            method: "PUT",
            body: JSON.stringify(productData),
          });

          if (response.success) {
            // Update product in the products array
            set((state) => ({
              products: state.products.map((product) =>
                product._id === productId ? response.data : product
              ),
              currentProduct: response.data,
              productsLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ productsError: error.message, productsLoading: false });
          throw error;
        }
      },

      updateProductInventory: async (productId, inventory) => {
        set({ productsLoading: true, productsError: null });
        try {
          const response = await apiCall(`/products/${productId}/inventory`, {
            method: "PUT",
            body: JSON.stringify({ inventory }),
          });

          if (response.success) {
            // Update product inventory in the products array
            set((state) => ({
              products: state.products.map((product) =>
                product._id === productId ? { ...product, inventory } : product
              ),
              productsLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ productsError: error.message, productsLoading: false });
          throw error;
        }
      },

      getLowStockProducts: async (threshold = 10) => {
        set({ productsLoading: true, productsError: null });
        try {
          const response = await apiCall(
            `/products/low-stock?threshold=${threshold}`
          );
          if (response.success) {
            set({ productsLoading: false });
            return response;
          }
        } catch (error) {
          set({ productsError: error.message, productsLoading: false });
          throw error;
        }
      },

      deleteProduct: async (productId) => {
        set({ productsLoading: true, productsError: null });
        try {
          const response = await apiCall(`/products/${productId}`, {
            method: "DELETE",
          });

          if (response.success) {
            // Remove product from the products array
            set((state) => ({
              products: state.products.filter(
                (product) => product._id !== productId
              ),
              productsLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ productsError: error.message, productsLoading: false });
          throw error;
        }
      },

      // ORDERS ACTIONS
      createOrder: async (orderData) => {
        set({ ordersLoading: true, ordersError: null });
        try {
          const response = await apiCall("/orders", {
            method: "POST",
            body: JSON.stringify(orderData),
          });

          if (response.success) {
            set((state) => ({
              orders: [response.data, ...state.orders],
              myOrders: [response.data, ...state.myOrders],
              ordersLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ ordersError: error.message, ordersLoading: false });
          throw error;
        }
      },

      getAllOrders: async () => {
        set({ ordersLoading: true, ordersError: null });
        try {
          const response = await apiCall("/orders");
          if (response.success) {
            set({ orders: response.data, ordersLoading: false });
            return response;
          }
        } catch (error) {
          set({ ordersError: error.message, ordersLoading: false });
          throw error;
        }
      },

      getMyOrders: async () => {
        set({ ordersLoading: true, ordersError: null });
        try {
          const response = await apiCall("/orders/myorders");
          if (response.success) {
            set({ myOrders: response.data, ordersLoading: false });
            return response;
          }
        } catch (error) {
          set({ ordersError: error.message, ordersLoading: false });
          throw error;
        }
      },

      getOrderById: async (orderId) => {
        set({ ordersLoading: true, ordersError: null });
        try {
          const response = await apiCall(`/orders/${orderId}`);
          if (response.success) {
            set({ currentOrder: response.data, ordersLoading: false });
            return response;
          }
        } catch (error) {
          set({ ordersError: error.message, ordersLoading: false });
          throw error;
        }
      },

      updateOrderStatus: async (orderId, status) => {
        set({ ordersLoading: true, ordersError: null });
        try {
          const response = await apiCall(`/orders/${orderId}/status`, {
            method: "PUT",
            body: JSON.stringify({ status }),
          });

          if (response.success) {
            // Update order status in both orders arrays
            set((state) => ({
              orders: state.orders.map((order) =>
                order._id === orderId ? { ...order, status } : order
              ),
              myOrders: state.myOrders.map((order) =>
                order._id === orderId ? { ...order, status } : order
              ),
              ordersLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ ordersError: error.message, ordersLoading: false });
          throw error;
        }
      },

      updateOrderToPaid: async (orderId, paymentResult) => {
        set({ ordersLoading: true, ordersError: null });
        try {
          const response = await apiCall(`/orders/${orderId}/pay`, {
            method: "PUT",
            body: JSON.stringify({ paymentResult }),
          });

          if (response.success) {
            // Update order payment status
            set((state) => ({
              orders: state.orders.map((order) =>
                order._id === orderId
                  ? { ...order, isPaid: true, paymentResult }
                  : order
              ),
              myOrders: state.myOrders.map((order) =>
                order._id === orderId
                  ? { ...order, isPaid: true, paymentResult }
                  : order
              ),
              ordersLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ ordersError: error.message, ordersLoading: false });
          throw error;
        }
      },

      cancelOrder: async (orderId) => {
        set({ ordersLoading: true, ordersError: null });
        try {
          const response = await apiCall(`/orders/${orderId}/cancel`, {
            method: "PUT",
          });

          if (response.success) {
            // Update order status to cancelled
            set((state) => ({
              orders: state.orders.map((order) =>
                order._id === orderId
                  ? { ...order, status: "Cancelled" }
                  : order
              ),
              myOrders: state.myOrders.map((order) =>
                order._id === orderId
                  ? { ...order, status: "Cancelled" }
                  : order
              ),
              ordersLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ ordersError: error.message, ordersLoading: false });
          throw error;
        }
      },

      // UTILITY ACTIONS
      setFilters: (newFilters, clearPrevious = false) => {
        set((state) => ({
          filters: clearPrevious
            ? {
                category: "",
                gender: "",
                minPrice: "",
                maxPrice: "",
                search: "",
                inStock: null,
                ...newFilters,
              }
            : { ...state.filters, ...newFilters },
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            category: "",
            gender: "",
            minPrice: "",
            maxPrice: "",
            search: "",
            inStock: null,
          },
        });
      },

      setPagination: (newPagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...newPagination },
        }));
      },

      clearCurrentProduct: () => {
        set({ currentProduct: null });
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },

      clearErrors: () => {
        set({
          authError: null,
          productsError: null,
          ordersError: null,
          cartError: null,
          searchError: null,
        });
      },

      // CART ACTIONS
      addToCart: (product, quantity = 1, size = null) => {
        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(
            (item) => item.product._id === product._id && item.size === size
          );

          let newCartItems;
          if (existingItemIndex > -1) {
            // Update quantity if item already exists
            newCartItems = state.cartItems.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item to cart
            newCartItems = [
              ...state.cartItems,
              {
                id: `${product._id}-${size || "default"}`,
                product,
                quantity,
                size,
                addedAt: new Date().toISOString(),
              },
            ];
          }

          const cartTotal = newCartItems.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          );

          const cartItemsCount = newCartItems.reduce(
            (count, item) => count + item.quantity,
            0
          );

          return {
            cartItems: newCartItems,
            cartTotal,
            cartItemsCount,
          };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => {
          const newCartItems = state.cartItems.filter(
            (item) => item.id !== itemId
          );

          const cartTotal = newCartItems.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          );

          const cartItemsCount = newCartItems.reduce(
            (count, item) => count + item.quantity,
            0
          );

          return {
            cartItems: newCartItems,
            cartTotal,
            cartItemsCount,
          };
        });
      },

      updateCartItemQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        set((state) => {
          const newCartItems = state.cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );

          const cartTotal = newCartItems.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          );

          const cartItemsCount = newCartItems.reduce(
            (count, item) => count + item.quantity,
            0
          );

          return {
            cartItems: newCartItems,
            cartTotal,
            cartItemsCount,
          };
        });
      },

      clearCart: () => {
        set({
          cartItems: [],
          cartTotal: 0,
          cartItemsCount: 0,
        });
      },

      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      openCart: () => {
        set({ isCartOpen: true });
      },

      closeCart: () => {
        set({ isCartOpen: false });
      },

      // SEARCH ACTIONS
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      searchProducts: async (query) => {
        if (!query.trim()) {
          set({ searchResults: [], searchQuery: "", isSearchOpen: false });
          return;
        }

        set({ searchLoading: true, searchError: null, searchQuery: query });
        try {
          const response = await apiCall(
            `/products?search=${encodeURIComponent(query)}&limit=10`
          );

          if (response.success) {
            set({
              searchResults: response.data,
              searchLoading: false,
              isSearchOpen: true,
            });
          }
        } catch (error) {
          set({
            searchError: error.message,
            searchLoading: false,
            searchResults: [],
          });
        }
      },

      clearSearch: () => {
        set({
          searchQuery: "",
          searchResults: [],
          searchError: null,
          isSearchOpen: false,
        });
      },

      toggleSearch: () => {
        set((state) => ({ isSearchOpen: !state.isSearchOpen }));
      },

      closeSearch: () => {
        set({ isSearchOpen: false });
      },

      // ADMIN ACTIONS
      getAdminStats: async () => {
        set({ adminLoading: true, adminError: null });
        try {
          const response = await apiCall("/admin/stats");
          if (response.success) {
            set({ adminStats: response.data, adminLoading: false });
            return response;
          }
        } catch (error) {
          set({ adminError: error.message, adminLoading: false });
          throw error;
        }
      },

      getAllUsers: async () => {
        set({ adminLoading: true, adminError: null });
        try {
          const response = await apiCall("/admin/users");
          if (response.success) {
            set({ allUsers: response.data, adminLoading: false });
            return response;
          }
        } catch (error) {
          set({ adminError: error.message, adminLoading: false });
          throw error;
        }
      },

      updateUserRole: async (userId, role) => {
        set({ adminLoading: true, adminError: null });
        try {
          const response = await apiCall(`/admin/users/${userId}/role`, {
            method: "PUT",
            body: JSON.stringify({ role }),
          });

          if (response.success) {
            set((state) => ({
              allUsers: state.allUsers.map((user) =>
                user._id === userId ? { ...user, role } : user
              ),
              adminLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ adminError: error.message, adminLoading: false });
          throw error;
        }
      },

      deleteUser: async (userId) => {
        set({ adminLoading: true, adminError: null });
        try {
          const response = await apiCall(`/admin/users/${userId}`, {
            method: "DELETE",
          });

          if (response.success) {
            set((state) => ({
              allUsers: state.allUsers.filter((user) => user._id !== userId),
              adminLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ adminError: error.message, adminLoading: false });
          throw error;
        }
      },

      // Initialize store with token from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem("token");
        if (token) {
          set({ token, isAuthenticated: true });
          // Optionally fetch user profile
          get()
            .getUserProfile()
            .catch(() => {
              // If profile fetch fails, clear auth state
              get().logout();
            });
        }
      },
    }),
    {
      name: "ecommerce-store",
      partialize: (state) => ({
        // Only persist essential auth data and cart
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
        cartItemsCount: state.cartItemsCount,
      }),
    }
  )
);

export default useEcommerceStore;
