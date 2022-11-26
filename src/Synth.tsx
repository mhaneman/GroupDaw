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

  const seqRef = React.useRef<Tone.Sequence | null>(null);

  const pitchesRef = React.useRef<Track[]>([]);
  const pitchesIds = [...Array(8).keys()] as const;

  const stepsRef = React.useRef<HTMLInputElement[][]>([[]]);
  const stepIds = [...Array(numOfSteps).keys()] as const;

  // const seq = new Tone.Sequence((time, note) => {
  //   sampler.triggerAttackRelease(["C#4", "E#4", "G#4", note], 0.1, time);
  // }, ["B#4"]).start(0);

  // TODO create a 2d list 
  // [[C, C#, D, etc], [C, C#, D, etc]]

  /*

  seqRef.current = new Tone.Sequence(
    (time, step) => {
      var all_pitches: String[] = [];
      pitchesRef.current.map((pitch) => {
        if (stepsRef.current[pitch.id]?.[step]?.checked) {
          all_pitches.push(pitch.note)
        }
        sampler.triggerAttack(all_pitches, time)
      });
    },
    [...stepIds],
    "16n"
  );
  seqRef.current.start(0);

  return () => {
    seqRef.current?.dispose();
    tracksRef.current.map((trk) => void trk.sampler.dispose());
  };
}, [samples, numOfSteps]);

*/


  return (
    <div>
      Synth
    </div>
  )
}