import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

import { login, clearErrors } from "../../actions/artisanAction";

const Login = ({ history, location }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const alert = useAlert();
  const dispatch = useDispatch();

  const { isAuthenticatedArtisan, error, loading } = useSelector(
    (state) => state.authArtisan
  );

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (isAuthenticatedArtisan) {
      history.push(redirect);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, isAuthenticatedArtisan, error, history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Login"} />

          <section class="center-screen tile">
            <div class="auth">
              <form onSubmit={submitHandler}>
                <h3 class="mb-3 text-start">Login</h3>
                <div class="mb-3">
                  <label for="email" class="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div class="text-end">
                    <a
                      href="/forgot"
                      class="navbar-brand fs-6 text-dark-1 text-end"
                    >
                      Forgot Password
                    </a>
                  </div>
                </div>
                <div class="mb-3 text-end">
                  <Link to="/register" className="btn btn-link text-dark-1">
                    Register
                  </Link>
                  <button type="submit" class="btn bg-primary-1 px-3">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Login;
