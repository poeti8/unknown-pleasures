import { useFrame, useThree } from "@react-three/fiber";

import useCustomControls from "./useCustomControls";

// update camera and where it should look at on each frame
function useCameraControl() {
  // three.js camera
  const camera = useThree((context) => context.camera);

  // values from the debug panel
  const controls = useCustomControls();

  useFrame(() => {
    // override camera position and rotation with the debug panel values
    if (controls.camera.manual) {
      camera.position.set(
        controls.camera.position.x,
        controls.camera.position.y,
        controls.camera.position.z
      );
      camera.rotation.set(
        controls.camera.rotation.x,
        controls.camera.rotation.y,
        controls.camera.rotation.z
      );
    }
  });
}

export default useCameraControl;
