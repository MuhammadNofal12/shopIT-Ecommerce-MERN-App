// import React, { useEffect, useRef } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useGetOrderFromSessionQuery } from "../../redux/api/orderApi";
// import { useDispatch } from "react-redux";
// import { clearCart } from "../../redux/features/cartSlice";
// import { toast } from "react-hot-toast";
// import Loader from "../layout/Loader";
// import MetaData from "../layout/MetaData";

// const OrderSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const hasHandled = useRef(false); // ✅ ensure toast + cart cleared only once

//   const sessionId = searchParams.get("session_id");

//   // Poll until order is created by webhook
//   const { data, isFetching, error } = useGetOrderFromSessionQuery(sessionId, {
//     skip: !sessionId,
//     pollingInterval: 2000,
//   });

//   useEffect(() => {
//     if (error) toast.error(error?.data?.message || "Failed to fetch order");

//     if (data?.order && !hasHandled.current) {
//       hasHandled.current = true;
//       dispatch(clearCart()); // ✅ clear cart only once
//       toast.success("Payment successful! 🎉");

//       setTimeout(() => navigate("/me/orders"), 1500);
//     }
//   }, [data, error, dispatch, navigate]);

//   if (!sessionId)
//     return <h2 className="mt-5 text-center">Invalid payment session.</h2>;

//   return (
//     <>
//       <MetaData title="Processing Payment..." />
//       <div className="d-flex flex-column align-items-center mt-5">
//         <Loader />
//         <h4 className="mt-3">Verifying payment & creating order...</h4>
//       </div>
//     </>
//   );
// };

// export default OrderSuccess;

//--------------------------------------updated---------------------------------
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import { clearCart } from "../../redux/features/cartSlice";
import { useGetOrderFromSessionQuery } from "../../redux/api/orderApi";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get Stripe session id from URL
  const sessionId = searchParams.get("session_id");

  // Debugging
  console.log("Stripe Session ID:", sessionId);

  // Fetch order created from webhook
  const { data, isLoading, error } = useGetOrderFromSessionQuery(sessionId, {
    skip: !sessionId,
  });

  useEffect(() => {
    if (data?.order) {
      toast.success("Payment Successful 🎉");

      // clear cart
      dispatch(clearCart());

      // redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate("/me/orders");
      }, 2000);
    }

    if (error) {
      toast.error("Unable to verify payment");
    }
  }, [data, error, dispatch, navigate]);

  if (isLoading) {
    return <h2 style={{ textAlign: "center" }}>Processing your order...</h2>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Payment Successful 🎉</h2>
      <p>Your order is being processed...</p>
    </div>
  );
};

export default OrderSuccess;
