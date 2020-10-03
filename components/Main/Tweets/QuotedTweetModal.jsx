import React from "react";
import { Modal, Button } from "semantic-ui-react";
import TweetForm from "./TweetForm";
import QuotationForm from "./QuotationForm";

// in <RetweetButton />
function QuotedTweetModal({ modal, closeModal, tweet }) {
  return (
    <Modal open={modal} onClose={closeModal} size="small">
      <Modal.Header style={{ backgroundColor: "#fffff0" }}>
        트윗 인용하기
      </Modal.Header>
      <Modal.Content style={{ backgroundColor: "#fffff0" }}>
        <QuotationForm quotedTweet={tweet} />
      </Modal.Content>
    </Modal>
  );
}

export default QuotedTweetModal;
