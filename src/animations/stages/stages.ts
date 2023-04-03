import * as stageZero from "./stage.zero";
import * as stageOne from "./stage.one";
import * as stageTwo from "./stage.two";
import * as stageThree from "./stage.three";
import * as stageFour from "./stage.four";
import * as stageFive from "./stage.five";
import * as stageReset from "./stage.reset";
import { FrameAnimationProps } from "./types";

export function runStageFrameAnimations(...props: FrameAnimationProps) {
  stageZero.runFrameAnimations(...props);
  stageOne.runFrameAnimations(...props);
  stageTwo.runFrameAnimations(...props);
  stageThree.runFrameAnimations(...props);
  stageFour.runFrameAnimations(...props);
  stageFive.runFrameAnimations(...props);
  stageReset.runFrameAnimations(...props);
}

export function useStageAnimations() {
  stageZero.useAnimations();
  stageOne.useAnimations();
  stageTwo.useAnimations();
  stageThree.useAnimations();
  stageFour.useAnimations();
  stageFive.useAnimations();
  stageReset.useAnimations();
}
