import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable';
import { Resizable } from "re-resizable"

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

export default function PianoRoll({numOfSteps = 8}) {
  const { height, width } = useWindowDimensions();

  return (
    <div>
      <Keyboard />
      <Grid />
    </div>
  )
}

function Grid() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true)
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "n") {
      console.log("new note");
    }
  }

  return (
    <div className="box" style={{height: '300px', width: '1200px', position: 'relative', overflow: 'auto', padding: '0'}}>
      <div style={{height: '1000px', width: '2000px', padding: '10px', border: "1px solid black", backgroundColor: "grey"} }>
        <Note />
        <Note />
      </div>
    </div>
  )
}

function Note() {
  const [area, setArea] = useState({width: 320, height: 30});

  return (
  <Draggable handle="#handle" grid={[25, 25]} bounds="parent">
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
          Sample piano roll note
        </div>
      </Resizable>
  </Draggable>
  )

}

