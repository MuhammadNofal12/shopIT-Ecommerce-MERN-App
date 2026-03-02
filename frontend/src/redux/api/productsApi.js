import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { toast } from "react-hot-toast";

//import { API_BASE_URL } from "../../constants/api";

// Use deployed backend URL from .env
const BASE_URL = process.env.REACT_APP_API_URL;

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    //baseUrl: API_BASE_URL,
    //credentials: "include",
    // baseUrl: process.env.REACT_APP_API_URL,
    baseUrl: `${BASE_URL}/api/v1`, // prepend API path
    credentials: "include", // if backend uses cookies
    //baseUrl: "/api/v1",
  }),
  tagTypes: ["Product", "AdminProducts", "Reviews"],
  // keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params: {
          page: params?.page,
          keyword: params?.keyword,
          category: params?.category,
          "price[gte]": params?.min,
          "price[lte]": params?.max,
          "ratings[gte]": params?.ratings,
        },
      }),
    }),
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    submitReview: builder.mutation({
      query: (body) => ({
        url: "/reviews",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Review submitted successfully!");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to submit review");
        }
      },
    }),
    canUserReview: builder.query({
      query: (productId) => `/can_review/?productId=${productId}`,
    }),
    getAdminProducts: builder.query({
      query: () => `/admin/products`,
      providesTags: ["AdminProducts"],
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/admin/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminProducts"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Product created successfully!");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to create product");
        }
      },
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminProducts", "Product"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Product updated successfully!");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to update product");
        }
      },
    }),
    uploadProductImages: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}/upload_images`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Product"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Product images uploaded successfully!");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to upload images");
        }
      },
    }),
    deleteProductImage: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}/delete_image`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Product"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Product image deleted successfully!");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to delete image");
        }
      },
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "AdminProducts" },
      ],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Product deleted successfully!"); // ✅ Added
        } catch (error) {
          toast.error(error?.data?.message || "Failed to delete product"); // ✅ Added
        }
      },
    }),
    getProductReviews: builder.query({
      query: (productId) => `/reviews?id=${productId}`,
      providesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query: ({ productId, id }) => ({
        url: `/admin/reviews?productId=${productId}&id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Review deleted successfully!"); // ✅ Added
        } catch (error) {
          toast.error(error?.data?.message || "Failed to delete review"); // ✅ Added
        }
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSubmitReviewMutation,
  useCanUserReviewQuery,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
  useLazyGetProductReviewsQuery,
  useDeleteReviewMutation,
} = productApi;
