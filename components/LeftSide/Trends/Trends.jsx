import React from "react";
import { useSelector } from "react-redux";
import { Card } from "semantic-ui-react";
import TrendComponent from "./TrendComponent";
import { tweetSelector } from "../../../features/tweetSlice";

// in <Index/>, <Profile />, <TweetsWithHashtag />, <TweetStatus />,
function Trends() {
  const hashtagTrend = useSelector(tweetSelector.hashtagTrend);

  return (
    <Card>
      <Card.Content>
        <Card.Header>현재 트랜드</Card.Header>
      </Card.Content>
      <Card.Content>
        {hashtagTrend &&
          hashtagTrend.map(hashtag => (
            <TrendComponent
              key={hashtag.tag}
              name={hashtag.tag}
              count={hashtag.count}
            />
          ))}
      </Card.Content>
    </Card>
  );
}

export default Trends;
