import React from "react";
import { Image, Segment } from "semantic-ui-react";

// in <TweetCard />
function TweetImages({ images }) {
  return (
    <Image.Group>
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.src}
          width={200}
          height={200}
          bordered
          style={{ borderRadius: 10 }}
        />
      ))}
    </Image.Group>
  );
}

export default TweetImages;
