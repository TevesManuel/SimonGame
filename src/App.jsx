import BoxContainer from './components/BoxContainer/BoxContainer';
import Box from './components/Box/Box';
import './App.css';
import { useState, useEffect } from 'react';

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
    const [sequence, setSequence] = useState([]);
    const [sequenceLength, setSequenceLength] = useState(5);
    const [lastTurnedOff, setLastTurnedOff] = useState(Date.now());
    const [nowSequence, setNowSequence] = useState([]);

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

        const losingFunc = () => {
            alert('You are failed');
            setIsPlaying(false);
        };

        let interval_handler = setInterval(() => {
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
                            losingFunc();
                            win = false;
                        }
                    }
                    if(win)
                    {

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
                            losingFunc();
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
        }, 100);

        return () => clearInterval(interval_handler);
    }, [colors, isPlaying, lastTurnedOff, nowSequence, sequence, sequenceLength]);

    return (
        <>
            <header>
                <h1>
                    TMEM
                </h1>
            </header>
            <main>
                <BoxContainer>
                    <Box state={colors.red.state}    color='red'  notifyFunc={notifyClick}/>
                    <Box state={colors.green.state}  color='green'    notifyFunc={notifyClick}/>
                    <Box state={colors.blue.state}   color='blue'   notifyFunc={notifyClick}/>
                    <Box state={colors.yellow.state} color='yellow' notifyFunc={notifyClick}/>
                </BoxContainer>
            </main>
            <footer>
                <h1>@Copyright TEVES 2024</h1>
            </footer>
        </>
    );
}

export default App;
