import { useEffect, useState } from "react";

import useWindowSize from "./useWindowSize";

export default function useIsMobile() {
  const windowSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(windowSize.width < 500);

  useEffect(() => {
    const userAgent = window.navigator.userAgent ?? "";
    const isMobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i
      )
    );
    setIsMobile(isMobile || windowSize.width < 500);
  }, [windowSize]);

  return isMobile;
}
