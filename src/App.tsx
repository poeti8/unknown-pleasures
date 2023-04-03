import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";

import Texts from "./components/Texts/Texts";
import { useDebugPanel } from "./hooks";
import Scene from "./components/Scene";

function App() {
  const isDebugPanelEnabled = useDebugPanel();

  return (
    <>
      {/* leva has to be outside of canvas component */}
      <Leva flat titleBar={true} hidden={!isDebugPanelEnabled} collapsed />

      {/* r3f aka three.js aka webgL scene */}
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 300,
          zoom: 0.9,
          position: [15, -10, -80],
        }}
      >
        <Scene />
      </Canvas>

      {/* html content */}
      <Texts />
    </>
  );
}

export default App;
