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
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector.currentUser);
  console.log("currentUser", currentUser);

  // 로그인 시 유저정보 가져오기
  useEffect(() => {
    if (!currentUser) {
      try {
        getLoginUserInfo();
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  async function getLoginUserInfo() {
    const user = await authFunctions.getLoginUserInfo();
    console.log("~~getCurrentUser()", user);

    dispatch(userActions.setCurrentUser(user));
  }

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
