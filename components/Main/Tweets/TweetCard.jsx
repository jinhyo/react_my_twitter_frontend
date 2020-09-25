import React from "react";
import { Card, Button, Icon, Feed, Image } from "semantic-ui-react";
import moment from "moment";
import TweetImages from "./TweetImages";

function TweetCard({ tweet }) {
  return (
    <Card fluid>
      <Card.Content style={{ paddingBottom: 0 }}>
        <Card.Header>
          <Feed>
            <Feed.Event>
              <Image
                floated="left"
                width={50}
                height={50}
                src={tweet.user.avatarURL}
                className="picture__circle"
              />
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>{tweet.user.nickname}</Feed.User>
                  <Feed.Date>{moment(tweet.createdAt).fromNow()}</Feed.Date>
                </Feed.Summary>
                @별명?
              </Feed.Content>
            </Feed.Event>
          </Feed>
        </Card.Header>
      </Card.Content>
      <Card.Content>
        <Card.Description>
          <p>{tweet.contents}</p>
          {tweet.hasMedia && <TweetImages images={tweet.images} />}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button basic color="green">
          <Icon name="comment outline" /> 0
        </Button>
        <Button basic color="green">
          <Icon name="retweet" />{" "}
          {tweet.retweetOriginId ? tweet.retweets.length : 0}
        </Button>
        <Button basic color="green">
          <Icon name="heart outline" /> {tweet.likers.length}
        </Button>
      </Card.Content>
    </Card>
  );
}

export default TweetCard;
