import React from "react";

const Effects = () => {
    
    const ctx = new(window.AudioContext || window.webkitAudioContext)();
    const audioElement = document.querySelector('audio');
    console.log (audioElement);

    return (
        <>
        </>
    )
}

export { Effects };