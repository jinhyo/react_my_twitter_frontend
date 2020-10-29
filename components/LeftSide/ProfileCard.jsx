import React from "react";
import { useSelector } from "react-redux";
import { Card, Image, Button, Divider } from "semantic-ui-react";
import Link from "next/link";
import { userSelector } from "../../features/userSlice";

function ProfileCard({ currentUser }) {
  const currentUserNickname = useSelector(userSelector.currentUserNickname);

  return (
    <>
      <Card>
        <Card.Content>
          <Link href={`/users/[nickname]`} as={`/users/${currentUserNickname}`}>
            <a>
              <Image
                floated="left"
                width={80}
                height={80}
                src={currentUser.avatarURL.replace("/images/", "/thumb/")}
                className="picture__circle"
              />
            </a>
          </Link>
          <Link href={`/users/[nickname]`} as={`/users/${currentUserNickname}`}>
            <h3>
              <a>@{currentUser.nickname}</a>
            </h3>
          </Link>
          <Divider hidden />
          <Card.Meta>&nbsp;</Card.Meta>
          <Card.Description>{currentUser.selfIntro}</Card.Description>
        </Card.Content>

        <Card.Content extra>
          <Link href={`/users/[nickname]`} as={`/users/${currentUserNickname}`}>
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
