import React from "react";
import { Card, Image, Button, Icon, Divider } from "semantic-ui-react";

function ProfileCard({ currentUser }) {
  return (
    <>
      <Card>
        <Card.Content>
          <Image
            floated="left"
            width={80}
            height={80}
            src={currentUser.avatarURL}
            className="picture__circle"
          />
          <Divider hidden />
          <Card.Header>{currentUser.nickname}</Card.Header>
          <Card.Meta>@Jin </Card.Meta>
          <Card.Description>{currentUser.selfIntro}</Card.Description>
        </Card.Content>

        <Card.Content extra>
          <div className="ui three buttons">
            <Button basic color="green">
              <p>트윗</p>
              <p>{currentUser.tweets.length}</p>
            </Button>
            <Button basic color="green">
              <p>팔로워</p>
              <p>{currentUser.followers.length}</p>
            </Button>
            <Button basic color="green">
              <p>팔로윙</p>
              <p>{currentUser.followings.length}</p>
            </Button>
          </div>
        </Card.Content>
      </Card>
      <Divider hidden section />
    </>
  );
}

export default ProfileCard;
