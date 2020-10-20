import React, { useCallback, useState } from "react";
import { Image } from "semantic-ui-react";
import axios from "axios";

import ImageZoomModal from "./ImageZoomModal";

// in <TweetCard />, <PureRetweetCard />, <QuotedTweetCard />
function TweetImages({ images }) {
  const [modal, setModal] = useState(false);

  const closeModal = useCallback(() => {
    setModal(false);
  }, []);

  const openModal = useCallback(() => {
    setModal(true);
  }, []);

  const setSrc = useCallback(async src => {
    const ext = src.split(".")[src.split(".").length - 1];

    if (ext === "gif") {
      return src;
    } else {
      // 방금 추가된 트윗의 경우 리사이징 되기 전 이미지를 사용
      const result = await axios.get(src);
      if (result) {
        return src.replace("/images/", "/thumb/");
      } else {
        return src;
      }
    }
  }, []);

  return (
    <>
      <Image.Group>
        {images.map((image, index) => (
          <Image
            key={index}
            src={setSrc(image.src)}
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
