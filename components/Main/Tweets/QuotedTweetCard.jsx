import React from "react";
import { Card, Feed, Image } from "semantic-ui-react";
import moment from "moment";
import Link from "next/link";

import TweetImages from "./TweetImages";
import TweetContents from "./TweetContents";

// in <TweetCard />
function QuotedTweetCard({ tweet }) {
  return (
    <Card
      fluid
      style={{ marginTop: 10, border: "solid 1px", borderRadius: 20 }}
    >
      <Card.Content style={{ paddingBottom: 0 }}>
        <Card.Header>
          <Feed>
            <Feed.Event>
              <Link
                href={`/users/[nickname]`}
                as={`/users/${tweet.user.nickname}`}
              >
                <a>
                  <Image floated="left" avatar src={tweet.user.avatarURL} />
                </a>
              </Link>
              <Feed.Content>
                <Feed.Summary>
                  <Link
                    href={`/users/[nickname]`}
                    as={`/users/${tweet.user.nickname}`}
                  >
                    <a>@{tweet.user.nickname}</a>
                  </Link>
                  <Feed.Date>{moment(tweet.createdAt).fromNow()}</Feed.Date>

                  <Link href={`/tweets/[tweetId]`} as={`/tweets/${tweet.id}`}>
                    <a
                      style={{
                        position: "absolute",
                        right: 20,
                        fontSize: "0.9em",
                      }}
                    >
                      상세보기
                    </a>
                  </Link>
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

export default QuotedTweetCard;
