import React, { useState, useRef, useEffect } from 'react';

import './styles.css';

import video from './spring.mp4';

export const Player = () => {

    const [ isPlaying, setPlaying ] = useState(false);
    const [ progress, setProgress ] = useState(0);
    const [ isProgressCaturing, setProgressCaturing ] = useState(0);
    const [ volume, setVolume ] = useState('0.5');
    const [ speed, setSpeed ] = useState('1');

    /**
     * Create ref for video
     * Ref - link for htmlEl
     */

    const videoRef = useRef(null);

    const togglePlay = () => {
        const method = videoRef.current.paused ? 'play' : 'pause';
        
        videoRef.current[ method ]();
        setPlaying(method === 'play');
    };

    const skip = (event) => {
      const seconds = event.target.dataset.skip;

      videoRef.current.currentTime += Number.parseFloat(seconds);
    };


    const handleRangeUpdate = (event) => {
        const { name, value } = event.target;

        videoRef.current[ name ] = value;

        if (name === 'volume') {
            setVolume(value);
        } else if (name === 'playbackRate') {
            setSpeed(value);
        }
    };


    const  handleProgress = () => {
      const progress = videoRef.current.currentTime / videoRef.current.duration * 100;
      
      setProgress(progress);
    };

    const scrub = (event) => {
      const scrubTime = event.nativeEvent.offsetX / event.currentTarget.offsetWidth
      * videoRef.current.duration;

      videoRef.current.currentTime = scrubTime;
    };

    const fullscreen = () => {
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        } else if (videoRef.current.mozRequestFullScreen) {
            /* Firefox */
            videoRef.current.mozRequestFullScreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
            /* Chrome, Safari, Opera */
            videoRef.current.webkitRequestFullscreen();
        } else if (videoRef.current.msRequestFullscreen) {
            /* IE/Edge */
            videoRef.current.msRequestFullscreen();
        }
    };

    const playControl = isPlaying ? <>&#10074;&#10074;</> : <>&#9654;</>;

    useEffect(() => {
      const handleKeydown = (event) => {
          if (event.code === 'Space') {
            togglePlay();
          }
      };

      document.addEventListener('keydown', handleKeydown);

      return () => document.removeEventListener('keydown', handleKeydown);
    }, []);


    return (
        <div className = 'player'>
            <video 
                    ref = { videoRef }
                    src = { video } 
                    onClick = { togglePlay }
                    onTimeUpdate = { handleProgress }
                    />
            <div className = 'controls'>
                <div 
                    className = 'progress' 
                    onClick = { scrub }
                    onMouseDown = { () => setProgressCaturing(true) }
                    onMouseMove = { (event) => isProgressCaturing && scrub(event) }
                    onMouseUp = { () => setProgressCaturing(false) }
                >
                <div 
                    className = 'filled' 
                    style = {{
                          '--filledProgressBar': `${ progress }%`,
                    }}
                />
                </div>
                <button 
                    title = 'Toggle Play'
                    onClick = { togglePlay }
                    >{playControl}</button>
                <input
                    className = 'slider'
                    max = '1'
                    min = '0'
                    name = 'volume'
                    step = '0.05'
                    type = 'range'
                    value = { volume }
                    onChange = { handleRangeUpdate }
                />
                <input
                    className = 'slider'
                    max = '2'
                    min = '0.5'
                    name = 'playbackRate'
                    step = '0.1'
                    type = 'range'
                    value = { speed }
                    onChange = { handleRangeUpdate }
                />
                <button 
                    data-skip = '-10'
                    onClick = { skip }
                >
                « 10s
                </button>
                <button 
                      data-skip = '25'
                      onClick = { skip }
                > 25s 
                »</button>
                <button onClick = { fullscreen }>&#10021;</button>
            </div>
        </div>
    );
};
