import React from "react";
import Head from "next/head";
import wrapper from "../store/configureStore";
import Layout from "../components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import "semantic-ui-css/semantic.min.css";
import "emoji-mart/css/emoji-mart.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
