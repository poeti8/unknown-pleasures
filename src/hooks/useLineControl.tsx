import { useEffect } from "react";
import useStore from "../store/store";

import useCustomControls from "./useCustomControls";
import useIsMobile from "./useIsMobile";

// update line properties from the debug panel values
function useLineControl() {
  // refs
  const lines = useStore((store) => store.refs.lines);

  // values from debug panel
  const controls = useCustomControls();

  // check if is being viewed from mobile
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!lines.current) return;
    lines.current.children.forEach((group) => {
      group.scale.setX(
        isMobile ? controls.line.scaleX * (4.6 / 5) : controls.line.scaleX
      );
    });
  }, [lines.current, controls.line, isMobile]);
}

export default useLineControl;
