import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable';
import { Resizable } from "re-resizable"

import * as Tone from "tone";

import styles from './PianoRoll.module.scss'

import Keyboard from './Keyboard';

export default function PianoRoll({schedule}) {

  var channel = new Tone.Channel().toDestination();
  channel.volume.value = Tone.gainToDb(Number(0.3));

  const sampler = new Tone.Sampler({
    urls: {
      D3: "/bp_synth_samples/25.wav",
      D4: "/bp_synth_samples/37.wav",
    },
  }).connect(channel);

  const [measures, setMeasures] = useState(2);
  const [area, setArea] = useState({width: 1600, height: 600});
  const [gridGap, setgridGap] = useState(25);
  const [notes, setNotes] = useState([{x: 0, y:0}]);

  const piano_roll_editor_style = {
    height: '1000px', 
    width: '2000px', 
    background: `repeating-linear-gradient(180deg, #22222280, #22222280 ${gridGap}px, #33333380 ${gridGap}px, #33333380 ${gridGap * 2}px), 
      repeating-linear-gradient(to right, transparent 0, transparent ${gridGap * 8 - 4}px, #000 ${gridGap * 8}px),
      repeating-linear-gradient(to right, transparent 0, transparent ${gridGap * 4 - 3}px, #707070 ${gridGap * 4}px),
      repeating-linear-gradient(to right, transparent 0, transparent ${gridGap - 2}px, #ff333380 ${gridGap}px)`,
    backgroundSize: 'cover'
  }

  // doesnt work. need to figure out why
  const handleAddNewNote = (event) => {
    var bounds = event.target.getBoundingClientRect();
    const local_x = event.clientX - bounds.left;
    const local_y = event.clientY - bounds.top;

    const quant_x = gridGap*Math.floor(local_x/gridGap)
    const quant_y = gridGap*Math.floor(local_y/gridGap)

    setNotes([...notes, {x:quant_x, y:quant_y}]);
  }

  const handlePlusSize = () => {
    setgridGap(gridGap + 10);
    console.log(gridGap);
  }

  const handleMinusSize = () => {
    setgridGap(gridGap - 10);
  }

  return (
    <div className="" onDoubleClick={handleAddNewNote}>
      <button onClick={handleMinusSize}>-</button>
      <button onClick={handlePlusSize}>+</button>

      <Resizable className={styles.piano_roll} style={{position: 'relative', overflow: 'auto', padding: '0', overflowY: 'visible'}}
        size={{ width: area.width, height: area.height }}
        onResizeStop={(e, direction, ref, d) => {
          setArea({
            width: area.width + d.width,
            height: area.height + d.height,
          });
        }}>
        <Keyboard instr={sampler} gridGap={gridGap}/>
        <div style={piano_roll_editor_style}>
          {notes.map((note) => <Note instr={sampler} gridGap={gridGap} init_pos={note} measures={measures} />)}
        </div>
      </Resizable>
    </div>
  )
}

type NoteProps = {
  instr: any,
  gridGap: any,
  init_pos: any,
  measures: any,
  isLoopMode: boolean
};


function Note({instr, gridGap, init_pos, measures}: NoteProps) {
  const [pos, setPos] = useState(init_pos);
  const [area, setArea] = useState({width:100, height: gridGap});

  const noteRef = React.useRef<Tone.ToneEvent | null>(null); 

  // need a use effect to reposition and resize notes

  useEffect(() => {
    const pitches = ["C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3"];
    var pitch = pitches.at((pitches.length - 1) - pos.y / gridGap);

    noteRef.current = new Tone.ToneEvent(((time, chord) => {
      instr.triggerAttackRelease(chord, 0.5, time);
    }), pitch);

    const dev = Math.pow(Tone.Transport.bpm.value / 60, -1) / (8 * gridGap); // converts x-pos to time
    noteRef.current.start(pos.x * dev);
    // noteRef.current.loop = 8;
    noteRef.current.loop = true;
    noteRef.current.loopEnd = `${measures}m`;

    return () => {
      noteRef.current?.dispose();
    };
  }, [pos]);

  const handleDrag = (e, ui) => {
  const {x, y} = pos;
    setPos({
        x: x + ui.deltaX,
        y: y + ui.deltaY,
    });
  };

  const handleArea = (d) => {
    setArea({
        width: area.width + d.width,
        height: area.height
    });
  }

  return (
    <Draggable handle="#handle" grid={[gridGap, gridGap]} bounds="parent" defaultPosition={init_pos} onDrag={handleDrag}>
      <Resizable
        size={{ width: area.width, height: gridGap }}
        style={{position: "absolute", border: "1px solid black"}}
        onResizeStop={(e, direction, ref, d) => handleArea(d)}>
          
          <div id="handle" style={{backgroundColor: "#25838a", color:"white"}}>
            {pos.x.toFixed(0)} {pos.y.toFixed(0)}
          </div>
        </Resizable>
    </Draggable>
    );
}

