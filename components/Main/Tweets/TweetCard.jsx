import React from "react";
import { Card, Button, Icon, Feed, Image } from "semantic-ui-react";

function TweetCard() {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          <Feed>
            <Feed.Event>
              <Image
                floated="left"
                width={50}
                height={50}
                src="/temp.jpg"
                className="picture__circle"
              />
              {/* <img src="/temp.jpg" /> */}
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
          <Icon name="comment outline" /> 9
        </Button>
        <Button basic color="green">
          <Icon name="retweet" /> 3
        </Button>
        <Button basic color="green">
          <Icon name="heart outline" /> 4
        </Button>
      </Card.Content>
    </Card>
  );
}

export default TweetCard;
