import React from "react";
import { Grid } from "semantic-ui-react";
import ProfileCard from "./components/LeftSide/ProfileCard";

function Index(props) {
  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={5} computer={6}>
        <ProfileCard />
      </Grid.Column>
      <Grid.Column tablet={11} computer={10}>
        123
      </Grid.Column>
    </Grid>
  );
}

export default Index;
