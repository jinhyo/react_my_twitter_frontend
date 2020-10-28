import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import userFunctions from "../../../lib/userFunctions";

// in <TweetCard />
function TweetContents({ contents }) {
  const router = useRouter();

  /* 검색결과 클릭 or 검색창에서 엔터 */
  const linkToUserInfo = useCallback(async text => {
      try {
       const userId = await userFunctions.findUserId(text.slice(1))
       router.push(`/users/${userId}`);
      } catch (error) {
        console.error(error);
      }
   
  }, []);
  
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
            <span onClick={()=>linkToUserInfo(content)}>
              <a>{content}</a>
            </span>
          );
        }
        return content;
      })}
    </>
  );
}

export default TweetContents;
