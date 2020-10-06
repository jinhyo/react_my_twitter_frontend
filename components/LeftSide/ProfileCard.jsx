import React from "react";
import { Card, Image, Button, Icon, Divider, Header } from "semantic-ui-react";
import Link from "next/link";

function ProfileCard({ currentUser }) {
  return (
    <>
      <Card>
        <Card.Content>
          <Link href={`/users/[userId]`} as={`/users/${currentUser.id}`}>
            <a>
              <Image
                floated="left"
                width={80}
                height={80}
                src={currentUser.avatarURL}
                className="picture__circle"
              />
            </a>
          </Link>
          <Link href={`/users/[userId]`} as={`/users/${currentUser.id}`}>
            <h3>
              <a>@{currentUser.nickname}</a>
            </h3>
          </Link>
          <Divider hidden />
          <Card.Meta>&nbsp;</Card.Meta>
          <Card.Description>{currentUser.selfIntro}</Card.Description>
        </Card.Content>

        <Card.Content extra>
          <Link href={`/users/[userId]`} as={`/users/${currentUser.id}`}>
            <a>
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
                  <p>팔로잉</p>
                  <p>{currentUser.followings.length}</p>
                </Button>
              </div>
            </a>
          </Link>
        </Card.Content>
      </Card>
      <Divider hidden section />
    </>
  );
}

export default ProfileCard;
