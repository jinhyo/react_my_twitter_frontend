import React from "react";
import { Card, Image, Button, Icon, Divider } from "semantic-ui-react";

function ProfileCard(props) {
  return (
    <>
      <Card>
        <Card.Content>
          <Image
            floated="left"
            width={80}
            height={80}
            src="/temp.jpg"
            className="picture__circle"
          />
          <Divider hidden />
          <Card.Header>JJ</Card.Header>
          <Card.Meta>@Jin </Card.Meta>
          <Card.Description>자기소개</Card.Description>
        </Card.Content>

        <Card.Content extra>
          <div className="ui three buttons">
            <Button basic color="green">
              <p>트윗</p>
              <p>20</p>
            </Button>
            <Button basic color="green">
              <p>팔로워</p>
              <p>3</p>
            </Button>
            <Button basic color="green">
              <p>팔로윙</p>
              <p>5</p>
            </Button>
          </div>
        </Card.Content>
      </Card>
      <Divider hidden section />
    </>
  );
}

export default ProfileCard;