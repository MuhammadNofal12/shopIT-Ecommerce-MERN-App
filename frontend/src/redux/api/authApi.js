// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { userApi } from "./userApi";
// // /import { API_BASE_URL } from "../../constants/api";

// // Use deployed backend URL from .env
// const BASE_URL = process.env.REACT_APP_API_URL; // automatically available in React

// export const authApi = createApi({
//   reducerPath: "authApi",
//   baseQuery: fetchBaseQuery({
//     //baseUrl: API_BASE_URL,
//     //credentials: "include",
//     //baseUrl: process.env.REACT_APP_API_URL,
//     //credentials: "include",
//     baseUrl: `${BASE_URL}/api/v1`, // prepend your API path
//     credentials: "include", // if you need cookies for auth
//     // baseUrl: "/api/v1",
//   }),
//   // keepUnusedDataFor: 30,
//   endpoints: (builder) => ({
//     register: builder.mutation({
//       query(body) {
//         return {
//           url: "/register",
//           method: "POST",
//           body,
//         };
//       },
//       async onQueryStarted(args, { dispatch, queryFulfilled }) {
//         try {
//           await queryFulfilled;
//           await dispatch(userApi.endpoints.getMe.initiate(null));
//         } catch (error) {
//           console.log(error);
//         }
//       },
//     }),
//     login: builder.mutation({
//       query(body) {
//         return {
//           url: "/login",
//           method: "POST",
//           body,
//         };
//       },
//       async onQueryStarted(args, { dispatch, queryFulfilled }) {
//         try {
//           await queryFulfilled;
//           await dispatch(userApi.endpoints.getMe.initiate(null));
//         } catch (error) {
//           console.log(error);
//         }
//       },
//     }),
//     logout: builder.mutation({
//       query: () => ({
//         url: "/logout",
//         method: "GET",
//         credentials: "include",
//       }),
//       async onQueryStarted(args, { dispatch, queryFulfilled }) {
//         try {
//           await queryFulfilled;
//           dispatch(userApi.util.resetApiState());
//         } catch (error) {
//           console.log(error);
//         }
//       },
//     }),
//   }),
// });

// export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
//   authApi;

//----------------------------------------
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userApi } from "./userApi";
import { setUser, setIsAuthenticated } from "../features/userSlice";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: "/register", method: "POST", body }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        // dispatch(setLoading(true)); // ✔ start loading

        try {
          const { data } = await queryFulfilled;

          dispatch(setUser(data.user));
          dispatch(setIsAuthenticated(true));
          // dispatch(setLoading(false));

          toast.success("Registration successful!");
        } catch (error) {
          //   dispatch(setLoading(false));
          toast.error(error?.error?.data?.message || "Registration failed"); // ✔ better error
        }
      },
    }),
    // login: builder.mutation({
    //   query: (body) => ({ url: "/login", method: "POST", body }),
    //   async onQueryStarted(args, { dispatch, queryFulfilled }) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       dispatch(setUser(data.user));
    //       dispatch(setIsAuthenticated(true));
    //       dispatch(setLoading(false));
    //       toast.success("Login successful!"); // ✅ Add this
    //     } catch (error) {
    //       dispatch(setLoading(false));
    //       console.log(error);
    //     }
    //   },
    // }),
    login: builder.mutation({
      query: (body) => ({ url: "/login", method: "POST", body }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        //  dispatch(setLoading(true)); // ✔ FIX start loading

        try {
          const { data } = await queryFulfilled;

          dispatch(setUser(data.user));
          dispatch(setIsAuthenticated(true));
          //    dispatch(setLoading(false)); // ✔ stop loading

          toast.success("Login successful!");
        } catch (error) {
          //   dispatch(setLoading(false));
          toast.error(error?.error?.data?.message || "Login failed"); // ✔ better error
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
        credentials: "include",
      }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // reset ALL RTK queries first
          //dispatch(authApi.util.resetApiState());
          dispatch(userApi.util.resetApiState());

          // then clear redux state
          dispatch(setUser(null));
          dispatch(setIsAuthenticated(false));

          toast.success("Logout successful!");
        } catch (error) {
          toast.error(error?.data?.message || "Something went wrong");
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApi;
