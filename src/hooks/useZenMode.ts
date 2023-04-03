import { useEffect } from "react";

import useCustomControls from "./useCustomControls";

// hide texts if zen mode is enabled on the debug panel
function useZenMode() {
  const controls = useCustomControls();

  useEffect(() => {
    const intro = document.getElementById("intro");
    const start = document.getElementById("start");
    if (!intro || !start) return;
    intro.style.display = controls.scene.zenMode ? "none" : "flex";
    start.style.display = controls.scene.zenMode ? "none" : "flex";
  }, [controls.scene.zenMode]);
}

export default useZenMode;
