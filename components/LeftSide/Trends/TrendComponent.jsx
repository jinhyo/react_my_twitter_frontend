import React from "react";

function TrendComponent({ name, count }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <h3 style={{ marginBottom: 5 }}>
        <a>#{name}</a>
      </h3>
      <p>{count} tweets</p>
    </div>
  );
}

export default TrendComponent;
