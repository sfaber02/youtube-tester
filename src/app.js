import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';

import './style.css';

import song from './audio/NorthByNorth.mp3';
import song2 from "./audio/02 Hol' Up.flac";
import song3 from "./audio/01 - Opening.mp3"

import { Effects } from './effects.js'

const App = () => {
    const [starter, setStarter] = useState(false);

    useEffect(() => {
        if (starter) {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const audioElement = document.querySelector('audio');
            console.log(audioElement);
            const mediaElement = ctx.createMediaElementSource(audioElement);

            //EFFECT CHAIN 1
            // const filter = ctx.createBiquadFilter();
            // filter.frequency.value = 100;

            // const compressor = ctx.createDynamicsCompressor();
            // compressor.ratio.value = 5;
            // compressor.threshold.value = -50;

            // const delay = ctx.createDelay();
            // delay.delayTime.value = .5;


            // mediaElement.connect(delay);
            // delay.connect(filter);
            // filter.connect(compressor);

            // compressor.connect(ctx.destination);


            // EFFECT CHAIN 2
            const delayNode = ctx.createDelay(100)
            const feedbackNode = ctx.createGain();
            const bypassNode = ctx.createGain();
            const masterNode = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            const filter2 = ctx.createBiquadFilter()

            // .02 .05 1  = slapback delay 
            delayNode.delayTime.value = .02;
            feedbackNode.gain.value = .05;
            bypassNode.gain.value = 1;
            filter.frequency.value = 6000;
            filter2.frequency.value = 6000;

            //wire up nodes
            mediaElement.connect(delayNode);
            delayNode.connect(feedbackNode);
            feedbackNode.connect(delayNode);

            delayNode.connect(bypassNode);
            bypassNode.connect(filter);
            filter.connect(masterNode);
            mediaElement.connect(filter2);
            filter2.connect(masterNode);

            masterNode.connect(ctx.destination);

            mediaElement.connect(ctx.destination);

        }


    }, [starter])


    const start = () => setStarter(p => !p);









    return (
        <>
            <audio src={song2} controls></audio>
            <button onClick={start}>turn effects on</button>
            
        </>
    );
}



export { App };