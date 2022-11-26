import React from 'react'
import * as Tone from "tone";

import styles from "./DrumMachine.module.scss";

type Track = {
  id: number;
  note: String;
};

type Props = {
  numOfSteps?: number;
};

export default function Synth({numOfSteps = 16 }: Props) {
  var channel = new Tone.Channel().toDestination();
  channel.volume.value = Tone.gainToDb(Number(0.1));

  const sampler = new Tone.Sampler({
    urls: {
      D3: "/bp_synth_samples/25.wav",
      D4: "/bp_synth_samples/37.wav",
    },
  }).connect(channel);

  const seq = new Tone.Sequence((time, note) => {
    sampler.triggerAttackRelease(note, 0.1, time);
  }, ["C#4", ["E#4", "D#4"], "G#4", ["A#4", "G#4"]]).start(0);

  return (
    <div>
      Synth
    </div>
  )
}