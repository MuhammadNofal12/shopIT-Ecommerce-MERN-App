import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGetOrderFromSessionQuery } from "../../redux/features/orderApi";
import MetaData from "../layout/MetaData";

const OrderSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = queryParams.get("session_id");

  const { data, isLoading, isError } = useGetOrderFromSessionQuery(sessionId, {
    skip: !sessionId,
  });

  useEffect(() => {
    if (data?.order) {
      dispatch(clearCart());
      toast.success("Payment successful! Your order has been placed.");

      const timer = setTimeout(() => {
        navigate("/me/orders");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [data, dispatch, navigate]);

  if (isLoading) return <p>Loading order details...</p>;
  if (isError) return <p>Failed to load order details.</p>;

  return (
    <div className="text-center mt-5">
      <MetaData title="Order Successful" />
      <h1>✅ Order Successful!</h1>
      {data?.order && (
        <div>
          <p>Order ID: {data.order._id}</p>
          <p>Total: ${data.order.totalAmount}</p>
          <p>Thank you for your purchase!</p>
        </div>
      )}
    </div>
  );
};

export default OrderSuccess;
