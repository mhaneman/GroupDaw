import React from "react";
import * as Tone from "tone";
import { PanVol } from "tone";

import styles from "./DrumMachine.module.scss";

const NOTE = "C2";

type Track = {
  id: number;
  sampler: Tone.Sampler;
};

type Props = {
  samples: { url: string; name: string }[];
  numOfSteps?: number;
};

export default function DrumMachine({ samples, numOfSteps = 8 }: Props) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const tracksRef = React.useRef<Track[]>([]);
  const stepsRef = React.useRef<HTMLInputElement[][]>([[]]);
  const lampsRef = React.useRef<HTMLInputElement[]>([]);
  const seqRef = React.useRef<Tone.Sequence | null>(null);

  const trackIds = [...Array(samples.length).keys()] as const;
  const stepIds = [...Array(numOfSteps).keys()] as const;

  const handleStartClick = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  const handleClear = () => {
    stepsRef.current.forEach((instr) => instr.forEach((s) => s.checked = false));
  }

  const handleTechno = () => {
    handleClear();

    stepsRef.current[0]
      .filter((e, i) => {return (i % 2) === 0})
      .forEach((s) => s.checked = true);
    stepsRef.current[3]
      .filter((e, i) => {return i % 4 === 0})
      .forEach((s) => s.checked = true);
  }

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Transport.bpm.value = Number(e.target.value);
  };

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  const handleMasterPanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const panVol = new Tone.PanVol(-0.25, -12)
    Tone.Destination.chain(panVol);
  };

  const handleChannelVolumeChange = (e: React.ChangeEvent<HTMLInputElement>, i) => {
    tracksRef.current[i].sampler.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  React.useEffect(() => {
    // assign each raw sound bite to a Tone sampler
    tracksRef.current = samples.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sample.url,
        },
      }).toDestination(),
    }));

    // create a new Tone Sequence and apply the steps
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.map((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time);
          }
          // visually show dot for current step
          lampsRef.current[step].checked = true;
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



  return (
    <div className={styles.machine}>

      {/* layout channel names */}
      <div className={styles.labelList}>
        {samples.map((sample, i) => (
          <>
            <div>{sample.name}</div>
            <label className={styles.fader}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                onChange={(e) => handleChannelVolumeChange(e, i)}
                defaultValue={120}
              />
          </label>
          </>
        ))}
      </div>

      <div className={styles.grid}>

        {/* map checked boxes to Tone */}
        <div className={styles.row}>
          {stepIds.map((stepId) => (
            <label className={styles.lamp}>
              <input
                type="radio"
                name="lamp"
                id={"lamp" + "-" + stepId}
                disabled
                ref={(elm) => {
                  if (!elm) return;
                  lampsRef.current[stepId] = elm;
                }}
                className={styles.lamp__input}
              />
              <div className={styles.lamp__content} />
            </label>
          ))}
        </div>
        

        {/* draw grid and enable / disable boxes */}
        <div className={styles.cellList}>
          {trackIds.map((trackId) => (
            <div key={trackId} className={styles.row}>
              {stepIds.map((stepId) => {
                const id = trackId + "-" + stepId;
                return (
                  <label className={styles.cell}>
                    <input
                      key={id}
                      id={id}
                      type="checkbox"
                      ref={(elm) => {
                        if (!elm) return;
                        if (!stepsRef.current[trackId]) {
                          stepsRef.current[trackId] = [];
                        }
                        stepsRef.current[trackId][stepId] = elm;
                      }}
                      className={styles.cell__input}
                    />
                    <div className={styles.cell__content} />
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* global controls */}
      <div className={styles.controls}>
        <button onClick={handleStartClick} className={styles.button}>
          {isPlaying ? "Pause" : "Start"}
        </button>

        <button onClick={handleClear} className={styles.button}>
          Clear
        </button>

        <button onClick={handleTechno} className={styles.button}>
          Techno
        </button>

        <label className={styles.fader}>
          <span>BPM {Math.trunc(Tone.Transport.bpm.value)}</span>
          <input
            type="range"
            min={30}
            max={300}
            step={1}
            onChange={handleBpmChange}
            defaultValue={120}
          />
        </label>

        <label className={styles.fader}>
          <span> Master Vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            onChange={handleMasterVolumeChange}
            defaultValue={1}
          />
        </label>

        <label className={styles.fader}>
          <span> Master Pan</span>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.01}
            onChange={handleMasterPanChange}
            defaultValue={0}
          />
        </label>
      </div>
    </div>
  );
}
