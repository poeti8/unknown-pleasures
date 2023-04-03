import * as THREE from "three";
import gsap from "gsap";

import { State } from "../store";

// export math utils from three.js library
const { mapLinear, lerp } = THREE.MathUtils;

// create a gsap timeline
// this utility is useful because I can add custom functionalities, e.g. pausing animations
function createTimeline(
  pause: State["refs"]["pause"],
  reverse: State["refs"]["reverse"],
  {
    onComplete,
    onUpdate,
  }: { onComplete?: gsap.Callback; onUpdate?: gsap.Callback } = {}
): gsap.core.Timeline {
  const timeline = gsap.timeline({
    onUpdate: (...props) => {
      // run user provided callback for onUpdate
      onUpdate?.(...props);

      // pause the animation (or resume) based on values on the debug panel
      togglePause(timeline, pause);

      // reverse the animation base on values on the debug panel
      toggleReverse(timeline, reverse);
    },
    onComplete,
  });

  return timeline;
}

// pause animations if enabled on the debug panel
function togglePause(
  timeline: gsap.core.Timeline,
  pause: State["refs"]["pause"]
) {
  if (pause.current.value === false) return;

  timeline.pause();
  const interval = setInterval(resumeHandler, 100);

  function resumeHandler() {
    if (pause.current.value === false) {
      timeline.resume();
      clearInterval(interval);
    }
  }
}

// reverse animations if enabled on the debug panel
function toggleReverse(
  timeline: gsap.core.Timeline,
  reverse: State["refs"]["reverse"]
) {
  const isReversed = timeline.reversed();
  if (isReversed === reverse.current.value) return;

  if (reverse.current.value) {
    timeline.reverse();
  } else {
    timeline.play();
  }
}

export { createTimeline, lerp, mapLinear, togglePause };
