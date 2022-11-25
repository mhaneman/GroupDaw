import React from "react";
import * as Tone from "tone";

import styles from "./DrumMachine.module.scss";

const NOTE = "C2";

type Track = {
  id: number;
  sampler: Tone.Sampler;
};

type Props = {
  isPlaying: any;
  setIsPlaying: any;
  samples: { url: string; name: string }[];
  numOfSteps?: number;
};

export default function DrumMachine({ isPlaying, setIsPlaying, samples, numOfSteps = 8 }: Props) {
  var channel = new Tone.Channel().toDestination();

  const tracksRef = React.useRef<Track[]>([]);
  const stepsRef = React.useRef<HTMLInputElement[][]>([[]]);
  const lampsRef = React.useRef<HTMLInputElement[]>([]);
  const seqRef = React.useRef<Tone.Sequence | null>(null);

  const trackIds = [...Array(samples.length).keys()] as const;
  const stepIds = [...Array(numOfSteps).keys()] as const;

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

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  const handleMasterPanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    channel.pan.value = Number(e.target.value);
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
      }).connect(channel),
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
      {/* styles.labelList */}
      <div className="place-self-end flex flex-col gap-y-4">
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

      {/* styles.grid */}
      <div className="flex flex-col gap-y-2">

        {/* map checked boxes to Tone */}
        {/* styles.row -> missing: nth-child */}
        <div className="flex gap-x-2">
          {stepIds.map((stepId) => (
            // styles.lamp
            <label className="">
              <input
                type="radio"
                name="lamp"
                id={"lamp" + "-" + stepId}
                disabled
                ref={(elm) => {
                  if (!elm) return;
                  lampsRef.current[stepId] = elm;
                }}
                // styles.lamp__input
                className="invisibleInput checked:bg-[#ff5b06]"
              />
              {/* styles.lamp__content */}
              <div className="w-4 h-4 mx-2 rounded-lg bg-[#ccc]" />
            </label>
          ))}
        </div>
        

        {/* draw grid and enable / disable boxes */}
        {/* styles.cellList */}
        <div className="flex flex-col gap-y-2">
          {trackIds.map((trackId) => (
            // styles.row -> need to add nth-child logic
            <div key={trackId} className="flex gap-x-2 ">
              {stepIds.map((stepId) => {
                const id = trackId + "-" + stepId;
                return (
                  // styles.cell
                  <label className="cursor-pointer">
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
                      // styles.cell__input
                      className="invisibleInput checked:bg-[#005da5]"
                    />
                    {/* styles.cell__content */}
                    <div className="w-8 h-10 rounded-[3px] bg-[#ccc]" />
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* local controls */}
      {/* styles.controls --> missing: "grid-column: 2*/}
      <div className="flex items-center gap-x-4">
      
        <button onClick={handleClear} className="btn-primary">
          Clear
        </button>

        <button onClick={handleTechno} className="btn-primary">
          Techno
        </button>

        
        <label className="fader">
          <span> Channel Vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            onChange={handleMasterVolumeChange}
            defaultValue={1}
          />
        </label>

        <label className="fader">
          <span> Channel Pan</span>
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
