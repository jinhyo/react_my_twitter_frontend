import React from "react";
import Link from "next/link";

// in <Trends />
function TrendComponent({ name, count }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <h3 style={{ marginBottom: 5 }}>
        <Link
          href={`/hashtags/[tagName]`}
          as={`/hashtags/${name}`}
          className="item"
        >
          <a>#{name}</a>
        </Link>
      </h3>
      <p>{count} tweets</p>
    </div>
  );
}

export default TrendComponent;
