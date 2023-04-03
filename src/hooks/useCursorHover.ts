import { useMemo } from "react";
import gsap from "gsap";

import useIsMobile from "./useIsMobile";

export default function useCursorHover() {
  // check if is mobile
  const isMobile = useIsMobile();

  const onMouseEnterLink = useMemo(
    () => () => {
      if (isMobile) return;
      const cursor = document.getElementById("cursor");
      gsap.to(cursor, {
        scale: 0.1,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        duration: 0.3,
        ease: "power1.out",
      });
    },
    []
  );
  const onMouseLeaveLink = useMemo(
    () => () => {
      if (isMobile) return;
      const cursor = document.getElementById("cursor");
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "rgba(255, 255, 255, 0)",
        duration: 0.3,
        ease: "power1.out",
      });
    },
    []
  );

  const onMouseEnterText = useMemo(
    () => () => {
      if (isMobile) return;
      const cursor = document.getElementById("cursor");
      gsap.to(cursor, {
        scale: 0.5,
        duration: 0.3,
        ease: "power1.out",
      });
    },
    []
  );
  const onMouseLeaveText = useMemo(
    () => () => {
      if (isMobile) return;
      const cursor = document.getElementById("cursor");
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: "power1.out",
      });
    },
    []
  );

  return {
    link: { onMouseEnter: onMouseEnterLink, onMouseLeave: onMouseLeaveLink },
    text: { onMouseEnter: onMouseEnterText, onMouseLeave: onMouseLeaveText },
  };
}
