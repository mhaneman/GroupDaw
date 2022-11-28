import React from 'react'
import * as Tone from "tone";

import styles from './PianoRoll.module.scss'

type Prop = {
    sampler: Tone.Sampler
};

export default function Keyboard() {
  var channel = new Tone.Channel().toDestination();
  channel.volume.value = Tone.gainToDb(Number(0.5));

  const sampler = new Tone.Sampler({
    urls: {
      D3: "/bp_synth_samples/25.wav",
      D4: "/bp_synth_samples/37.wav",
    },
  }).connect(channel);
  
    const pitches = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3"];
    const handleClick = (name: any) => {
        sampler.triggerAttack(name);
    };

    return (
    <div className={styles.keyboard}>
        {pitches.map((pitch) => <Key name={pitch} action={handleClick}/>)}
    </div>
    )
}

type KeyProp = {
    name: String;
    action: any;
}



const Key = ({name, action}: KeyProp) => {

    if (name.includes("#")) {
        return (
        <button onClick={() => action(name)} 
            style={{backgroundColor: "black", color:"white", width:"50px", height:"25px"}}> 
            {name} </button>);
    }
    return (<button onClick={()=> action(name)} 
        style={{backgroundColor: "white", color:"black", width:"50px", height:"25px"}}> 
        {name} </button>);
}