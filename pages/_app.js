import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import moment from "moment";

import wrapper from "../store/configureStore";
import Layout from "../components/Layout/Layout";
import { searchActions } from "../features/searchSlice";
import hashtagFunctions from "../lib/hashtagFunctions";
import { tweetActions } from "../features/tweetSlice";

import "emoji-mart/css/emoji-mart.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;
moment.locale("ko");

function Root({ Component, pageProps }) {
  const dispatch = useDispatch();

  useEffect(() => {
    getHashtagTrend();

    return () => {
      dispatch(searchActions.setSearchWord(""));
      dispatch(searchActions.setSearchResults(null));
    };
  }, [Component]);

  async function getHashtagTrend() {
    try {
      const hashtags = await hashtagFunctions.getTopHashtags();

      dispatch(tweetActions.setHashtagTrend(hashtags));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>My Twitter</title>

        <link
          async
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
        />
      </Head>
      <Layout>
        <ToastContainer autoClose={3000} />
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default wrapper.withRedux(Root);
