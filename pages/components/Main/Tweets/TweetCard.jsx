import React from "react";
import { Card, Button, Icon, Feed } from "semantic-ui-react";

function TweetCard() {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          <Feed>
            <Feed.Event>
              <Feed.Label>
                <img src="/images/avatar/small/elliot.jpg" />
              </Feed.Label>
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>Elliot Fu</Feed.User>
                  <Feed.Date>1 Hour Ago</Feed.Date>
                </Feed.Summary>
                @Elliot
              </Feed.Content>
            </Feed.Event>
          </Feed>
        </Card.Header>
      </Card.Content>
      <Card.Content>
        <Card.Description>asdfasdf</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button basic color="green">
          <Icon name="comment outline" />
        </Button>
        <Button basic color="green">
          <Icon name="retweet" />
        </Button>
        <Button basic color="green">
          <Icon name="heart outline" />
        </Button>
      </Card.Content>
    </Card>
  );
}

export default TweetCard;
