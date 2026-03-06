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
// import React, { useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { toast } from "react-hot-toast";

// import { clearCart } from "../../redux/features/cartSlice";
// import { useGetOrderFromSessionQuery } from "../../redux/api/orderApi";

// const OrderSuccess = () => {
//   console.log("✅ OrderSuccess component loaded"); // ⭐ ADD HERE

//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const sessionId = searchParams.get("session_id");

//   console.log("Stripe Session ID:", sessionId); // ⭐ already correct

//   const { data, isLoading, error } = useGetOrderFromSessionQuery(sessionId, {
//     skip: !sessionId,
//   });

//   console.log("Order API response:", data); // ⭐ ADD HERE

//   useEffect(() => {
//     if (data?.order) {
//       console.log("✅ Order found in DB"); // ⭐ ADD HERE

//       toast.success("Payment Successful 🎉");

//       dispatch(clearCart());

//       setTimeout(() => {
//         navigate("/me/orders");
//       }, 2000);
//     }

//     if (error) {
//       console.log("❌ Error fetching order:", error); // ⭐ ADD HERE
//       toast.error("Unable to verify payment");
//     }
//   }, [data, error, dispatch, navigate]);

//   if (isLoading) {
//     return <h2 style={{ textAlign: "center" }}>Processing your order...</h2>;
//   }

//   return (
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <h2>Payment Successful 🎉</h2>
//       <p>Your order is being processed...</p>
//     </div>
//   );
// };

// export default OrderSuccess;

//-----------------------------------------------updated 333---------------------------------------
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import { clearCart } from "../../redux/features/cartSlice";
import { useGetOrderFromSessionQuery } from "../../redux/api/orderApi";

const OrderSuccess = () => {
  console.log("✅ OrderSuccess component loaded");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sessionId = searchParams.get("session_id");

  console.log("Stripe Session ID:", sessionId);

  // ✅ Fetch order from backend only if sessionId exists
  const { data, isLoading, error } = useGetOrderFromSessionQuery(sessionId, {
    skip: !sessionId,
  });

  console.log("Order API response:", data);

  useEffect(() => {
    // ✅ SECURITY FIX 1
    // Prevent user from opening success page manually
    if (!sessionId) {
      toast.error("Invalid payment session");
      navigate("/");
      return;
    }

    // ✅ SUCCESS CONDITION
    if (data?.order) {
      console.log("✅ Order found in DB");

      toast.success("Payment Successful 🎉");

      // ✅ Clear cart only after backend confirms order exists
      dispatch(clearCart());

      setTimeout(() => {
        navigate("/me/orders");
      }, 2000);
    }

    // ✅ SECURITY FIX 2
    // If API finished loading but no order found → payment not verified
    if (!isLoading && sessionId && !data?.order) {
      console.log("❌ Order not found for this session");

      toast.error("Payment verification failed");
      navigate("/cart");
    }

    // ✅ ERROR HANDLING
    if (error) {
      console.log("❌ Error fetching order:", error);
      toast.error("Unable to verify payment");
    }
  }, [data, error, sessionId, isLoading, dispatch, navigate]);

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
