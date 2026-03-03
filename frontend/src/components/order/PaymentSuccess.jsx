// import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { clearCart } from "../../redux/features/cartSlice";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import MetaData from "../layout/MetaData";

// const PaymentSuccess = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(clearCart());
//     toast.success("Payment successful! Your order has been placed.");

//     // Optional: Redirect to orders page after 3 seconds
//     const timer = setTimeout(() => {
//       navigate("/me/orders");
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [dispatch, navigate]);

//   return (
//     <div className="text-center mt-5">
//       <MetaData title="Payment Successful" />
//       <h1>✅ Payment Successful!</h1>
//       <p>Your order has been placed. Redirecting to your orders...</p>
//     </div>
//   );
// };

// export default PaymentSuccess;

//-----------------------------------------------
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
    // ✅ Clear the cart when payment is successful
    try {
      dispatch(clearCart());
      toast.success("Payment successful! Your order has been placed.");
    } catch (error) {
      toast.error("Error while clearing the cart.");
      console.error("Error clearing cart:", error); // Log for debugging
    }

    // ✅ Redirect to orders page after 3 seconds
    const timer = setTimeout(() => {
      // ✅ Add a condition to ensure we're only redirecting when the payment is valid
      navigate("/me/orders");
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
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
