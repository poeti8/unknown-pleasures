import React from "react";

function Play() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-play"
      viewBox="0 0 24 24"
    >
      <path d="M5 3L19 12 5 21 5 3z"></path>
    </svg>
  );
}

export default React.memo(Play);
