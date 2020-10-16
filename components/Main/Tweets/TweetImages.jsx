import React, { useCallback, useState } from "react";
import { Image } from "semantic-ui-react";

import ImageZoomModal from "./ImageZoomModal";

// in <TweetCard />
function TweetImages({ images }) {
  const [modal, setModal] = useState(false);

  const closeModal = useCallback(() => {
    setModal(false);
  }, []);

  const openModal = useCallback(() => {
    setModal(true);
  }, []);

  return (
    <>
      <Image.Group>
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            width={200}
            height={200}
            bordered
            style={{ borderRadius: 10 }}
            onClick={openModal}
          />
        ))}
      </Image.Group>

      {/* 이미지 확대 보기 */}
      <ImageZoomModal images={images} modal={modal} closeModal={closeModal} />
    </>
  );
}

export default TweetImages;
