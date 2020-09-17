import React from "react";
import { Container, Button, Grid } from "semantic-ui-react";
import BaseHeader from "./BaseHeader";

function Layout({ children }) {
  return (
    <Container>
      <BaseHeader />
      {children}
    </Container>
  );
}

export default Layout;
