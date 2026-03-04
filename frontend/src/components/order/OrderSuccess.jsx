import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGetOrderFromSessionQuery } from "../../redux/api/orderApi";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";
import { toast } from "react-hot-toast";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasHandled = useRef(false); // ensures toast + cart cleared only once

  const sessionId = searchParams.get("session_id");

  // Poll until order exists (every 2s)
  const { data, isFetching, error } = useGetOrderFromSessionQuery(sessionId, {
    skip: !sessionId,
    pollingInterval: 2000,
  });

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Failed to fetch order");
    }

    if (data?.order && !hasHandled.current) {
      hasHandled.current = true;

      dispatch(clearCart());
      toast.success("Payment successful! 🎉");

      setTimeout(() => {
        navigate("/me/orders");
      }, 1500);
    }
  }, [data, error, dispatch, navigate]);

  if (!sessionId) {
    return <h2 className="mt-5 text-center">Invalid payment session.</h2>;
  }

  return (
    <>
      <MetaData title="Processing Payment..." />
      <div className="d-flex flex-column align-items-center mt-5">
        {isFetching ? (
          <>
            <Loader />
            <h4 className="mt-3">Verifying payment & creating order...</h4>
          </>
        ) : (
          <h4 className="mt-3">Payment verified, redirecting...</h4>
        )}
      </div>
    </>
  );
};

export default OrderSuccess;
