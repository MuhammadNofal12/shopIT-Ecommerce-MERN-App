// import React, { useEffect } from "react";
// import { useMyOrdersQuery } from "../../redux/api/orderApi";
// import Loader from "../layout/Loader";
// import { toast } from "react-hot-toast";
// import { MDBDataTable } from "mdbreact";
// import { Link, useSearchParams, useNavigate } from "react-router-dom";
// import MetaData from "../layout/MetaData";
// import { useDispatch } from "react-redux";
// import { clearCart } from "../../redux/features/cartSlice";

// const MyOrders = () => {
//   const { data, isLoading, error, refetch } = useMyOrdersQuery(); // ✅ added refetch

//   const [searchParams] = useSearchParams();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const orderSuccess = searchParams.get("order_success");

//   // Debugging log for orderSuccess
//   console.log(orderSuccess); // Add this line to check if order_success param is present

//   useEffect(() => {
//     if (error) {
//       toast.error(error?.data?.message);
//     }
//     if (orderSuccess) {
//       // ✅ Clear the cart if payment was successful
//       dispatch(clearCart());
//       toast.success(
//         "Your order was placed successfully, and the cart is cleared!",
//       );

//       // ✅ Refetch the orders so Stripe payments appear immediately
//       refetch();

//       // ✅ Remove query param from URL without reload
//       navigate("/me/orders", { replace: true });
//     }
//   }, [error, orderSuccess, dispatch, navigate, refetch]); // ✅ added refetch in dependency
//   //   if (orderSuccess) {
//   //     dispatch(clearCart());
//   //     navigate("/me/orders");
//   //   }
//   // }, [error, orderSuccess, dispatch, navigate]);

//   const setOrders = () => {
//     const orders = {
//       columns: [
//         {
//           label: "ID",
//           field: "id",
//           sort: "asc",
//         },
//         {
//           label: "Amount Paid",
//           field: "amount",
//           sort: "asc",
//         },
//         {
//           label: "Payment Status",
//           field: "status",
//           sort: "asc",
//         },
//         {
//           label: "Order Status",
//           field: "orderStatus",
//           sort: "asc",
//         },
//         {
//           label: "Actions",
//           field: "actions",
//           sort: "asc",
//         },
//       ],
//       rows: [],
//     };
//     data?.orders?.forEach((order) => {
//       orders.rows.push({
//         id: order?._id,
//         amount: `$${order?.totalAmount}`,
//         status: order?.paymentInfo?.status?.toUpperCase(),
//         orderStatus: order?.orderStatus,
//         actions: (
//           <>
//             <Link to={`/me/order/${order?._id}`} className="btn btn-primary">
//               <i className="fa fa-eye"></i>
//             </Link>
//             <Link
//               to={`/invoice/order/${order?._id}`}
//               className="btn btn-success ms-2"
//             >
//               <i className="fa fa-print"></i>
//             </Link>
//           </>
//         ),
//       });
//     });

//     return orders;
//   };

//   if (isLoading) return <Loader />;

//   return (
//     <div>
//       <MetaData title={"My Orders"} />
//       <h1 className="my-5">{data?.orders?.length} Orders</h1>
//       <MDBDataTable
//         data={setOrders()}
//         className="px-3"
//         bordered
//         striped
//         hover
//       />
//     </div>
//   );
// };

// export default MyOrders;

//---------------------------updated code------------------------------------------------
import React, { useEffect } from "react";
import { useMyOrdersQuery } from "../../redux/api/orderApi";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { MDBDataTable } from "mdbreact";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";

const MyOrders = () => {
  const { data, isLoading, error, refetch } = useMyOrdersQuery();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Only Stripe success uses this query param
  const orderSuccess = searchParams.get("order_success");

  useEffect(() => {
    // Show error toast if any API error occurs
    if (error) {
      toast.error(error?.data?.message || "Failed to fetch orders");
    }

    // Handle Stripe order success
    if (orderSuccess) {
      // ✅ Clear cart once
      dispatch(clearCart());

      // ✅ Show toast once
      toast.success("Your payment was successful, and cart is cleared!");

      // ✅ Refetch orders so Stripe order appears immediately
      refetch();

      // ✅ Remove query param from URL without reload
      navigate("/me/orders", { replace: true });
    }
  }, [error, orderSuccess, dispatch, navigate, refetch]);

  // Prepare table data for MDBDataTable
  const setOrders = () => {
    const orders = {
      columns: [
        { label: "ID", field: "id", sort: "asc" },
        { label: "Amount Paid", field: "amount", sort: "asc" },
        { label: "Payment Status", field: "status", sort: "asc" },
        { label: "Order Status", field: "orderStatus", sort: "asc" },
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    data?.orders?.forEach((order) => {
      orders.rows.push({
        id: order._id,
        amount: `$${order.totalAmount}`,
        status: order.paymentInfo?.status?.toUpperCase(),
        orderStatus: order.orderStatus,
        actions: (
          <>
            <Link to={`/me/order/${order._id}`} className="btn btn-primary">
              <i className="fa fa-eye"></i>
            </Link>
            <Link
              to={`/invoice/order/${order._id}`}
              className="btn btn-success ms-2"
            >
              <i className="fa fa-print"></i>
            </Link>
          </>
        ),
      });
    });

    return orders;
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <MetaData title={"My Orders"} />
      <h1 className="my-5">{data?.orders?.length} Orders</h1>
      <MDBDataTable
        data={setOrders()}
        className="px-3"
        bordered
        striped
        hover
      />
    </div>
  );
};

export default MyOrders;
