import React from 'react'
import * as Tone from "tone";

import styles from './PianoRoll.module.scss'

export default function Keyboard({instr, gridGap}) {
  
    const pitches = ["C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3"];
    const handleClick = (name: any) => {
        instr.triggerAttack(name);
    };

    return (
    <div className={styles.keyboard}>
        {pitches.map((pitch) => <Key name={pitch} action={handleClick} h={gridGap}/>)}
    </div>
    )
}

type KeyProp = {
    name: String;
    action: any;
    h: any;
}



const Key = ({name, action, h}: KeyProp) => {

    let inlineSyle = {
        width: '50px',
        backgroundColor: '',
        color: '',
        height: `${h}px`
    }

    if (name.includes('#')) {
        inlineSyle.color = 'white'
        inlineSyle.backgroundColor = 'black'
    } else {
        inlineSyle.color = 'black'
        inlineSyle.backgroundColor = 'white'
    }

    return (
    <button onClick={() => action(name)}
        style={inlineSyle}> 
        {name} </button>);

}