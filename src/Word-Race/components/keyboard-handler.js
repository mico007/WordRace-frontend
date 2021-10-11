import React, { useRef, useEffect } from 'react';

import './keyboard.css';

const KeyboardHandler = () => {

    const mainKeyboard = useRef(null);
    const keysContainer = useRef(null);

    useEffect(() => {
        const _createKeys = () => {
            const keyLayout = [
                "q",
                "w",
                "e",
                "r",
                "t",
                "y",
                "u",
                "i",
                "o",
                "p",
                "a",
                "s",
                "d",
                "f",
                "g",
                "h",
                "j",
                "k",
                "l",
                "z",
                "x",
                "c",
                "v",
                "b",
                "n",
                "m",
            ];

            document.addEventListener("keydown", (e) => {
                // to avoid duplication of keyboard elements in a keys container div when key pressed
                keysContainer.current.innerHTML = "";

                _generateButton(keyLayout, true, e.key);

            });

            document.addEventListener("keyup", (e) => {
                // to avoid duplication of keyboard elements in a keys container div when key released
                keysContainer.current.innerHTML = "";

                _generateButton(keyLayout, false, e.key);
            });

            _generateButton(keyLayout, false, null);
        }

        _createKeys();

        mainKeyboard.current.appendChild(keysContainer.current);

        //Generating button on every key
        function _generateButton(keyLayout, active, keyboardKey) {
            //if key pressed, means its active
            if (active) {
                keyLayout.forEach((key) => {
                    const keyElement = document.createElement("button");

                    const insertLineBreak = ["p", "l", "m"].indexOf(key) !== -1;

                    // Add attributes/classes
                    keyElement.setAttribute("type", "button");
                    keyElement.classList.add("keyboard__key");

                    keyElement.textContent = key.toUpperCase();

                    //assigning active class on every key pressed on keyborad
                    if (key === keyboardKey) {
                        keyElement.classList.add("active");
                    }

                    keysContainer.current.appendChild(keyElement);

                    if (insertLineBreak) {
                        keysContainer.current.appendChild(document.createElement("br"));
                    }

                    return keysContainer;
                });
            } else {
                keyLayout.forEach((key) => {
                    const keyElement = document.createElement("button");

                    const insertLineBreak = ["p", "l", "m"].indexOf(key) !== -1;

                    // Add attributes/classes
                    keyElement.setAttribute("type", "button");
                    keyElement.classList.add("keyboard__key");

                    keyElement.textContent = key.toUpperCase();

                    keysContainer.current.appendChild(keyElement);

                    if (insertLineBreak) {
                        keysContainer.current.appendChild(document.createElement("br"));
                    }
                });

                return keysContainer.current;
            }
        }
    }, []);

    return (

        <div ref={mainKeyboard} className="keyboard">
            <div ref={keysContainer} className="keyboard__keys "></div>
        </div>
    );

}

export default KeyboardHandler;