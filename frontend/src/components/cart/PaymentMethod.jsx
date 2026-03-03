// import React, { useEffect, useState } from "react";
// import MetaData from "../layout/MetaData";
// import { useSelector } from "react-redux";
// import CheckoutSteps from "./CheckoutSteps";
// import { calculateOrderCost } from "../../helpers/helpers";
// import {
//   useCreateNewOrderMutation,
//   useStripeCheckoutSessionMutation,
// } from "../../redux/api/orderApi";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// //import { loadStripe } from "@stripe/stripe-js";

// // Initialize Stripe once
// //const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// const PaymentMethod = () => {
//   const [method, setMethod] = useState("");

//   const navigate = useNavigate();

//   const { shippingInfo, cartItems } = useSelector((state) => state.cart);

//   const [createNewOrder, { error, isSuccess }] = useCreateNewOrderMutation();

//   const [
//     stripeCheckoutSession,
//     { data: checkoutData, error: checkoutError, isLoading },
//   ] = useStripeCheckoutSessionMutation();

//   useEffect(() => {
//     if (checkoutData) {
//       window.location.href = checkoutData?.url;
//       //   console.log("===========================");
//       //   console.log(checkoutData);
//       //   console.log("===========================");
//       //   navigate(checkoutData?.url);
//     }
//     if (checkoutError) {
//       toast.error(checkoutError?.data?.message);
//     }
//   }, [checkoutData, checkoutError]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error?.data?.message);
//     }

//     if (isSuccess) {
//       navigate("/me/orders?order_success=true");
//     }
//   }, [error, isSuccess, navigate]);

//   const submitHandler = (e) => {
//     e.preventDefault();

//     const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
//       calculateOrderCost(cartItems);

//     if (method === "COD") {
//       //Create COD Order
//       const orderData = {
//         shippingInfo,
//         orderItems: cartItems,
//         itemsPrice,
//         shippingAmount: shippingPrice,
//         taxAmount: taxPrice,
//         totalAmount: totalPrice,
//         paymentInfo: {
//           status: "Not Paid",
//         },
//         paymentMethod: "COD",
//       };
//       createNewOrder(orderData);
//     }
//     if (method === "Card") {
//       //Stripe Checkout
//       const orderData = {
//         shippingInfo,
//         orderItems: cartItems,
//         itemsPrice,
//         shippingAmount: shippingPrice,
//         taxAmount: taxPrice,
//         totalAmount: totalPrice,
//       };
//       stripeCheckoutSession(orderData);
//     }
//   };
//   return (
//     <>
//       <MetaData title={"Payment Method"} />
//       <CheckoutSteps shipping confirmOrder payment />
//       <div className="row wrapper">
//         <div className="col-10 col-lg-5">
//           <form className="shadow rounded bg-body" onSubmit={submitHandler}>
//             <h2 className="mb-4">Select Payment Method</h2>

//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="radio"
//                 name="payment_mode"
//                 id="codradio"
//                 value="COD"
//                 onChange={(e) => setMethod("COD")}
//               />
//               <label className="form-check-label" htmlFor="codradio">
//                 Cash on Delivery
//               </label>
//             </div>
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="radio"
//                 name="payment_mode"
//                 id="cardradio"
//                 value="Card"
//                 onChange={(e) => setMethod("Card")}
//               />
//               <label className="form-check-label" htmlFor="cardradio">
//                 Card - VISA, MasterCard
//               </label>
//             </div>

//             <button
//               id="shipping_btn"
//               type="submit"
//               className="btn py-2 w-100"
//               disabled={isLoading}
//             >
//               CONTINUE
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PaymentMethod;

//-----------------------------------------------updated-------------------------------------------
import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { calculateOrderCost } from "../../helpers/helpers";
import {
  useCreateNewOrderMutation,
  useStripeCheckoutSessionMutation,
} from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");

  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [createNewOrder, { error: orderError, isSuccess }] =
    useCreateNewOrderMutation();

  const [
    stripeCheckoutSession,
    { data: checkoutData, error: checkoutError, isLoading },
  ] = useStripeCheckoutSessionMutation();

  // ✅ Handle Stripe checkout response
  useEffect(() => {
    if (checkoutData) {
      // ✅ Use navigate to redirect (optional, window.location.href also works)
      window.location.href = checkoutData.url;
    }
    if (checkoutError) {
      toast.error(checkoutError?.data?.message || "Stripe checkout failed.");
    }
  }, [checkoutData, checkoutError]);

  // ✅ Handle COD order success
  useEffect(() => {
    if (orderError) {
      toast.error(orderError?.data?.message || "Order creation failed.");
    }

    if (isSuccess) {
      toast.success("Order placed successfully!");
      navigate("/me/orders?order_success=true");
    }
  }, [orderError, isSuccess, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    // ✅ Validate payment method selection
    if (!method) {
      toast.error("Please select a payment method.");
      return;
    }

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      calculateOrderCost(cartItems);

    if (method === "COD") {
      // ✅ Create COD order
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
        paymentInfo: { status: "Not Paid" },
        paymentMethod: "COD",
      };
      createNewOrder(orderData);
    }

    if (method === "Card") {
      // ✅ Initiate Stripe checkout session
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
      };
      stripeCheckoutSession(orderData);
    }
  };

  return (
    <>
      <MetaData title="Payment Method" />
      <CheckoutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Select Payment Method</h2>

            {/* COD Option */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setMethod("COD")}
              />
              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>

            {/* Card Option */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="Card"
                onChange={(e) => setMethod("Card")}
              />
              <label className="form-check-label" htmlFor="cardradio">
                Card - VISA, MasterCard
              </label>
            </div>

            {/* ✅ Show loading indicator on submission */}
            <button
              id="shipping_btn"
              type="submit"
              className="btn py-2 w-100 mt-3"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "CONTINUE"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
