import React, { useState, useEffect } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { Button } from './components/Button';
import { Inputfile } from './components/Inputfile';
import { Header } from './components/Header';
import { Resultimg } from './components/Resultimg';
import { Inputvideo } from './components/Inputvideo';


const ffmpeg = createFFmpeg({log: true})

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'video1.mp4', await fetchFile(video));
    await ffmpeg.run('-i', 'video1.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');
    const data = ffmpeg.FS('readFile', 'out.gif');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif'}));
    setGif(url)
  }

  return ready ? (
    <div className="App">
      <Header/>
      {video && <Inputvideo video={video} />  }
      <Inputfile setVideo={setVideo} />
      <Button convertToGif={convertToGif} />
      <h1>Result</h1>
      { gif && <Resultimg gif={gif} /> }
    </div>
  ):
  ( <p>Loading...</p> )
}

export default App;
