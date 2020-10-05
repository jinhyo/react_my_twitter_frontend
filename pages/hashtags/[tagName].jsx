import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Grid } from "semantic-ui-react";
import WhoToFollow from "../../components/LeftSide/WhoToFollow/WhoToFollow";
import Trends from "../../components/LeftSide/Trends/Trends";

function Hashtags(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tagName } = router.query;

  return (
    <Grid stackable padded relaxed>
      <Grid.Column tablet={6} computer={6}>
        <Trends />
        <WhoToFollow />
      </Grid.Column>
      <Grid.Column tablet={10} computer={10}></Grid.Column>
    </Grid>
  );
}

export default Hashtags;
