import React from "react";
import { Container, Button, Grid } from "semantic-ui-react";
import BaseHeader from "./BaseHeader";
import ProfileCard from "../LeftSide/ProfileCard";
// import { ToastContainer } from "react-toastify";

function Layout({ children }) {
  return (
    <Container>
      <BaseHeader />
      {/* <ToastContainer autoClose={3000} /> */}
      <Grid stackable padded relaxed>
        <Grid.Column tablet={5} computer={6}>
          <ProfileCard />
        </Grid.Column>
        <Grid.Column tablet={11} computer={10}>
          {children}
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Layout;
