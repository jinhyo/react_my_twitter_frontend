import React from "react";
import { Card } from "semantic-ui-react";
import TrendComponent from "./TrendComponent";

function Trends(props) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>Trends for you</Card.Header>
      </Card.Content>
      <Card.Content>
        <TrendComponent name="php" count={4} />
        <TrendComponent name="AI" count={14} />
      </Card.Content>
    </Card>
  );
}

export default Trends;
