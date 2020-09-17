import React from "react";
import Head from "next/head";
import wrapper from "../store/configureStore";
import Layout from "./components/Layout/Layout";
import { ToastContainer } from "react-toastify";

import "semantic-ui-css/semantic.min.css";
import "emoji-mart/css/emoji-mart.css";
import "./App.css";

function Root({ Component }) {
  return (
    // next에서는 <Provider store={store} >가 안 들어감
    //  wrapper.withRedux(NodeBird)에서 자동으로 provider를 제공
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>My Twitter</title>
      </Head>
      {/* <div>공통매뉴</div> */}
      <Layout>
        <ToastContainer autoClose={3000} />
        <Component />
      </Layout>
    </>
  );
}
// Index.jsx의 return값이 Component로 들어감
// Index.jsx의 부모역할

export default wrapper.withRedux(Root);
