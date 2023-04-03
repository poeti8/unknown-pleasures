import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";

import useStore, { Stage } from "../store";
import useIsMobile from "./useIsMobile";
import { useThree } from "@react-three/fiber";

export default function useCursor() {
  // store and refs
  const stage = useStore((store) => store.stage);
  const lines = useStore((store) => store.refs.lines);

  // scene
  const getPixelRatio = useThree((context) => context.gl.getPixelRatio);

  // local states
  const [tryAgainCount, setTryAgainCount] = useState(0);

  // check if is mobile
  const isMobile = useIsMobile();

  const isCursorEnabled = !isMobile && stage === Stage.Zero;

  const onMouseMove = useMemo(
    () => (event: MouseEvent) => {
      if (!isCursorEnabled) return;
      event.preventDefault();

      const cursor = document.getElementById("cursor");
      const canvas = document.querySelector("canvas");
      gsap.to(cursor, {
        x: event.pageX - 36,
        y: event.pageY - 34,
        onUpdate: () => {
          if (!canvas) return;
          if (!lines.current) return;

          const curosrPosition = cursor!.getBoundingClientRect();
          const mousePosition = {
            x: (curosrPosition.left + 40) * getPixelRatio(),
            y: (window.innerHeight - curosrPosition.top - 40) * getPixelRatio(),
          };

          lines.current.children.forEach((group) => {
            group.children.forEach((lineOrPlane) => {
              const mesh = lineOrPlane as THREE.Mesh<
                THREE.BoxGeometry | THREE.PlaneGeometry,
                THREE.ShaderMaterial
              >;
              const uniforms = mesh.material.uniforms;
              uniforms.uMouse.value = mousePosition;
            });
          });
        },
        duration: 0.4,
        ease: "power1.out",
      });
    },
    [isCursorEnabled, isMobile, stage]
  );

  useEffect(() => {
    if (!isCursorEnabled) {
      if (!lines.current) return;
      lines.current.children.forEach((group) => {
        group.children.forEach((lineOrPlane) => {
          const mesh = lineOrPlane as THREE.Mesh<
            THREE.BoxGeometry | THREE.PlaneGeometry,
            THREE.ShaderMaterial
          >;
          const uniforms = mesh.material.uniforms;
          uniforms.uCursorRadius.value = 0;
        });
      });
      return;
    }

    // since "refs" don't trigger a rerender when they are updated,
    // I need to manually simulate a "rerender"
    const cursor = document.getElementById("cursor");
    if (!lines.current || !cursor) {
      setTimeout(() => {
        setTryAgainCount((count) => count + 1);
      }, 1);
      return;
    }

    gsap.to(cursor, { scale: 1, duration: 3, ease: "power1.out", delay: 2 });
    lines.current.children.forEach((group) => {
      group.children.forEach((lineOrPlane) => {
        const mesh = lineOrPlane as THREE.Mesh<
          THREE.BoxGeometry | THREE.PlaneGeometry,
          THREE.ShaderMaterial
        >;
        const uniforms = mesh.material.uniforms;
        gsap.to(uniforms.uCursorRadius, {
          value: cursor!.offsetHeight / window.innerHeight / 2,
          duration: 0.5,
          ease: "power1.out",
          delay: 4,
          onUpdate: () => {
            const curosrPosition = cursor!.getBoundingClientRect();
            const mousePosition = {
              x: (curosrPosition.left + 40) * getPixelRatio(),
              y:
                (window.innerHeight - curosrPosition.top - 40) *
                getPixelRatio(),
            };

            lines.current.children.forEach((group) => {
              group.children.forEach((lineOrPlane) => {
                const mesh = lineOrPlane as THREE.Mesh<
                  THREE.BoxGeometry | THREE.PlaneGeometry,
                  THREE.ShaderMaterial
                >;
                const uniforms = mesh.material.uniforms;
                uniforms.uMouse.value = mousePosition;
              });
            });
          },
        });
      });
    });

    document.body.addEventListener("mousemove", onMouseMove);
    return () => {
      document.body.removeEventListener("mousemove", onMouseMove);
    };
  }, [stage, isCursorEnabled, tryAgainCount]);
}
