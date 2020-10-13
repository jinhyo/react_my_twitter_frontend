import React from "react";
import { Input } from "semantic-ui-react";

function SearchInput(props) {
  return (
    <Input
      icon={{ name: "search", circular: true, link: true }}
      placeholder="Search..."
    />
  );
}

export default SearchInput;
