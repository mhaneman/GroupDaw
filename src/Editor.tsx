import React, { useState } from 'react'
import * as Tone from "tone";

import PianoRoll from './PianoRoll';

export default function Editor() {
  const [midis, setMidis] = useState([]);

  const handleNewInstr = () => {
  }

  return (
    <div>
      <button onClick={handleNewInstr}> new instrument </button>
    </div>
  )
}