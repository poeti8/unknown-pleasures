import { Html } from "@react-three/drei";
import { FC } from "react";

interface Props {
  index: number;
}

const LineTexts: FC<Props> = (props) => {
  return (
    <>
      {props.index === 24 ? (
        <Html position={[-5, 5, 1]}>
          <p className="texts stage-three when-routine-bites-hard">
            WHEN ROUTINE BITES HARD
          </p>
        </Html>
      ) : null}

      {props.index === 36 ? (
        <Html position={[-2, -2, 1]}>
          <p className="texts stage-three and-ambitions-are-low">
            AND AMBITIONS ARE LOW
          </p>
        </Html>
      ) : null}

      {props.index === 54 ? (
        <Html position={[-5, 12, 1]}>
          <p className="texts stage-three and-resentment-rides-high">
            AND RESENTMENT RIDES HIGH
          </p>
        </Html>
      ) : null}

      {props.index === 0 ? (
        <Html position={[0, 1, 1]}>
          <p className="texts stage-four but-emotions-wont-grow">
            BUT EMOTIONS <br /> WON'T GROW
          </p>
          <p className="texts stage-four and-were-changing-our-ways">
            AND WE'RE <br /> CHANGING OUR WAYS
          </p>
          <p className="texts stage-four taking-different-roads">
            TAKING <br /> DIFFERENT ROADS
          </p>
        </Html>
      ) : null}

      {props.index === 0 ? (
        <Html position={[0, 0, 1.7]}>
          <p className="texts stage-five again">AGAIN</p>
        </Html>
      ) : null}

      {props.index === 0 ? (
        <Html position={[0, 0, 2]}>
          <p className="texts stage-five love">LOVE</p>
        </Html>
      ) : null}
    </>
  );
};

export default LineTexts;
