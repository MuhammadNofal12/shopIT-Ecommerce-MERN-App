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

//   const [login, { isLoading, error, data }] = useLoginMutation();
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   //   console.log("=========================================");
//   //   console.log(data);
//   //   console.log("=========================================");

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/");
//     }
//     if (error) {
//       toast.error(error?.data?.message);
//     }
//   }, [error, isAuthenticated]);

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

//------------------------------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
//import { setIsAuthenticated } from "../../redux/features/userSlice"; // Assuming you are using Redux for state

import MetaData from "../layout/MetaData";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  //const dispatch = useDispatch();

  const [login, { isLoading, error }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect if already authenticated
    }
    // if (error) {
    //   toast.error(error?.data?.message);
    // }
  }, [isAuthenticated, navigate]);

  // const submitHandler = (e) => {
  //   e.preventDefault();

  //   const loginData = {
  //     email,
  //     password,
  //   };
  //   login(loginData).then((res) => {
  //     // If successful login, update the state
  //     if (res?.data?.user) {
  //       dispatch(setIsAuthenticated(true)); // Set the user as authenticated in Redux
  //     }
  //   });
  // };
  const submitHandler = async (e) => {
    e.preventDefault();

    console.log("LOGIN SUBMIT");

    try {
      await login({ email, password }).unwrap();

      // toast.success("Login successful");

      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Invalid email or password");
      setPassword("");

      document.getElementById("password_field").focus();
    }
  };

  return (
    <>
      <MetaData title={"Login"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
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
              />
            </div>

            <Link to="/password/forgot" className="float-end mb-4">
              Forgot Password?
            </Link>

            <button
              id="login_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "LOGIN"}
            </button>

            <div className="my-3">
              <Link to="/register" className="float-end">
                New User?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
