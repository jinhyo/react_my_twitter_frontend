import React from "react";
import Slider from "react-slick";
import { Modal, Button, Image } from "semantic-ui-react";

const SETTINGS = {
  dots: true,
  fade: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

// in <TweetImages />
function ImageZoomModal({ images, closeModal, modal }) {
  return (
    <Modal open={modal} onClose={closeModal} basic>
      <Modal.Content>
        <Slider {...SETTINGS}>
          {images.map(image => (
            <div key={image.src}>
              <Image src={image.src} centered width={700} height={700} />
            </div>
          ))}
        </Slider>
      </Modal.Content>
    </Modal>
  );
}

export default ImageZoomModal;
