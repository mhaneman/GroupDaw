import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable';
import { Resizable } from "re-resizable"

import * as Tone from "tone";

import styles from './PianoRoll.module.scss'

import useWindowDimensions from './hooks/useWindowDimensions';
import Keyboard from './Keyboard';

// TODO 

// 1.
// create boxes than can be resized on the right side -- done
// these boxes are draggable when selected in the middle -- done

// 2. 
// create grid -- kinda 
// add a piano on the side -- in progress

// 3
// these boxes snap to quarter note sections -- kinda
// double click to add a new box

// 4
// export the note pitch and time

export default function PianoRoll({numOfSteps = 16}) {

  var channel = new Tone.Channel().toDestination();
  channel.volume.value = Tone.gainToDb(Number(0.5));

  const sampler = new Tone.Sampler({
    urls: {
      D3: "/bp_synth_samples/25.wav",
      D4: "/bp_synth_samples/37.wav",
    },
  }).connect(channel);

  const bc_style = {
    height: '1000px', 
    width: '2000px', 
    background: 'repeating-linear-gradient(180deg, #222, #222 25px,#333 25px, #333 50px)',
    // background: 'repeating-linear-gradient(90deg, rgba(34,34,34,0.2), rgba(34,34,34,0.2) 25px,rgba(50,50,50,0.2) 25px, rgba(50,50,50,0.2) 50px), repeating-linear-gradient(180deg, rgba(34,34,34,0.8), rgba(34,34,34,0.8) 25px,rgba(50,50,50,0.8) 25px, rgba(50,50,50,0.8) 50px)',
    backgroundSize: 'cover'
  }

  return (
    <div className="">
      <Measures />
      <div className={styles.piano_roll} style={{height: '300px', width: '1200px', position: 'relative', overflow: 'auto', padding: '0'}}>
        <Keyboard />
        <div style={bc_style}>
          <Note />
        </div>
      </div>
    </div>
  )
}

function Measures() {
  return (
    <div>
      Measures
    </div>);
}


// change this to a class --> get property of position
// with the get property of position --> return a note value
// with the get property of position --> return a time

function Note() {
  const [area, setArea] = useState({width: 320, height: 25});
  
  const [state, setState] = useState({
    deltaPosition: {
      x: 0, y: 0
    },
  });

  const handleDrag = (e, ui) => {
    const {x, y} = state.deltaPosition;
    setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  };

  const {deltaPosition } = state;
    
  return (
  <Draggable handle="#handle" grid={[25, 25]} bounds="parent" onDrag={handleDrag}>
    <Resizable
      size={{ width: area.width, height: area.height }}
      style={{border: "1px solid black"}}
      onResizeStop={(e, direction, ref, d) => {
        setArea({
          width: area.width + d.width,
          height: area.height,
        });
      }}
      >
        <div id="handle" style={{backgroundColor: "blue", color:"white"}}>
          Sample note -- x: {state.deltaPosition.x.toFixed(0)}, y: {state.deltaPosition.y.toFixed(0)}
        </div>
      </Resizable>
  </Draggable>
  )

}

