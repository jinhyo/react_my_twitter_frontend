import React from "react";
import { Card, Feed, Image } from "semantic-ui-react";
import moment from "moment";

import TweetImages from "./TweetImages";
import TweetContents from "./TweetContents";

// in <QuotationForm />
function QuotedTweet({ tweet }) {
  return (
    <Card fluid raised style={{ width: "95%", marginLeft: "20px" }}>
      <Card.Content style={{ paddingBottom: 0 }}>
        <Card.Header>
          <Feed>
            <Feed.Event>
              <Image floated="left" avatar src={tweet.user.avatarURL} />
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>@{tweet.user.nickname}</Feed.User>
                  <Feed.Date>{moment(tweet.createdAt).fromNow()}</Feed.Date>
                </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          </Feed>
        </Card.Header>
      </Card.Content>
      <Card.Content>
        <Card.Description>
          <TweetContents contents={tweet.contents} />
          {tweet.hasMedia && (
            <TweetImages tweet={tweet} images={tweet.images} />
          )}
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

export default QuotedTweet;
