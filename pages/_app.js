import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import wrapper from "../store/configureStore";
import Layout from "../components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import authFunctions from "../lib/authFunctions";
import { userActions, userSelector } from "../features/userSlice";

import "semantic-ui-css/semantic.min.css";
import "emoji-mart/css/emoji-mart.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function Root({ Component }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>My Twitter</title>
      </Head>
      <Layout>
        <ToastContainer autoClose={3000} />
        <Component />
      </Layout>
    </>
  );
}

export default wrapper.withRedux(Root);
