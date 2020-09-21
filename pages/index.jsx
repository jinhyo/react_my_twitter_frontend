import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import ProfileCard from "../components/LeftSide/ProfileCard";
import Trends from "../components/LeftSide/Trends/Trends";
import WhoToFollow from "../components/LeftSide/WhoToFollow/WhoToFollow";
import TweetFrom from "../components/Main/Tweets/TweetForm";
import TweetCard from "../components/Main/Tweets/TweetCard";
import { userSelector } from "../features/userSlice";
import useSWR from "swr";
import authFunctions from "../lib/authFunctions";

function Index(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector.currentUser);

  // const { data, error } = useSWR(
  //   "/auth/login-user",
  //   authFunctions.getLoginUserInfo
  // );

  // useEffect(() => {
  //   console.log("data~~", data);

  //   if (data) {
  //     console.log("data", data);
  //   } else if (error) {
  //     console.error(error);
  //   }
  // }, [data, error]);

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        {currentUser && <ProfileCard currentUser={currentUser} />}

        <Trends />
        <WhoToFollow />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}>
        <TweetFrom />
        <TweetCard />
      </Grid.Column>
    </Grid>
  );
}

export default Index;
