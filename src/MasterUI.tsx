import React from 'react'
import * as Tone from "tone";

type Props = {
  isPlaying: any;
  setIsPlaying: any;
};

export default function MasterUI({ isPlaying, setIsPlaying}: Props) {
  
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

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      Tone.Transport.bpm.value = Number(e.target.value);
  };

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  return (
    <div>
        <button onClick={handleStartClick} className="btn-primary">
          {isPlaying ? "Pause" : "Start"}
        </button>

        <label className="fader">
          <span>BPM </span>
          <input
            type="range"
            min={30}
            max={300}
            step={1}
            onChange={handleBpmChange}
            defaultValue={120}
          />
        </label>
    </div>
  )
}