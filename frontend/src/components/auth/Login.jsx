// import React, { useEffect, useState } from "react";
// import { useLoginMutation } from "../../redux/api/authApi";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import MetaData from "../layout/MetaData";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const [login, { isLoading, error, isSuccess }] = useLoginMutation();
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   //   console.log("=========================================");
//   //   console.log(data);
//   //   console.log("=========================================");

//   useEffect(() => {
//     if (isSuccess) {
//       toast.success("Login successful");
//     }
//     if (isAuthenticated) {
//       navigate("/");
//     }
//     if (error) {
//       toast.error(error?.data?.message);
//     }
//   }, [error, isAuthenticated, navigate, isSuccess]);

//   const submitHandler = (e) => {
//     e.preventDefault();

//     const loginData = {
//       email,
//       password,
//     };
//     login(loginData);
//   };
//   return (
//     <>
//       <MetaData title={"Login"} />
//       <div className="row wrapper">
//         <div className="col-10 col-lg-5">
//           <form className="shadow rounded bg-body" onSubmit={submitHandler}>
//             <h2 className="mb-4">Login</h2>
//             <div className="mb-3">
//               <label htmlFor="email_field" className="form-label">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email_field"
//                 className="form-control"
//                 name="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="password_field" className="form-label">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password_field"
//                 className="form-control"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <a href="/password/forgot" className="float-end mb-4">
//               Forgot Password?
//             </a>

//             <button
//               id="login_button"
//               type="submit"
//               className="btn w-100 py-2"
//               disabled={isLoading}
//             >
//               {isLoading ? "Authenticating..." : "LOGIN"}
//             </button>

//             <div className="my-3">
//               <a href="/register" className="float-end">
//                 New User?
//               </a>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;

//------------------updated----------------------------------------
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import { useLoginMutation } from "../../redux/api/authApi";
import {
  setUser,
  setIsAuthenticated,
  setLoading,
} from "../../redux/features/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [login, { isLoading }] = useLoginMutation();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/");
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      dispatch(setLoading(true)); // optional: show loading in Redux

      const { data } = await login(loginData).unwrap(); // unwrap gets actual API response

      // ✅ Update Redux
      dispatch(setUser(data.user));
      dispatch(setIsAuthenticated(true));
      dispatch(setLoading(false));

      toast.success("Login successful");
      navigate("/"); // redirect to home
    } catch (err) {
      dispatch(setLoading(false));
      console.log(err);
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <MetaData title="Login" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body p-4" onSubmit={submitHandler}>
            <h2 className="mb-4">Login</h2>

            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password_field" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <a href="/password/forgot" className="float-end mb-4">
              Forgot Password?
            </a>

            <button
              id="login_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "LOGIN"}
            </button>

            <div className="my-3">
              <a href="/register" className="float-end">
                New User?
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
