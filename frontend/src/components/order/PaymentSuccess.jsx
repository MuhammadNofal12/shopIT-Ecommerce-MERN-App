import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearCart());
    toast.success("Payment successful! Your order has been placed.");

    // Optional: Redirect to orders page after 3 seconds
    const timer = setTimeout(() => {
      navigate("/me/orders");
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  return (
    <div className="text-center mt-5">
      <MetaData title="Payment Successful" />
      <h1>✅ Payment Successful!</h1>
      <p>Your order has been placed. Redirecting to your orders...</p>
    </div>
  );
};

export default PaymentSuccess;
