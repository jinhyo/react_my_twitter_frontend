import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
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
import { searchActions } from "../features/searchSlice";
import hashtagFunctions from "../lib/hashtagFunctions";
import { tweetActions } from "../features/tweetSlice";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function Root({ Component }) {
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
      </Head>
      <Layout>
        <ToastContainer autoClose={3000} />
        <Component />
      </Layout>
    </>
  );
}

export default wrapper.withRedux(Root);
