import { useState } from 'react'
import * as Tone from "tone";

import styles from "./DrumMachine.module.scss";

type Track = {
  id: number;
  note: String;
};

type Props = {
  numOfSteps?: number;
};

export default function SynthSampler({numOfSteps = 16 }: Props) {
  var channel = new Tone.Channel().toDestination();
  channel.volume.value = Tone.gainToDb(Number(0.1));

  const sampler = new Tone.Sampler({
    urls: {
      D3: "/bp_synth_samples/25.wav",
      D4: "/bp_synth_samples/37.wav",
    },
  }).connect(channel);


  const seq = new Tone.Sequence((time, note) => {
    sampler.triggerAttackRelease(["C#4", "E#4", "G#4", note], 0.1, time);
  }, ["B#4"]).start(0);

  // TODO create a 2d list 
  // [[C, C#, D, etc], [C, C#, D, etc]]





  return (
    <div>
      Synth
    </div>
  )
}