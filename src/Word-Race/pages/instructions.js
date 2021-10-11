import React from 'react';

import WordRace from '../layout/WordRace';
import Card from '../components/Card';
import Button from '../components/Button';

const Instructions = () => {
    return (
        <WordRace>
            <Card className="authentication">
                <h3>Game Instructions</h3>
                <hr />
                <p>
                    Welcome to a word race game. <br />
                    The game contains 3 levels. <br />
                    There are 50 words that will appear at the rate according to the level. <br />
                    In level 1: you have 5 sec to type a word correctly. <br />
                    In level 2: you have 4 sec to type a word correctly. <br />
                    In level 3: you have 3 sec to type a word correctly. <br />
                    If you type a word correctly before a given time, you score and move to the next word. <br />
                    The multiplier increases when you type a word correctly and resets on any mistype. <br />
                    If you type 20 words correctly, then you move to the level 2. <br />
                    If you type 30 words correctly, then you move to the final level (level 3). <br />
                    If 50 words done appearing it's a Game Over. <br />
                    If you ready, hit "Start" button.
                </p>
                <hr />
                <Button href="/game">Start</Button>
            </Card>
        </WordRace>
    )
}

export default Instructions;