import React, { useCallback, useState } from "react";
import { Image, Segment, Label, Button } from "semantic-ui-react";
import TweetImageModal from "./TweetImageModal";

// in <TweetForm />
function PreviewImages({ previewImages, cancelPicture, setPreviewImages }) {
  const [modal, setModal] = useState(false);
  const [targetImage, setTargetImage] = useState(false);
  const closeModal = useCallback(() => {
    setModal(false);
  }, []);

  const openModal = useCallback(() => {
    setModal(true);
  }, []);

  const handleImageEdit = useCallback(image => {
    setTargetImage(image);
    openModal();
  }, []);

  const isGif = useCallback(image => {
    return image.type === "image/gif";
  }, []);

  return (
    <Image.Group>
      {previewImages &&
        previewImages.map((image, index) => (
          <span key={index} className="image__background">
            <Segment basic compact className="image__container">
              <Image
                src={URL.createObjectURL(image)}
                width={200}
                height={200}
                bordered
                label={{
                  as: "a",
                  size: "mini",
                  floating: true,
                  icon: "cancel",
                  color: "grey",
                  onClick: () => cancelPicture(image.name)
                }}
              />

              {/* gif파일은 편집버튼 제거 */}
              {!isGif(image) && (
                <Label
                  as="a"
                  color="grey"
                  attached="top left"
                  size="mini"
                  onClick={() => handleImageEdit(image)}
                >
                  편집
                </Label>
              )}
            </Segment>
          </span>
        ))}
      <TweetImageModal
        targetImage={targetImage}
        modal={modal}
        closeModal={closeModal}
        setTargetImage={setTargetImage}
        setPreviewImages={setPreviewImages}
      />
    </Image.Group>
  );
}

export default PreviewImages;
