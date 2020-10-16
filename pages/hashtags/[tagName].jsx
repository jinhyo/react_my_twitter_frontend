import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Divider, Message } from "semantic-ui-react";
import ProfileCard from "../../components/LeftSide/ProfileCard";
import Trends from "../../components/LeftSide/Trends/Trends";
import ShowTweets from "../../components/Main/Tweets/ShowTweets";
import hashtagFunctions from "../../lib/hashtagFunctions";
import { tweetActions } from "../../features/tweetSlice";
import { userSelector, userActions } from "../../features/userSlice";
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

  const { tweets, getTweets, errorMessage, setErrorMessage } = useTweetGetter(
    hashtagFunctions.getTweetsWithHashtag,
    tagName
  );

  useEffect(() => {
    if (tagName) {
      dispatch(tweetActions.clearTweets());
      dispatch(userActions.setNowWhere("hashtag"));

      getTweets();
    }

    return () => {
      dispatch(tweetActions.clearTweets());
      dispatch(userActions.setNowWhere("main"));
      dispatch(searchActions.setSearchWord(""));
      dispatch(searchActions.setSearchResults(null));

      setErrorMessage("");
    };
  }, [tagName]);

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        {currentUser && <ProfileCard currentUser={currentUser} />}

        <Trends />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}>
        {/* 트윗들 랜더링 */}
        <ShowTweets tweets={tweets} />

        {/* 해당 해시태그가 없을 경우 */}
        {errorMessage && <Message size="huge" error header={errorMessage} />}
      </Grid.Column>
    </Grid>
  );
}

export default TweetsWithHashtag;
