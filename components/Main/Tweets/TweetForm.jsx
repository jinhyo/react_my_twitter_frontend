import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
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

function MessageForm() {
  const inputRef = useRef();
  const fileRef = useRef();

  // const currentUser = useSelector(userSelector.currentUser);
  // const previewImages =
  const [currentUser, setCurrentUser] = useState(""); // temp

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

  const handleSendMessage = useCallback(async () => {
    if (!text) {
      return;
    }
    // const createdBy = {
    //   id: currentUser.id,
    //   nickname: currentUser.nickname
    // };
    try {
      //   await firebaseApp.sendMessage(text, createdBy, currentRoom.id);
      // TO Do sendMessage
    } catch (error) {
      console.error(error);
    }

    if (previewImages) {
      // 이미지 전송
      sendImages();
    }

    setText("");
  }, [text, currentUser]);

  const handleAddEmoji = useCallback(emoji => {
    setText(prev => prev + emoji.native);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendImages = useCallback(async () => {
    const imageURLs = previewImages.map(async image => {
      try {
        //   return await firebaseApp.sendImageFile(
        //     image,
        //     metaData,
        //     currentRoom.id,
        //     currentRoom
        //   );
        // TODO
      } catch (error) {
        console.error(error);
      }
    });
  }, [previewImages, currentUser]);

  const handleClickFileInput = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, [fileRef]);

  const handleFileInput = useCallback(e => {
    let files = [];

    [].forEach.call(e.target.files, file => {
      if (isAuthorized(file, imageTypes)) {
        files.push(file);
      }
    });

    setPreviewImages(files);
  }, []);

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
            top: "130px",
            left: "10px",
            zIndex: 10
          }}
          onSelect={handleAddEmoji}
        />
      )}
      <Form
        style={{ marginBottom: 5 }}
        onSubmit={handleSendMessage}
        encType="multipart/form-data"
      >
        <TextArea
          ref={inputRef}
          name="message"
          type="text"
          autoComplete="off"
          onChange={handleTextChange}
          value={text}
        />
        <Button
          color="green"
          floated="right"
          content="트윗"
          loading={uploadLoading}
        />
      </Form>
      <Button
        icon={emoji ? "cancel" : "smile outline"}
        color="green"
        onClick={handleEmojiToggle}
      />
      <Button icon="picture" color="green" onClick={handleClickFileInput} />
      <input
        type="file"
        multiple
        hidden
        ref={fileRef}
        onChange={handleFileInput}
      />
      <Divider hidden />

      <PreviewImages
        previewImages={previewImages}
        cancelPicture={cancelPicture}
        setPreviewImages={setPreviewImages}
      />
      <Divider />
    </>
  );
}

export default MessageForm;
