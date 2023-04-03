import { useEffect, useState } from "react";

export default function useDebugPanel() {
  const [hash, setHash] = useState(window.location.hash);
  const [isDebugPanelEnabled, setIsDebugPanelEnabled] = useState(false);

  useEffect(() => {
    if (hash === "#debug") {
      setIsDebugPanelEnabled(true);
    } else {
      setIsDebugPanelEnabled(false);
    }
    const hashChangeHandler = () => {
      setHash(window.location.hash);
    };
    addEventListener("hashchange", hashChangeHandler);
    return () => {
      removeEventListener("hashchange", hashChangeHandler);
    };
  }, [hash]);

  return isDebugPanelEnabled;
}
