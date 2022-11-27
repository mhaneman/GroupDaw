import React from "react";

import DrumMachine from "./DrumMachine";
import Keyboard from "./Keyboard";
import MasterUI from "./MasterUI";


export default function App() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  return (
    <>
      <MasterUI 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        />
      <DrumMachine
        samples={[
          { url: "/hat-closed.wav", name: "CH" },
          { url: "/clap.wav", name: "CL" },
          { url: "/snare.wav", name: "SD" },
          { url: "/kick.wav", name: "BD" },
        ]}
      />

      <DrumMachine
        samples={[
          { url: "/hat-closed.wav", name: "CH" },
          { url: "/clap.wav", name: "CL" },
          { url: "/snare.wav", name: "SD" },
          { url: "/kick.wav", name: "BD" },
        ]}
      />

      <Keyboard />
    </>
  );
}
