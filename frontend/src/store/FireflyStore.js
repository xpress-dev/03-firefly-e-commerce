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

      // ADDRESSES STATE
      addresses: [],
      defaultAddress: null,
      addressesLoading: false,
      addressesError: null,

      // REVIEWS STATE
      reviews: [],
      reviewStats: null,
      userReview: null,
      reviewsLoading: false,
      reviewsError: null,

      // FAVORITES STATE
      favorites: [],
      favoritesLoading: false,
      favoritesError: null,
      favoriteCount: 0,

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

      // ADDRESS ACTIONS
      getUserAddresses: async () => {
        set({ addressesLoading: true, addressesError: null });
        try {
          const response = await apiCall("/addresses");
          if (response.success) {
            const addresses = response.data;
            const defaultAddress = addresses.find((addr) => addr.isDefault);
            set({
              addresses,
              defaultAddress,
              addressesLoading: false,
            });
            return response;
          }
        } catch (error) {
          set({ addressesError: error.message, addressesLoading: false });
          throw error;
        }
      },

      getDefaultAddress: async () => {
        set({ addressesLoading: true, addressesError: null });
        try {
          const response = await apiCall("/addresses/default");
          if (response.success) {
            set({
              defaultAddress: response.data,
              addressesLoading: false,
            });
            return response;
          }
        } catch (error) {
          set({ addressesError: error.message, addressesLoading: false });
          throw error;
        }
      },

      createAddress: async (addressData) => {
        set({ addressesLoading: true, addressesError: null });
        try {
          const response = await apiCall("/addresses", {
            method: "POST",
            body: JSON.stringify(addressData),
          });

          if (response.success) {
            set((state) => ({
              addresses: [...state.addresses, response.data],
              addressesLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ addressesError: error.message, addressesLoading: false });
          throw error;
        }
      },

      updateAddress: async (addressId, addressData) => {
        set({ addressesLoading: true, addressesError: null });
        try {
          const response = await apiCall(`/addresses/${addressId}`, {
            method: "PUT",
            body: JSON.stringify(addressData),
          });

          if (response.success) {
            set((state) => ({
              addresses: state.addresses.map((addr) =>
                addr._id === addressId ? response.data : addr
              ),
              defaultAddress: response.data.isDefault
                ? response.data
                : state.defaultAddress,
              addressesLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ addressesError: error.message, addressesLoading: false });
          throw error;
        }
      },

      deleteAddress: async (addressId) => {
        set({ addressesLoading: true, addressesError: null });
        try {
          const response = await apiCall(`/addresses/${addressId}`, {
            method: "DELETE",
          });

          if (response.success) {
            set((state) => ({
              addresses: state.addresses.filter(
                (addr) => addr._id !== addressId
              ),
              defaultAddress:
                state.defaultAddress?._id === addressId
                  ? null
                  : state.defaultAddress,
              addressesLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ addressesError: error.message, addressesLoading: false });
          throw error;
        }
      },

      setDefaultAddress: async (addressId) => {
        set({ addressesLoading: true, addressesError: null });
        try {
          const response = await apiCall(
            `/addresses/${addressId}/set-default`,
            {
              method: "PATCH",
            }
          );

          if (response.success) {
            set((state) => ({
              addresses: state.addresses.map((addr) => ({
                ...addr,
                isDefault: addr._id === addressId,
              })),
              defaultAddress: response.data,
              addressesLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ addressesError: error.message, addressesLoading: false });
          throw error;
        }
      },

      clearAddressesError: () => {
        set({ addressesError: null });
      },

      // REVIEW ACTIONS
      getProductReviews: async (productId, options = {}) => {
        set({ reviewsLoading: true, reviewsError: null });
        try {
          const { page = 1, limit = 10, sort = "newest", rating } = options;
          const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sort,
            ...(rating && { rating: rating.toString() }),
          });

          const response = await apiCall(
            `/reviews/product/${productId}?${params}`
          );
          if (response.success) {
            set({
              reviews: response.data,
              reviewsLoading: false,
            });
            return response;
          }
        } catch (error) {
          set({ reviewsError: error.message, reviewsLoading: false });
          throw error;
        }
      },

      getProductReviewStats: async (productId) => {
        set({ reviewsLoading: true, reviewsError: null });
        try {
          const response = await apiCall(`/reviews/product/${productId}/stats`);
          if (response.success) {
            set({
              reviewStats: response.data,
              reviewsLoading: false,
            });
            return response;
          }
        } catch (error) {
          set({ reviewsError: error.message, reviewsLoading: false });
          throw error;
        }
      },

      getUserProductReview: async (productId) => {
        set({ reviewsLoading: true, reviewsError: null });
        try {
          const response = await apiCall(`/reviews/product/${productId}/user`);
          if (response.success) {
            set({
              userReview: response.data,
              reviewsLoading: false,
            });
            return response;
          }
        } catch (error) {
          set({ reviewsError: error.message, reviewsLoading: false });
          throw error;
        }
      },

      createReview: async (reviewData) => {
        set({ reviewsLoading: true, reviewsError: null });
        try {
          const response = await apiCall("/reviews", {
            method: "POST",
            body: JSON.stringify(reviewData),
          });

          if (response.success) {
            set((state) => ({
              reviews: [response.data, ...state.reviews],
              userReview: response.data,
              reviewsLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ reviewsError: error.message, reviewsLoading: false });
          throw error;
        }
      },

      updateReview: async (reviewId, reviewData) => {
        set({ reviewsLoading: true, reviewsError: null });
        try {
          const response = await apiCall(`/reviews/${reviewId}`, {
            method: "PUT",
            body: JSON.stringify(reviewData),
          });

          if (response.success) {
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review._id === reviewId ? response.data : review
              ),
              userReview: response.data,
              reviewsLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ reviewsError: error.message, reviewsLoading: false });
          throw error;
        }
      },

      deleteReview: async (reviewId) => {
        set({ reviewsLoading: true, reviewsError: null });
        try {
          const response = await apiCall(`/reviews/${reviewId}`, {
            method: "DELETE",
          });

          if (response.success) {
            set((state) => ({
              reviews: state.reviews.filter(
                (review) => review._id !== reviewId
              ),
              userReview: null,
              reviewsLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ reviewsError: error.message, reviewsLoading: false });
          throw error;
        }
      },

      toggleReviewHelpful: async (reviewId) => {
        set({ reviewsLoading: true, reviewsError: null });
        try {
          const response = await apiCall(`/reviews/${reviewId}/helpful`, {
            method: "PATCH",
          });

          if (response.success) {
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review._id === reviewId ? response.data : review
              ),
              userReview:
                state.userReview?._id === reviewId
                  ? response.data
                  : state.userReview,
              reviewsLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ reviewsError: error.message, reviewsLoading: false });
          throw error;
        }
      },

      clearReviewsError: () => {
        set({ reviewsError: null });
      },

      // FAVORITES ACTIONS
      getUserFavorites: async (options = {}) => {
        set({ favoritesLoading: true, favoritesError: null });
        try {
          const { page = 1, limit = 12 } = options;
          const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
          });

          const response = await apiCall(`/favorites?${params}`);
          if (response.success) {
            set({
              favorites: response.data,
              favoritesLoading: false,
            });
            return response;
          }
        } catch (error) {
          set({ favoritesError: error.message, favoritesLoading: false });
          throw error;
        }
      },

      addToFavorites: async (productId) => {
        set({ favoritesLoading: true, favoritesError: null });
        try {
          const response = await apiCall("/favorites", {
            method: "POST",
            body: JSON.stringify({ productId }),
          });

          if (response.success) {
            set((state) => ({
              favorites: [response.data, ...state.favorites],
              favoriteCount: state.favoriteCount + 1,
              favoritesLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ favoritesError: error.message, favoritesLoading: false });
          throw error;
        }
      },

      removeFromFavorites: async (productId) => {
        set({ favoritesLoading: true, favoritesError: null });
        try {
          const response = await apiCall(`/favorites/${productId}`, {
            method: "DELETE",
          });

          if (response.success) {
            set((state) => ({
              favorites: state.favorites.filter(
                (fav) => fav.product._id !== productId
              ),
              favoriteCount: Math.max(0, state.favoriteCount - 1),
              favoritesLoading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ favoritesError: error.message, favoritesLoading: false });
          throw error;
        }
      },

      toggleFavorite: async (productId) => {
        set({ favoritesLoading: true, favoritesError: null });
        try {
          const response = await apiCall(`/favorites/toggle/${productId}`, {
            method: "PATCH",
          });

          if (response.success) {
            if (response.data.isFavorited) {
              // Added to favorites
              set((state) => ({
                favorites: [response.data.favorite, ...state.favorites],
                favoriteCount: state.favoriteCount + 1,
                favoritesLoading: false,
              }));
            } else {
              // Removed from favorites
              set((state) => ({
                favorites: state.favorites.filter(
                  (fav) => fav.product._id !== productId
                ),
                favoriteCount: Math.max(0, state.favoriteCount - 1),
                favoritesLoading: false,
              }));
            }
            return response;
          }
        } catch (error) {
          set({ favoritesError: error.message, favoritesLoading: false });
          throw error;
        }
      },

      checkIfFavorited: async (productId) => {
        try {
          const response = await apiCall(`/favorites/check/${productId}`);
          return response.success ? response.data.isFavorited : false;
        } catch {
          return false;
        }
      },

      getFavoriteCount: async () => {
        try {
          const response = await apiCall("/favorites/count");
          if (response.success) {
            set({ favoriteCount: response.data.count });
            return response.data.count;
          }
        } catch (error) {
          console.error("Failed to get favorite count:", error);
        }
      },

      clearFavoritesError: () => {
        set({ favoritesError: null });
      },

      // Initialize store with token from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem("token");
        if (token) {
          console.log("FireflyStore: Token found, initializing auth");
          set({ token, isAuthenticated: true });
          // Fetch user profile to get role and other user data
          get()
            .getUserProfile()
            .then((response) => {
              console.log(
                "FireflyStore: User profile loaded, role:",
                response?.data?.role
              );
            })
            .catch(() => {
              // If profile fetch fails, clear auth state
              console.log(
                "FireflyStore: Failed to load user profile, clearing auth"
              );
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
