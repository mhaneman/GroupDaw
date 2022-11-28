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
// create grid -- done 
// add a piano on the side -- done

// 3
// these boxes snap to quarter note sections -- kinda
// double click to add a new note -- done

// 4
// schedule notes to play right pitch and time

export default function PianoRoll({numOfSteps = 16}) {

  var channel = new Tone.Channel().toDestination();
  channel.volume.value = Tone.gainToDb(Number(0.3));

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

  const [area, setArea] = useState({width: 1200, height: 300});

  const [notes, setNotes] = useState([{x: 0, y:0}]);

  const handleAddNewNote = (event) => {
    const local_x = event.clientX - event.target.offsetLeft;
    const local_y = event.clientY - event.target.offsetTop;
    setNotes([...notes, {x:local_x, y:local_y}]);
  }

  return (
    <div className="" onDoubleClick={handleAddNewNote}>
      <Resizable className={styles.piano_roll} style={{position: 'relative', overflow: 'auto', padding: '0'}}
        size={{ width: area.width, height: area.height }}
        onResizeStop={(e, direction, ref, d) => {
          setArea({
            width: area.width + d.width,
            height: area.height + d.height,
          });
        }}>
        <Keyboard />
        <div style={bc_style}>
          {notes.map(() => <Note instr={sampler}/>)}
        </div>
      </Resizable>
    </div>
  )
}


// double click --> remove this note
// need to convert note pos to absolute position
function Note({instr}) {
  
  // need to create an absolute position
  const [pos, setPos] = useState({x:0, y:0});
  const [area, setArea] = useState({width:400, height: 25});

  const noteRef = React.useRef<Tone.ToneEvent | null>(null); 

  useEffect(() => {

    // need to convert y-pos to pitch
    const pitches = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3"];
    var pitch = pitches.at(pos.y / 25);

    noteRef.current = new Tone.ToneEvent(((time, chord) => {
      instr.triggerAttackRelease(chord, 0.5, time);
    }), pitch);

    const dev = Math.pow(Tone.Transport.bpm.value / 60, -1) / (16 * 25); // converts x-pos to time
    noteRef.current.start(pos.x * dev);
    // noteRef.current.loop = 8;
    noteRef.current.loop = true;
    noteRef.current.loopEnd = "1m";

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
    <Draggable handle="#handle" grid={[25, 25]} bounds="parent" defaultPosition={{x:0, y: 0}} onDrag={handleDrag}>
      <Resizable
        size={{ width: area.width, height: area.height }}
        style={{border: "1px solid black"}}
        onResizeStop={(e, direction, ref, d) => handleArea(d)}>
          
          <div id="handle" style={{backgroundColor: "#25838a", color:"white"}}>
            Sample note -- x: {pos.x.toFixed(0)}, y: {pos.y.toFixed(0)}
          </div>
        </Resizable>
    </Draggable>
    );
}

