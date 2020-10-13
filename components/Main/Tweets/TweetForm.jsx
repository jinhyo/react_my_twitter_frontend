import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Input,
  Button,
  Segment,
  TextArea,
  Divider
} from "semantic-ui-react";
import { Picker } from "emoji-mart";
import PreviewImages from "./PreviewImages";
import mime from "mime-types";
import { toast } from "react-toastify";
import tweetFunctions from "../../../lib/tweetFunctions";
import { userActions, userSelector } from "../../../features/userSlice";
import { tweetSelector, tweetActions } from "../../../features/tweetSlice";
import {
  specificUserActions,
  specificUserSelector
} from "../../../features/specificUserSlice";
import {
  specificTweetSelector,
  specificTweetActions
} from "../../../features/specificTweetSlice";

// in <Index />, <TweetCard />, <PureRetweetCard />
function TweetForm({ commentedTweetId, setCommentInput, currentRetweetId }) {
  const dispatch = useDispatch();
  const fileRef = useRef();

  const currentUser = useSelector(userSelector.currentUser);
  const tweets = useSelector(tweetSelector.tweets);
  const specificUserId = useSelector(specificUserSelector.userId);
  const specificTweetId = useSelector(specificTweetSelector.specificTweetId);
  const currentMenuItem = useSelector(specificTweetSelector.currentMenuItem);

  const [previewImages, setPreviewImages] = useState([]);
  const [imageTypes] = useState(["image/jpeg", "image/png", "image/gif"]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [text, setText] = useState("");
  const [textLimit, setTextLimit] = useState(0);
  const [emoji, setEmoji] = useState(false);

  const handleEmojiToggle = useCallback(() => {
    setEmoji(prev => !prev);
  }, []);

  const handleTextChange = useCallback(e => {
    const text = e.target.value;
    if (text.length <= 150) {
      setText(e.target.value);
      setTextLimit(text.length);
    }
  }, []);

  /*  트윗 전송 */
  const handleSendTweet = useCallback(async () => {
    // empty tweet 제한
    if (!text.trim() && !previewImages) {
      return;
    }

    setUploadLoading(true);
    const tweetFormData = new FormData();
    tweetFormData.append("contents", text);

    // 이미지 파일이 있을 경우
    if (previewImages.length > 0) {
      previewImages.forEach(image => {
        tweetFormData.append("images", image);
      });
    }

    /*  트윗 전송 */
    try {
      let tweetWithOthers;

      if (commentedTweetId) {
        // 댓글 트윗 전송
        tweetWithOthers = await tweetFunctions.commentTweet(
          commentedTweetId,
          tweetFormData
        );
        dispatch(
          userActions.addMyTweet({
            tweetId: tweetWithOthers.id,
            retweetOriginId: null,
            quotedOriginId: null,
            commentedOriginId: commentedTweetId
          })
        );

        if (specificUserId) {
          // specificUser에게 적용
          dispatch(
            specificUserActions.addComment({
              currentRetweetId,
              commentedOriginId: commentedTweetId,
              commentTweetId: tweetWithOthers.id,
              tweet: tweetWithOthers
            })
          );
        } else {
          // currentUser에게 적용
          dispatch(
            tweetActions.addComment({
              currentRetweetId,
              commentedOriginId: commentedTweetId,
              commentTweetId: tweetWithOthers.id
            })
          );
        }

        // 트윗 상세보기에서 댓글을 작성할 경우에는 댓글 매뉴에는 추가
        if (
          specificTweetId === commentedTweetId &&
          currentMenuItem === "comments"
        ) {
          dispatch(tweetActions.addTweet(tweetWithOthers));
          dispatch(specificTweetActions.addComment(tweetWithOthers.id));
        } else if (specificTweetId === commentedTweetId) {
          // 다른 매뉴를 클릭한 상태에서 댓글을 작성할 경우 카운트만 추가
          dispatch(specificTweetActions.addComment(tweetWithOthers.id));
        }
      } else {
        // 일반 트윗 전송
        tweetWithOthers = await tweetFunctions.sendTweet(tweetFormData);
        dispatch(
          userActions.addMyTweet({
            tweetId: tweetWithOthers.id,
            retweetOriginId: null,
            quotedOriginId: null,
            commentedOriginId: null
          })
        );
        dispatch(tweetActions.addTweet(tweetWithOthers));
      }

      setTextLimit(0);
    } catch (error) {
      console.error(error);
    } finally {
      setText("");
      setPreviewImages([]);
      setUploadLoading(false);

      if (commentedTweetId) {
        setCommentInput(false); // 댓글 입력창 닫기
      }
    }
  }, [text, previewImages, currentUser, tweets]);

  /*  이모티콘 입력 */
  const handleAddEmoji = useCallback(
    emoji => {
      if (text.length < 149) {
        setText(prev => prev + emoji.native);
        setTextLimit(prev => prev + emoji.native.length);
      }
    },
    [text]
  );

  /*  이미지 버튼 클릭 */
  const handleClickFileInput = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, [fileRef]);

  /*  이미지 파일 선택 */
  const handleFileInput = useCallback(
    e => {
      // 5개로 제한
      if (e.target.files.length > 5) {
        return toast.warn("최대 5개의 파일을 업로드 할 수 있습니다.");
      }

      let files = [];
      [].forEach.call(e.target.files, file => {
        if (isAuthorized(file, imageTypes)) {
          files.push(file);
        } else {
          return toast.warn("jpeg, png, gif 파일만 가능합니다.");
        }
      });

      setPreviewImages(files);
    },
    [previewImages]
  );

  /*  이미지 파일 타입 검증 */
  function isAuthorized(file, imageTypes) {
    return imageTypes.includes(mime.lookup(file.name));
  }

  const cancelPicture = useCallback(name => {
    setPreviewImages(prev => prev.filter(image => image.name !== name));
  }, []);

  const notAllowEmptyTweet = useCallback(
    () => !text.length && !previewImages.length,
    [text, previewImages]
  );

  return (
    <>
      {emoji && (
        <Picker
          set="apple"
          style={{
            position: "absolute",
            top: "140px",
            left: "70px",
            zIndex: 10
          }}
          onSelect={handleAddEmoji}
        />
      )}
      <Form
        style={{ marginBottom: 5 }}
        onSubmit={handleSendTweet}
        encType="multipart/form-data"
      >
        <TextArea
          name="message"
          type="text"
          autoComplete="off"
          onChange={handleTextChange}
          value={text}
          placeholder={
            commentedTweetId
              ? "답글을 트윗합니다."
              : "무슨 일이 일어나고 있나요?"
          }
        />
        <PreviewImages
          previewImages={previewImages}
          cancelPicture={cancelPicture}
          setPreviewImages={setPreviewImages}
        />
        <Button
          color="green"
          floated="right"
          content="트윗"
          loading={uploadLoading}
          disabled={notAllowEmptyTweet()}
        />
      </Form>
      <Button
        icon={emoji ? "cancel" : "smile outline"}
        color="green"
        onClick={handleEmojiToggle}
      />
      <Button icon="picture" color="green" onClick={handleClickFileInput} />
      <span
        style={{
          marginLeft: 20,
          fontSize: 17,
          color: "green",
          fontWeight: "bold"
        }}
      >
        {textLimit}/150
      </span>
      <input
        type="file"
        multiple
        hidden
        ref={fileRef}
        onChange={handleFileInput}
        onClick={e => {
          e.target.value = null;
        }} // 버그픽스 41
      />
      <Divider hidden />
    </>
  );
}

export default TweetForm;
