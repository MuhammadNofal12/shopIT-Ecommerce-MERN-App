import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../features/userSlice";
import { toast } from "react-hot-toast";

//import { API_BASE_URL } from "../../constants/api";

// Use deployed backend URL from .env
const BASE_URL = process.env.REACT_APP_API_URL;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    //  baseUrl: API_BASE_URL,
    //  credentials: "include",
    // baseUrl: process.env.REACT_APP_API_URL,
    baseUrl: `${BASE_URL}/api/v1`, // prepend API path
    credentials: "include", // if backend uses cookies
    //  baseUrl: "/api/v1",
  }),

  tagTypes: ["User", "AdminUsers", "AdminUser"],
  // keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => `/me`,
      keepUnusedDataFor: 300, // ✅ cache user for 5 minutes
      refetchOnMountOrArgChange: false,
      refetchOnReconnect: true,
      transformResponse: (result) => result?.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setUser(null)); // ✔ important
          dispatch(setIsAuthenticated(false)); // ✔ important
          dispatch(setLoading(false));
        }
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/me/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Profile updated successfully!"); // ✅ Added
        } catch (error) {
          toast.error(error?.data?.message || "Failed to update profile"); // ✅ Added
        }
      },
    }),
    uploadAvatar: builder.mutation({
      query: (body) => ({
        url: "/me/upload_avatar",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Avatar uploaded successfully!"); // ✅ Added
        } catch (error) {
          toast.error(error?.data?.message || "Failed to upload avatar"); // ✅ Added
        }
      },
    }),
    updatePassword: builder.mutation({
      query: (body) => ({
        url: "/password/update",
        method: "PUT",
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Password updated successfully!"); // ✅ Added
        } catch (error) {
          toast.error(error?.data?.message || "Failed to update password"); // ✅ Added
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/password/forgot",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Password reset email sent!"); // ✅ Added
        } catch (error) {
          toast.error(error?.data?.message || "Failed to send reset email"); // ✅ Added
        }
      },
    }),
    resetPassword: builder.mutation({
      query: ({ token, body }) => ({
        url: `/password/reset/${token}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Password reset successfully!"); // ✅ Added
        } catch (error) {
          toast.error(error?.data?.message || "Failed to reset password"); // ✅ Added
        }
      },
    }),
    getAdminUsers: builder.query({
      query: () => `/admin/users`,
      providesTags: ["AdminUsers"],
    }),
    getUserDetails: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: ["AdminUser"],
    }),
    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminUsers", "AdminUser"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User updated successfully!"); // ✅ Added
        } catch (error) {
          toast.error(error?.data?.message || "Failed to update user"); // ✅ Added
        }
      },
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUsers"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User deleted successfully!"); // ✅ Added
        } catch (error) {
          toast.error(error?.data?.message || "Failed to delete user"); // ✅ Added
        }
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateProfileMutation,

  useUploadAvatarMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAdminUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
