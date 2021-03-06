import React, { useEffect, useState, useCallback } from "react";
import YouTube from "react-youtube";

import "./style.css";

import song from "./audio/NorthByNorth.mp3";
import song2 from "./audio/02 Hol' Up.flac";
import song3 from "./audio/01 - Opening.mp3";

import { Effects } from "./effects.js";

const App = () => {
   const [starter, setStarter] = useState(false);
   const [id, setId] = useState();
   const [songDl, setSongDl] = useState();

   useEffect(() => {
      if (starter) {
         const ctx = new (window.AudioContext || window.webkitAudioContext)();
         let audio;
         fetch(
            "http://www.shawnfaber.com/audio/01%20-%20Metronomic%20Underground%20-%20USEE19694710%20-%20355425551.flac"
         )
            .then(data => data.arrayBuffer())
            .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
            .then(decodedAudio => {
               audio = decodedAudio;
               const playSound = ctx.createBufferSource();
               playSound.buffer = audio;
               // playSound.connect(ctx.destination);

               const canvas = document.getElementById("canvas");
               canvas.width = window.innerWidth;
               canvas.height = window.innerHeight;
               const canvasCtx = canvas.getContext("2d");

               // EFFECT CHAIN 2
               const delayNode = ctx.createDelay(100);
               const feedbackNode = ctx.createGain();
               const bypassNode = ctx.createGain();
               const masterNode = ctx.createGain();
               const filter = ctx.createBiquadFilter();
               const filter2 = ctx.createBiquadFilter();
               const analyser = ctx.createAnalyser();

               // .02 .05 1  = slapback delay
               delayNode.delayTime.value = 0.02;
               feedbackNode.gain.value = 0.05;
               bypassNode.gain.value = 1;
               filter.frequency.value = 20000;
               filter2.frequency.value = 20000;

               //wire up nodes
               playSound.connect(analyser);
               analyser.connect(delayNode);
               delayNode.connect(feedbackNode);
               feedbackNode.connect(delayNode);

               delayNode.connect(bypassNode);
               bypassNode.connect(filter);
               filter.connect(masterNode);
               playSound.connect(filter2);
               filter2.connect(masterNode);

               masterNode.connect(ctx.destination);

               playSound.connect(ctx.destination);

               //set up analyser
               console.log(canvas.height, canvas.width);
               analyser.fftSize = 32768;
               let bufferLength = analyser.frequencyBinCount;
               let dataArray = new Uint8Array(bufferLength);
               const barWidth = (canvas.width / bufferLength) * 50;
               let barHeight;
               let x = 0;

               // render visualizer
               const renderFrame = () => {
                  requestAnimationFrame(renderFrame);
                  x = 0;
                  // console.log (analyser);

                  analyser.getByteFrequencyData(dataArray);

                  canvasCtx.fillStyle = "rgba(0,0,0,0.2)"; // Clears canvas before rendering bars (black with opacity 0.2)
                  canvasCtx.fillRect(0, 0, canvas.width, canvas.height); // Fade effect, set opacity to 1 for sharper rendering of bars

                  let r, g, b;
                  let bars = 100;

                  for (let i = 0; i < bars; i++) {
                     barHeight = dataArray[i] * 2;
                     // console.log (dataArray[i]);
                     if (dataArray[i] > 210) {
                        // pink
                        r = 250;
                        g = 0;
                        b = 255;
                     } else if (dataArray[i] > 200) {
                        // yellow
                        r = 250;
                        g = 255;
                        b = 0;
                     } else if (dataArray[i] > 190) {
                        // yellow/green
                        r = 204;
                        g = 255;
                        b = 0;
                     } else if (dataArray[i] > 180) {
                        // blue/green
                        r = 0;
                        g = 219;
                        b = 131;
                     } else {
                        // light blue
                        r = 0;
                        g = 199;
                        b = 255;
                     }

                     canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
                     canvasCtx.fillRect(
                        x,
                        canvas.height - barHeight,
                        barWidth,
                        barHeight
                     );

                     x += barWidth + 10;
                  }
               };

               renderFrame();

               playSound.start(ctx.currentTime);
            });

         // //EFFECT CHAIN 1
         // const filter = ctx.createBiquadFilter();
         // filter.frequency.value = 100;

         // const compressor = ctx.createDynamicsCompressor();
         // compressor.ratio.value = 5;
         // compressor.threshold.value = -50;

         // const delay = ctx.createDelay();
         // delay.delayTime.value = .5;
         // compressor.connect(ctx.destination);

         // playSound.connect(delay);
         // delay.connect(filter);
         // filter.connect(compressor);
      }
   }, [starter]);

   const start = () => setStarter(p => !p);

   return (
      <>
         {/* <audio src="http://www.shawnfaber.com/audio/01%20-%20Loved.mp3" controls id='audio1' ></audio> */}
         <button onClick={start}>play!</button>
         <canvas id="canvas"></canvas>
      </>
   );
};

export { App };

// src="https://docs.google.com/uc?export=download&id=1iDB9q09v0xwjacN-B_eOt46MUUtY7jQS"
//https://drive.google.com/file/d/1uiKkjHicQRtvM8yIE3AwzPk07EJ6C2_L/view?usp=sharing

{
   /* <iframe src="https://onedrive.live.com/embed?cid=E4CE765BDF958D1E&resid=E4CE765BDF958D1E%211634&authkey=ACj7wxnsIn6LlyA" width="98" height="120" frameborder="0" scrolling="no"></iframe> */
}
