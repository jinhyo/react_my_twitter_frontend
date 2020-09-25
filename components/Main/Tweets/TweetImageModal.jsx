import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Image, Divider } from "semantic-ui-react";
import AvatarEdit from "react-avatar-editor";
import { tweetSelector, tweetActions } from "../../../features/tweetSlice";
import { userSelector } from "../../../features/userSlice";

// in <PreviewImage />
function TweetImageModal({
  modal,
  closeModal,
  targetImage,
  setTargetImage,
  setPreviewImages
}) {
  const imageRef = useRef();
  const currentUser = useSelector(userSelector.currentUser);

  const [blob, setBlob] = useState(null);
  const [croppedImageURL, setCroppedImageURL] = useState("");
  const [targetImagePreview, setTargetImagePreview] = useState(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!modal) {
      setBlob(null);
      setCroppedImageURL("");
      setTargetImagePreview(null);
      setTargetImage(null);
      setScale(1);
    }
  }, [modal]);

  // <AvatarEdit />용으로 사진 변환
  useEffect(() => {
    if (targetImage) {
      const reader = new FileReader(targetImage);
      reader.readAsDataURL(targetImage);
      reader.onload = () => {
        setTargetImagePreview(reader.result);
      };
    }
  }, [targetImage]);

  const handleScale = useCallback(e => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  }, []);

  const handleCoppedImage = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.getImageScaledToCanvas().toBlob(blob => {
        const imageURL = URL.createObjectURL(blob);
        console.log("!~blob", blob);
        setCroppedImageURL(imageURL);
        setBlob(blob);
      });
    }
  }, []);

  const handleImageSave = useCallback(async () => {
    setPreviewImages(prev => {
      const index = prev.findIndex(image => image.name === targetImage.name);

      // blob을 File로 변환(multer 용)
      prev[index] = new File([blob], targetImage.name);
      return prev;
    });
    closeModal();
  }, [blob, currentUser]);

  return (
    <Modal open={modal} onClose={closeModal}>
      <Modal.Header style={{ backgroundColor: "#fffff0" }}>
        사진 편집
      </Modal.Header>
      <Modal.Content style={{ backgroundColor: "#fffff0" }}>
        <span style={{ display: "inline-block", marginLeft: 50 }}>
          <AvatarEdit
            ref={imageRef}
            width={330}
            height={330}
            image={targetImagePreview}
            border={20}
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
          style={{ display: "inline-block", marginLeft: 30, marginBottom: 40 }}
        >
          {croppedImageURL && (
            <Image src={croppedImageURL} width={330} height={330} bordered />
          )}
        </span>
      </Modal.Content>
      <Modal.Actions style={{ backgroundColor: "#f1f2f6" }}>
        {targetImagePreview && (
          <Button onClick={handleCoppedImage} inverted primary>
            편집
          </Button>
        )}

        {croppedImageURL && (
          <Button inverted primary onClick={handleImageSave}>
            저장
          </Button>
        )}

        <Button inverted onClick={closeModal} color="red">
          취소
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default TweetImageModal;
