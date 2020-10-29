import React, { useCallback } from "react";
import Link from "next/link";

// in <TweetCard />
function TweetContents({ contents }) {
  return (
    <>
      {contents.split(/(#[^\s#]+|@[^\s@]+)/g).map((content, index) => {
        if (content.match(/(#[^\s#]+)/g)) {
          return (
            <Link
              key={index}
              href={`/hashtags/[tagName]`}
              as={`/hashtags/${content.slice(1)}`}
            >
              <a>{content}</a>
            </Link>
          );
        } else if (content.match(/(@[^\s@]+)/g)) {
          return (
            <Link
              key={index}
              href={`/users/[nickname]`}
              as={`/users/${content.slice(1)}`}
            >
              <a>{content}</a>
            </Link>
          );
        }
        return content;
      })}
    </>
  );
}

export default TweetContents;
