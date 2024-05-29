import BoxContainer from './components/BoxContainer/BoxContainer';
import Box from './components/Box/Box';
import './App.css';
import { useState, useEffect } from 'react';
import Message from './components/Message/Message';

function App() {
    const SHUTDOWN_MS_PLAYING  = 200;
    const SHUTDOWN_MS_NPLAYING = 500;

    const [colors, setColors] = useState({
        red: {
            state: false,
            last_modification: Date.now()
        },
        green: {
            state: false,
            last_modification: Date.now()
        },
        blue: {
            state: false,
            last_modification: Date.now()
        },
        yellow: {
            state: false,
            last_modification: Date.now()
        }
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [lastSequence, setLastSequence] = useState([]);
    const [sequence, setSequence] = useState([]);
    const [sequenceLength, setSequenceLength] = useState(1);
    const [lastTurnedOff, setLastTurnedOff] = useState(Date.now());
    const [nowSequence, setNowSequence] = useState([]);
    const [hasBeenInit, setHasBeenInit] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const resetAll = () => {
        setColors({
            red: {
                state: false,
                last_modification: Date.now()
            },
            green: {
                state: false,
                last_modification: Date.now()
            },
            blue: {
                state: false,
                last_modification: Date.now()
            },
            yellow: {
                state: false,
                last_modification: Date.now()
            }
        });
        setSequence([]);
        setSequenceLength(1);
        setNowSequence([]);
        setLastSequence([]);
        setIsGameOver(false);
        setIsPlaying(false);
        setLastTurnedOff(Date.now());
    };

    const registerClick = (color) => {
        let new_colors = { ... colors };
        if (!new_colors[color].state)
        {
            new_colors[color] = {
                state: true,
                last_modification: Date.now()
            };
            // console.log(new_colors);
            setColors(new_colors);
            setNowSequence(nowSequence.concat(color));
        }
    };
    const notifyClick = (color) => {
        // console.log(color);
        if(isPlaying)
        {
            registerClick(color);
        }
    };

    useEffect(() => {
        const colorShutdown = (after_ms_time) => {
            let keys = Object.keys(colors);
            let turnedOff = false;
            for(let i = 0; i < keys.length; i++)
            {
                // console.log(`The color ${keys[i]} is in state ${colors[keys[i]].state}`);
                if(colors[keys[i]].state)
                {
                    // console.log(`The color ${keys[i]} was activated ${Date.now() - colors[keys[i]].last_modification}ms ago`);
                    if((Date.now() - colors[keys[i]].last_modification) > after_ms_time)
                    {
                        let new_colors = { ... colors };
                        new_colors[keys[i]] = {
                            state: false,
                            last_modification: Date.now()
                        };
                        // console.log(new_colors);
                        setColors(new_colors);
                        turnedOff = true;
                        setLastTurnedOff(Date.now());
                    }
                }
            }
            return turnedOff;
        };

        const allColorTurnedOff = () =>
        {
            let keys = Object.keys(colors);
            let turnedOff = true;
            for(let i = 0; i < keys.length; i++)
            {
                if(colors[keys[i]].state)
                {
                    turnedOff = false;
                    break;
                }
            }
            return turnedOff;
        };

        const gameOverFn = () => {
            setIsGameOver(true);
            setIsPlaying(false);
        };

        let interval_handler = setInterval(() => {
            if (hasBeenInit && !isGameOver)
            {
                if(isPlaying)
                {
                    colorShutdown(SHUTDOWN_MS_PLAYING);
                    if(nowSequence.length === sequence.length)
                    {
                        let win = true;
                        for(let i = 0; i < nowSequence.length; i++)
                        {
                            if(nowSequence[i] !== sequence[i])
                            {
                                gameOverFn();
                                win = false;
                            }
                        }
                        if(win)
                        {
                            setLastSequence(sequence);
                            setSequence([]);
                            setNowSequence([]);
                            setIsPlaying(false);
                            setSequenceLength(sequenceLength + 1);
                        }
                    }
                    else
                    {
                        for(let i = 0; i < nowSequence.length; i++)
                        {
                            if(nowSequence[i] !== sequence[i])
                            {
                                gameOverFn();
                            }
                        }
                    }
                    // console.log(nowSequence);
                }
                else
                {
                    if(sequence.length === (sequenceLength) && allColorTurnedOff())
                    {
                        setIsPlaying(true);
                        // console.log('Final sequence', sequence);
                    }
                    colorShutdown(SHUTDOWN_MS_NPLAYING);
                    // console.log(allColorTurnedOff());
                    if(sequence.length < sequenceLength && allColorTurnedOff() && (Date.now() - lastTurnedOff) > SHUTDOWN_MS_NPLAYING/2)
                    {
                        if (lastSequence[sequence.length])
                        {
                            let new_colors = { ...colors };
                            new_colors[lastSequence[sequence.length]] = {
                                state: true,
                                last_modification: Date.now()
                            };
                            setColors(new_colors);
                            setSequence(sequence.concat(lastSequence[sequence.length]));
                        }
                        else
                        {
                            let new_colors = { ...colors };
                            let keys = Object.keys(new_colors);
                            let random_index = Math.floor(Math.random() * keys.length);
                            new_colors[keys[random_index]] = {
                                state: true,
                                last_modification: Date.now()
                            };
                            setColors(new_colors);
                            setSequence(sequence.concat(keys[random_index]));
                        }
                    }
                }
            }
        }, 100);

        return () => clearInterval(interval_handler);
    }, [colors, hasBeenInit, isGameOver, isPlaying, lastSequence, lastTurnedOff, nowSequence, sequence, sequenceLength]);

    return (
        <>
            <header>
                <h1>
                    TMEM
                </h1>
            </header>
            <main>
                <div style={{ width: '100vw', position: 'absolute', top: '10vh' }}>
                    <h1 style={{ width: '100vw', textAlign: 'center', marginTop: '10px' }}>{isPlaying ? 'REPEAT' : 'SEE'}</h1>
                </div>
                <div className='divBoxContainer'>
                    <BoxContainer hasBeenInit={hasBeenInit} setHasBeenInit={setHasBeenInit}>
                        <Box state={colors.red.state}    color='red'      notifyFunc={notifyClick}/>
                        <Box state={colors.green.state}  color='green'    notifyFunc={notifyClick}/>
                        <Box state={colors.blue.state}   color='blue'     notifyFunc={notifyClick}/>
                        <Box state={colors.yellow.state} color='yellow'   notifyFunc={notifyClick}/>
                    </BoxContainer>
                </div>
                <div style={{ width: '100vw' }}>
                    <h1 style={{ width: '100vw', textAlign: 'center', marginTop: '10px' }}>SCORE: {sequenceLength - 1}</h1>
                </div>
            </main>
            <footer>
                <h1>@Copyright TEVES 2024</h1>
            </footer>
            <Message isRender={!hasBeenInit} anyClickCallback={
                () => {
                    setHasBeenInit(true);
                }
            }>
                <h1>Press to start</h1>
            </Message>
            <Message isRender={isGameOver} anyClickCallback={
                () => {
                    resetAll();
                }
            }>
                <div className='gameOverContainer'>
                    <h1>GAMEOVER</h1>
                    <h2>SCORE {sequenceLength-1}</h2>
                    <h1>PRESS TO PLAY AGAIN</h1>
                </div>
            </Message>
        </>
    );
}

export default App;
