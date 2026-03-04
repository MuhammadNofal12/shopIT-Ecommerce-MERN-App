import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-hot-toast";
//import { API_BASE_URL } from "../../constants/api";

// Use deployed backend URL from .env
const BASE_URL = process.env.REACT_APP_API_URL;

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    //baseUrl: API_BASE_URL,
    //credentials: "include",
    //baseUrl: process.env.REACT_APP_API_URL,

    baseUrl: `${BASE_URL}/api/v1`, // prepend your API path
    credentials: "include", // if your backend uses cookies
    //baseUrl: "/api/v1",
  }),
  tagTypes: ["Order", "AdminOrders"],
  // keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/new",
        method: "POST",
        body,
      }),
      // Remove onQueryStarted toast for COD
    }),
    myOrders: builder.query({
      query: () => `/me/orders`,
    }),
    orderDetails: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),
    stripeCheckoutSession: builder.mutation({
      query: (body) => ({
        url: "/payment/checkout_session",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Redirecting to payment...");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to initiate payment");
        }
      },
    }),
    getDashboardSales: builder.query({
      query: ({ startDate, endDate }) =>
        `/admin/get_sales/?startDate=${startDate}&endDate=${endDate}`,
    }),
    getAdminOrders: builder.query({
      query: () => `/admin/orders`,
      providesTags: ["AdminOrders"],
    }),
    updateOrder: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/orders/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Order"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Order updated successfully!");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to update order");
        }
      },
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminOrders"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Order deleted successfully!");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to delete order");
        }
      },
    }),
    // getOrderFromSession: builder.query({
    //   query: (sessionId) => `/payment/order-from-session/${sessionId}`,
    //   async onQueryStarted(args, { queryFulfilled }) {
    //     try {
    //       await queryFulfilled;
    //     } catch (error) {
    //       toast.error(error?.data?.message || "Failed to fetch order");
    //     }
    //   },
    // }),
  }),
});

export const {
  //useGetOrderFromSessionQuery,
  useCreateNewOrderMutation,
  useStripeCheckoutSessionMutation,
  useMyOrdersQuery,
  useOrderDetailsQuery,
  useLazyGetDashboardSalesQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
