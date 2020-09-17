import React from "react";
import { Card, Image, Button, Icon } from "semantic-ui-react";

function ProfileHeader(props) {
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="left"
          size="large"
          src="../../../images/123.jpg"
          width={200}
          height={200}
        />
        <Button floated="right" primary size="small">
          프로필 수정
        </Button>
      </Card.Content>
      <Card.Content>
        <Card.Header>JJ</Card.Header>
        <Card.Meta>
          @Jin &emsp;
          <Icon name="map marker alternate" /> 서울 &emsp;
          <Icon name="calendar alternate outline" /> 20017년 8월 15일 가입
        </Card.Meta>
        <Card.Description>자기소개</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui five buttons">
          <Button basic color="green">
            <p>트윗</p>
            <p>20</p>
          </Button>
          <Button basic color="green">
            <p>미디어</p>
            <p>3</p>
          </Button>
          <Button basic color="green">
            <p>좋아요</p>
            <p>8</p>
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
  );
}

export default ProfileHeader;
