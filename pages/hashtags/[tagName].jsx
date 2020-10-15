import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Divider } from "semantic-ui-react";
import ProfileCard from "../../components/LeftSide/ProfileCard";
import Trends from "../../components/LeftSide/Trends/Trends";
import WhoToFollow from "../../components/LeftSide/WhoToFollow/WhoToFollow";
import TweetForm from "../../components/Main/Tweets/TweetForm";
import ShowTweets from "../../components/Main/Tweets/ShowTweets";
import hashtagFunctions from "../../lib/hashtagFunctions";
import { tweetActions } from "../../features/tweetSlice";
import { userSelector, userActions } from "../../features/userSlice";
import { specificTweetSelector } from "../../features/specificTweetSlice";
import { useRouter } from "next/router";
import useTweetGetter from "../../hooks/useTweetGetter";
import { searchActions } from "../../features/searchSlice";

function TweetsWithHashtag() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tagName } = router.query;
  console.log("tagName", tagName);

  const currentUser = useSelector(userSelector.currentUser);

  console.log("currentUser", currentUser);

  const { tweets, getTweets } = useTweetGetter(
    hashtagFunctions.getTweetsWithHashtag,
    tagName
  );

  useEffect(() => {
    if (tagName) {
      dispatch(tweetActions.clearTweets());
      dispatch(userActions.setNowWhere("hashtag"));
      dispatch(userActions.setNowWhere("hashtag"));

      getTweets();
    }

    return () => {
      dispatch(tweetActions.clearTweets());
      dispatch(userActions.setNowWhere("main"));
    };
  }, [tagName]);

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        {currentUser && <ProfileCard currentUser={currentUser} />}

        <Trends />
        <WhoToFollow />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}>
        {/* 트윗들 랜더링 */}
        <ShowTweets tweets={tweets} />
      </Grid.Column>
    </Grid>
  );
}

export default TweetsWithHashtag;
