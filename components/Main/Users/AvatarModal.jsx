import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Button, Image } from "semantic-ui-react";
import AvatarEdit from "react-avatar-editor";
import mime from "mime-types";
import { toast } from "react-toastify";

import { userActions } from "../../../features/userSlice";
import userFunctions from "../../../lib/userFunctions";
import { specificUserActions } from "../../../features/specificUserSlice";

// in <ProfileHeader />
function AvatarModal({ modal, closeModal }) {
  const fileRef = useRef();
  const avatarRef = useRef();
  const dispatch = useDispatch();

  const [blob, setBlob] = useState(null);
  const [croppedImageURL, setCroppedImageURL] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!modal) {
      // modal 종료시 호출
      setBlob(null);
      setCroppedImageURL("");
      setPreviewImage(null);
      setImageFile(null);
      setScale(1);
    }
  }, [modal]);

  const handleScale = useCallback(e => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  }, []);

  /* 사진선택 버튼 클릭 */
  const handleFile = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, [fileRef.current]);

  /* 사진 선택 */
  const handleFileInput = useCallback(e => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      //// 타입 검증
      if (isAuthorized(file)) {
        setImageFile(file);
        const reader = new FileReader(file);

        // <AvatarEdit />용으로 사진 변환
        reader.readAsDataURL(file);
        reader.onload = () => {
          setPreviewImage(reader.result);
        };
      } else {
        toast.warn("jpg 또는 png파일만 가능합니다.");
      }
    }
  }, []);

  /*  이미지 파일 타입 검증 */
  function isAuthorized(file) {
    return ["image/jpeg", "image/png"].includes(mime.lookup(file.name));
  }

  /* 편집된 사진 미리보기 */
  const handleCoppedImage = useCallback(() => {
    if (avatarRef.current) {
      avatarRef.current.getImageScaledToCanvas().toBlob(blob => {
        const imageURL = URL.createObjectURL(blob);
        setCroppedImageURL(imageURL);
        setBlob(blob);
      });
    }
  }, []);

  const handleAvatarUpdate = useCallback(async () => {
    try {
      setUpdateLoading(true);
      // blob에서 File로 변경(multer 용)으로 변경
      const image = new File([blob], imageFile.name);

      const imageFormData = new FormData();
      imageFormData.append("image", image);

      const avatarURL = await userFunctions.updateAvatarPicture(imageFormData);

      dispatch(userActions.updateAvatarURL(avatarURL));
      dispatch(specificUserActions.updateAvatarURL(avatarURL));

      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateLoading(false);
    }
  }, [blob, imageFile]);

  return (
    <Modal open={modal} onClose={closeModal}>
      <Modal.Header style={{ backgroundColor: "#fffff0" }}>
        아바타 변경
      </Modal.Header>
      <Modal.Content style={{ backgroundColor: "#fffff0" }}>
        <span style={{ display: "inline-block", marginLeft: 50 }}>
          <AvatarEdit
            ref={avatarRef}
            width={200}
            height={200}
            image={previewImage}
            border={1}
            scale={scale}
          />
          <br />
          Zoom:
          <input
            type="range"
            max="2"
            min="1"
            step="0.01"
            defaultValue="1"
            onChange={handleScale}
          />
        </span>
        <span
          style={{ display: "inline-block", marginLeft: 150, marginBottom: 22 }}
        >
          {croppedImageURL && (
            <Image src={croppedImageURL} width={200} height={200} bordered />
          )}
        </span>
        <input type="file" hidden ref={fileRef} onChange={handleFileInput} />
      </Modal.Content>
      <Modal.Actions style={{ backgroundColor: "#f1f2f6" }}>
        <Button inverted onClick={handleFile} primary>
          사진선택
        </Button>
        {previewImage && (
          <Button onClick={handleCoppedImage} inverted primary>
            미리보기
          </Button>
        )}

        {croppedImageURL && (
          <Button
            inverted
            primary
            onClick={handleAvatarUpdate}
            loading={updateLoading}
          >
            아바타 변경
          </Button>
        )}

        <Button inverted onClick={closeModal} color="red">
          취소
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default AvatarModal;
