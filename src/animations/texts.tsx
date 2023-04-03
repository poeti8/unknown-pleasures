import { useEffect, useState } from "react";
import gsap from "gsap";

import useStore from "../store";

export function useTextsAnimation(
  title: HTMLHeadingElement,
  description: HTMLParagraphElement,
  startButton: HTMLDivElement,
  footer: HTMLDivElement
) {
  const isTrackPlaying = useStore((state) => state.isTrackPlaying);
  const [tryAgainCount, setTryAgainCount] = useState(0);

  useEffect(() => {
    // since "refs" don't trigger a rerender when they are updated,
    // I need to manually simulate a "rerender"
    if (!title || !description || !startButton || !footer) {
      setTimeout(() => {
        setTryAgainCount((count) => count + 1);
      }, 1);
      return;
    }

    if (isTrackPlaying) {
      gsap.to(title, {
        opacity: 0,
        duration: 2.5,
        ease: "power2.out",
      });
      gsap.to(description, {
        opacity: 0,
        duration: 2.5,
        ease: "power2.out",
        delay: 0.3,
      });
      gsap.to(footer, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
      gsap.to(startButton, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(footer, { display: "none" });
          gsap.set(title, { display: "none" });
          gsap.set(description, { display: "none" });
          gsap.set(startButton, { display: "none" });
        },
      });
    } else {
      gsap.set(title, { display: "block", y: "-300%" });
      gsap.set(description, { display: "block", y: "-250%" });
      gsap.set(startButton, { display: "flex", y: "300%" });
      gsap.set(footer, { display: "flex" });
      const delay = 1.5;
      gsap.to(title, {
        opacity: 0.9,
        duration: 3,
        ease: "power2.in",
        delay,
      });
      gsap.to(title, {
        y: 0,
        duration: 3,
        ease: "power2.out",
        delay,
      });
      gsap.to(description, {
        opacity: 0.9,
        duration: 3,
        ease: "power2.in",
        delay: delay + 0.5,
      });
      gsap.to(description, {
        y: 40,
        duration: 3,
        ease: "power2.out",
        delay: delay + 0.5,
      });
      gsap.to(startButton, {
        opacity: 1,
        duration: 3,
        ease: "power2.in",
        delay: delay + 0.5,
      });
      gsap.to(startButton, {
        y: 0,
        duration: 3,
        ease: "power2.out",
        delay: delay + 0.5,
      });
      gsap.to(footer, {
        opacity: 1,
        duration: 3,
        ease: "power2.in",
        delay: delay + 1,
      });
    }
  }, [isTrackPlaying, tryAgainCount]);
}
