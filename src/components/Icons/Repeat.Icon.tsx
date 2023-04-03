import React from "react";

function Repeat() {
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
      className="feather feather-repeat"
      viewBox="0 0 24 24"
    >
      <path d="M17 1L21 5 17 9"></path>
      <path d="M3 11V9a4 4 0 014-4h14"></path>
      <path d="M7 23L3 19 7 15"></path>
      <path d="M21 13v2a4 4 0 01-4 4H3"></path>
    </svg>
  );
}

export default React.memo(Repeat);
