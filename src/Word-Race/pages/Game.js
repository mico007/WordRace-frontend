import React, { useRef, useEffect, useState, useContext } from 'react';

import WordRace from '../layout/WordRace';
import KeyboardHandler from '../components/keyboard-handler';
import Modal from '../components/Modal';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';

import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';

import { words } from '../utils/words';

import './game.css'

const Game = () => {

    const wordDisplay = useRef(null);
    const wordInput = useRef(null);
    const multiplierDisplay = useRef(null);
    const scoreDisplay = useRef(null);
    const timeDisplay = useRef(null);
    const levelDisplay = useRef(null);

    const auth = useContext(AuthContext);

    const [finalScore, setFinalScore] = useState();
    const [finalMultiplier, setFinalMultiplier] = useState();
    const [levelReached, setLevelReached] = useState(1);
    const [showModal, setShowModal] = useState(false);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {

        const stack = [];

        let score = 0;

        let multiplier = 0;

        // Available Levels
        const levels = {
            level1: 5,
            level2: 4,
            level3: 3
        };

        // To change level
        let currentLevel = levels.level1;

        let time = currentLevel;

        let isPlaying;

        // Pick & show random word
        const showWord = (words) => {
            // Generate random array index
            const randIndex = Math.floor(Math.random() * words.length);

            //random word (in uppercase)
            const word = words[randIndex].toUpperCase();

            //removing correct word from card view
            wordDisplay.current.innerHTML = ''

            //push rendered word in a stack array.
            stack.push(word);

            isPlaying = true

            //creating span for every character of word being shown
            word.split('').forEach(character => {
                const characterSpan = document.createElement('span')
                characterSpan.innerText = character
                //characterSpan.style.borderStyle = "solid" 
                wordDisplay.current.appendChild(characterSpan)
            })

            //removing word which typed correct from text area
            wordInput.current.value = null

        }

        // Countdown timer
        const countdown = () => {
            // Make sure time is not run out
            if (time > 0) {
                // Decrement
                time--;
            } else if (time === 0) {
                time = currentLevel;
                showWord(words);
            }
            //checking if stack is full and then game ends.
            if (stack.length === 50) {
                isPlaying = false;
            }
            // Show time
            timeDisplay.current.innerHTML = time;
        }

        // Call countdown every second
        let countDownTimer = setInterval(countdown, 1000);

        // Check game status
        const checkStatus = () => {
            if (isPlaying && score === 20) {
                levelDisplay.current.innerHTML = 2;
                currentLevel = levels.level2;
                setLevelReached(currentLevel);
            }

            if (isPlaying && score === 30) {
                levelDisplay.current.innerHTML = 3
                currentLevel = levels.level3;
                setLevelReached(currentLevel);
            }


            if (!isPlaying && time === 0) {
                clearInterval(countDownTimer);
                wordDisplay.current.innerHTML = 'GAME OVER'
                setFinalScore(score);
                setFinalMultiplier(multiplier);
                setShowModal(true);
            }
        }

        // loads word at window first load.
        const init = () => {
            // Load word from array
            showWord(words);

            // Check game status
            setInterval(checkStatus, 50);
        }

        window.addEventListener('load', init());

        //checking if input characters match with shown word characters
        wordInput.current.addEventListener('input', () => {
            const arrayWord = wordDisplay.current.querySelectorAll('span')
            const arrayValue = wordInput.current.value.toUpperCase().split('')

            let correct = true
            arrayWord.forEach((characterSpan, index) => {
                const character = arrayValue[index];
                if (character == null) {
                    characterSpan.classList.remove('correct')
                    characterSpan.classList.remove('incorrect')
                    correct = false
                } else if (character === characterSpan.innerText) {
                    characterSpan.classList.add('correct')
                    characterSpan.classList.remove('incorrect')
                } else {
                    characterSpan.classList.remove('correct')
                    characterSpan.classList.add('incorrect')
                    correct = false

                    multiplier = 0
                    multiplierDisplay.current.innerHTML = multiplier.toString();
                }
            })

            //checking if word is correct and then clear it from stack view
            if (correct && isPlaying) {

                time = currentLevel + 1;
                showWord(words);
                multiplier++;
                multiplierDisplay.current.innerHTML = multiplier.toString();
                score++
                scoreDisplay.current.innerHTML = score.toString();
            };


        })

    }, [])

    const cancelShowModal = () => {
        setShowModal(false);
        document.getElementById('modal-hook').innerHTML = '';
        window.location.assign("/");
    };

    const saveScoreHandler = async () => {
        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + "/score",
                'POST',
                JSON.stringify({
                    finalScore: finalScore,
                    multiplier: finalMultiplier,
                    level: levelReached
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            cancelShowModal();
        } catch (err) { }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            <Modal
                show={showModal}
                onCancel={cancelShowModal}
                header="Do You Want To Save Your Score?"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelShowModal}>
                            No
                        </Button>
                        <Button danger onClick={saveScoreHandler}>
                            Yes
                        </Button>
                    </React.Fragment>
                }
            >
                <p>
                    Final Score: {finalScore} <br />
                    Multiplier: {finalMultiplier} <br />
                    Level Reached: {levelReached}
                </p>
            </Modal>
            <WordRace>
                {/* .shape-section */}
                <section className="shape-section">

                    {/* round-rectangle*/}
                    <div className="containers round-rectangle">
                        <p className="shape-text"><span ref={levelDisplay}>1</span> <br /> LEVEL <br /> <span ref={timeDisplay} id="timer">0</span> time </p>
                    </div>

                    {/* trapez-shape*/}
                    <div className="containers trapez-shape">
                        <p className="shape-text"><span ref={scoreDisplay} id="score">0</span> <br /> SCORE </p>
                    </div>

                    {/* diamond-shape*/}
                    <div className="containers diamond-shape">
                        <p className="item-count"><span ref={multiplierDisplay} id="multiplier">0</span>X</p>
                    </div>
                </section>

                <div className="text-card">
                    <div className="container-card">
                        <p ref={wordDisplay} id="current-word" style={{ fontSize: "larger", padding: "5px", borderStyle: "solid", display: "inline-block" }}>
                            WELCOME
                        </p>
                    </div>
                </div>

                <textarea ref={wordInput} autoFocus id="wordInput" className="use-keyboard-input" style={{ position: "fixed", background: "rgb(224,224,224)", borderRadius: "8px", top: "48%", height: "10%", width: "44%", left: "28%" }}>

                </textarea>

                <KeyboardHandler />

            </WordRace>
        </React.Fragment>
    )
}

export default Game;