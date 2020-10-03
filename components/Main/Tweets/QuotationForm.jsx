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
import QuotationCard from "./QuotedTweet";
import QuotedTweet from "./QuotedTweet";

//  in <QuotedTweetModal />
function QuotationForm({ quotedTweet }) {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const fileRef = useRef();

  const currentUser = useSelector(userSelector.currentUser);
  const tweets = useSelector(tweetSelector.tweets);

  const [previewImages, setPreviewImages] = useState([]);
  const [imageTypes] = useState(["image/jpeg", "image/png", "image/gif"]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState(false);

  const handleEmojiToggle = useCallback(() => {
    setEmoji(prev => !prev);
  }, []);

  const handleTextChange = useCallback(e => {
    setText(e.target.value);
  }, []);

  //// 트윗 전송
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

    // 트윗 전송
    try {
      const tweetWithOthers = await tweetFunctions.sendTweet(tweetFormData);
      dispatch(tweetActions.addTweet(tweetWithOthers));
      dispatch(userActions.addMyTweet(tweetWithOthers.id));
    } catch (error) {
      console.error(error);
    } finally {
      setText("");
      setPreviewImages([]);
      setUploadLoading(false);
    }
  }, [text, previewImages, currentUser, tweets]);

  //// 이모티콘 입력
  const handleAddEmoji = useCallback(emoji => {
    setText(prev => prev + emoji.native);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  //// 이미지 버튼 클릭
  const handleClickFileInput = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, [fileRef]);

  //// 이미지 파일 선택
  const handleFileInput = useCallback(e => {
    // 5개로 제한
    if (e.target.files.length > 5) {
      return toast.warn("최대 5개의 파일을 업로드 할 수 있습니다.");
    }

    let files = [];
    [].forEach.call(e.target.files, file => {
      if (isAuthorized(file, imageTypes)) {
        files.push(file);
      }
    });

    setPreviewImages(files);
  }, []);

  //// 이미지 파일 타입 검증
  function isAuthorized(file, imageTypes) {
    return imageTypes.includes(mime.lookup(file.name));
  }

  const cancelPicture = useCallback(name => {
    setPreviewImages(prev => prev.filter(image => image.name !== name));
  }, []);

  return (
    <>
      {emoji && (
        <Picker
          set="apple"
          style={{
            position: "absolute",
            top: "200px",
            left: "50px",
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
          ref={inputRef}
          name="message"
          type="text"
          autoComplete="off"
          onChange={handleTextChange}
          placeholder="내용 추가하기"
          value={text}
        />
        <PreviewImages
          previewImages={previewImages}
          cancelPicture={cancelPicture}
          setPreviewImages={setPreviewImages}
        />
        <QuotedTweet tweet={quotedTweet} />
        <Button
          color="blue"
          floated="right"
          content="리트윗"
          loading={uploadLoading}
          disabled={!text.length && !previewImages.length}
        />
      </Form>
      <Button
        icon={emoji ? "cancel" : "smile outline"}
        color="blue"
        onClick={handleEmojiToggle}
      />
      <Button icon="picture" color="blue" onClick={handleClickFileInput} />
      <input
        type="file"
        multiple
        hidden
        ref={fileRef}
        onChange={handleFileInput}
      />
      <Divider hidden />
    </>
  );
}

export default QuotationForm;
