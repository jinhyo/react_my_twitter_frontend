import React, { useCallback, useState, useEffect } from "react";
import TweetCard from "./TweetCard";
import { Menu, Label, Loader } from "semantic-ui-react";
import userFunctions from "../../../lib/userFunctions";
import UserCard from "../Users/UserCard";
import tweetFunctions from "../../../lib/tweetFunctions";
import ShowTweets from "./ShowTweets";

// in <TweetStatus />
function TweetInfoCard({ tweet }) {
  const [activeItem, setActiveItem] = useState("comments");
  const [loading, setLoading] = useState(false);
  const [retweetUsers, setRetweetUsers] = useState([]);
  const [likers, setLikers] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getComments(tweet.id);
  }, [tweet]);

  const handleItemClick = useCallback(
    async (e, { name }) => {
      setActiveItem(name);

      if (name === "comments") {
        getComments(tweet.id);
      } else if (name === "retweetUsers") {
        getRetweetUsers(tweet.id);
      } else if (name === "quotations") {
        getQuotaions(tweet.id);
      } else if (name === "likers") {
        getLikers(tweet.id);
      }
    },
    [tweet]
  );

  async function getComments(tweetId) {
    try {
      setLoading(true);
      const commentTweets = await tweetFunctions.getComments(tweetId);

      setComments(commentTweets);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getRetweetUsers(tweetId) {
    try {
      setLoading(true);
      const users = await userFunctions.getRetweetUsers(tweetId);

      setRetweetUsers(users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getLikers(tweetId) {
    try {
      setLoading(true);
      const users = await userFunctions.getLikers(tweetId);
      setLikers(users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getQuotaions(tweetId) {
    try {
      setLoading(true);
      const quotationTweets = await tweetFunctions.getQuotations(tweetId);
      console.log("quotationTweets", quotationTweets);

      setQuotations(quotationTweets);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TweetCard tweet={tweet} />

      {/* 트윗 인포 매뉴 */}
      <Menu pointing widths={4}>
        <Menu.Item
          name="comments"
          active={activeItem === "comments"}
          onClick={handleItemClick}
        >
          댓글
          <Label
            size="mini"
            basic
            color="teal"
            content={tweet.comments.length}
          />
        </Menu.Item>
        <Menu.Item
          name="retweetUsers"
          active={activeItem === "retweetUsers"}
          onClick={handleItemClick}
        >
          리트윗
          <Label
            size="mini"
            basic
            color="teal"
            content={tweet.retweets.length}
          />
        </Menu.Item>
        <Menu.Item
          name="quotations"
          active={activeItem === "quotations"}
          onClick={handleItemClick}
        >
          인용한 트윗
          <Label
            size="mini"
            basic
            color="teal"
            content={tweet.quotations.length}
          />
        </Menu.Item>
        <Menu.Item
          name="likers"
          active={activeItem === "likers"}
          onClick={handleItemClick}
        >
          좋아요
          <Label size="mini" basic color="teal" content={tweet.likers.length} />
        </Menu.Item>
      </Menu>

      <Loader size="small" active={loading} />

      {/* 댓글 트윗들 */}
      {activeItem === "comments" && <ShowTweets tweets={comments} />}

      {/* 리트윗한 유저들 */}
      {activeItem === "retweetUsers" &&
        retweetUsers.map(user => <UserCard key={user.id} user={user} />)}

      {/* 인용한 트윗들 */}
      {activeItem === "quotations" && <ShowTweets tweets={quotations} />}

      {/* 좋아요 누른 유저들 */}
      {activeItem === "likers" &&
        likers.map(user => <UserCard key={user.id} user={user} />)}
    </>
  );
}

export default TweetInfoCard;
