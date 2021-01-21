const startBtn = document.getElementById('start');

startBtn.addEventListener('click', function () {
    startBtn.remove();

    // the card itself
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.classList.add('container');

    // inserts a mock card
    let cardToInsert = `
                            <div class="stats">
                                <div class="stat">
                                    <p>
                                    <img src="/static/images/church1-stat.png" class="stat-symbol"><br />
<!--                                    <span id="church">3</span>/10-->
                                    <div id='church-progress'><div data-value="50" id='church'></div></div>
                                    </p>
                                </div>
                                <div class="stat">
                                    <p>
                                    <img src="/static/images/money1-stat.png" class="stat-symbol"><br />
<!--                                    <span id="money">3</span>/10-->
                                    <div id='money-progress'><div data-value="50" id='money'></div></div>
                                    </p>
                                </div>
                                <li class="stat">
                                    <p>
                                    <img src="/static/images/king-stat.png" class="stat-symbol"><br />
<!--                                    <span id="king">3</span>/10-->
                                    <div id='king-progress'><div data-value="50" id='king'></div></div>
                                    </p>
                                </li>
                                <div class="stat">
                                    <p>
                                    <img src="/static/images/health-stat.png" class="stat-symbol"><br />
<!--                                    <span id="health">3</span>/10-->
                                    <div id='health-progress'><div data-value="50" id='health'></div></div>
                                    </p>
                                </div>
                            </div>
                            <div id="text">Text</div>
                            <div id="option-buttons">
                                <button class="btn btn-left" value="1" id="option1">Option 1</button>
                                <button class="btn btn-right" value="2" id="option2">Option 2</button>
                                <div id="char-card" class="character-card"></div>
                            </div>
                             `;

    container.insertAdjacentHTML('afterbegin', cardToInsert);

    startGame();
})


function startGame() {
    let cardText = document.getElementById('text')

    // gets a random card
    let card = cards[Math.floor(Math.random() * cards.length)];

    let church = document.getElementById('church');
    let money = document.getElementById('money');
    let king = document.getElementById('king');
    let health = document.getElementById('health');

    const option1 = document.getElementById('option1')
    const option2 = document.getElementById('option2')

    let characterCard = document.getElementById('char-card');

    // let stats = [church, money, king, health];

    cardText.innerText = card.text;

    // if (isHealthLow(stats) === false) {
    //     option1.innerText = card.options[0].text;
    //     option2.innerText = card.options[1].text;
    // }
    // else {
    //     let answer1 = option1.innerText;
    //     let answer2 = option2.innerText
    //     option1.innerText = handleLowHealth(answer1);
    //     option2.innerText = handleLowHealth(answer2);
    // }

    option1.innerText = card.options[0].text;
    option2.innerText = card.options[1].text;

    let cardTheme = card.theme;
    characterCard.className = 'character-card';
    characterCard.classList.add(`${cardTheme}-card`);

    let gameOver = false;

    // These two event listeners are almost duplicates of each other, sorry
    option1.addEventListener('click', function (event) {
        if (gameOver === false) {
            animateCard(event)
            // removes the event listener in each round, else all hell breaks loose
            this.removeEventListener('click', arguments.callee, false);
            let stats = [church, money, king, health];
            let option = card.options[0];
            impactStats(stats, option);

            // checks if the stats are below minimum or above max thresholds
            if (isGameOver(stats) === true) {
                gameOver = true;
                option1.remove()
                option2.remove()
                cardText.innerText = chooseEnding(stats);
                characterCard.className = 'character-card';
                characterCard.classList.add(`gameover-card`);
            } else {
                // loads a new card if the stats don't indicate game over
                setTimeout(startGame, 1000)
            }
        } else {
            this.removeEventListener('click', arguments.callee, false);
        }

    })
    option2.addEventListener('click', function (event) {
        if (gameOver === false) {
            animateCard(event)
            this.removeEventListener('click', arguments.callee, false);
            let stats = [church, money, king, health];
            let option = card.options[1];
            impactStats(stats, option);
            if (isGameOver(stats) === true) {
                gameOver = true;
                option1.remove()
                option2.remove()
                cardText.innerText = chooseEnding(stats);
                characterCard.className = 'character-card';
                characterCard.classList.add(`gameover-card`);
            } else {
                setTimeout(startGame, 1000)
            }
        } else {
            this.removeEventListener('click', arguments.callee, false);
        }

    })
}


function impactStats(stats, option) {
    // let value = 0
    // progress = document.getElementById("progress");
    // adds the corresponding impact values to the stats
    for (let stat of stats) {
        for (let impact of option.impacts)
            if (impact.impactStat === stat.id) {
                // let stat1Value = parseInt(stat.innerText);
                // let sum = stat1Value + parseInt(option.impactValue1);
                // stat.innerText = sum.toString();
                // value = sum;
                let statValue = parseInt(stat.dataset.value);
                statValue += parseInt(impact.impactValue);
                if (statValue >= 100) statValue = 100;
                if (statValue <= 0) statValue = 0;
                stat.style.width = statValue + "%";
            }
    }
}


function isGameOver(stats) {
    let gameOver = false
    const lowerLimit = 0;
    // up for debate
    const upperLimit = 100;
    for (let stat of stats) {
        //rewrite
        if ((parseInt(stat.innerText) <= lowerLimit) || (parseInt(stat.innerText) >= upperLimit)) {
            gameOver = true
        }
    }
    return gameOver
}


// function isHealthLow(stats) {
//     let lowHealth = false
//     const lowValue = 2;
//     const healthStat = parseInt(stats[3].innerText)
//         if (healthStat <= lowValue) {
//             lowHealth = true
//         }
//     return lowHealth
// }
//
//
// function handleLowHealth(answer) {
//     // let newAnswer = '';
//     // for (let i=0; i < answer.length; i++) {
//     //     newAnswer += answer[i] + answer[i].concat(Math.random().toString(36).substr(2, 1))
//     // }
//     // return newAnswer
//     let randomChar = Math.random().toString(36).substr(2, 1)
//     console.log(answer)
//     return answer.replace(/(.{5})/g,"%1%")
// }


function chooseEnding(stats) {
    const lowerLimit = 0;
    const upperLimit = 100;
    for (let stat of stats) {
        // REWRITE DATASET
        if (parseInt(stat.innerText) <= lowerLimit) {
            let threshold = 'lower';
            let gameOverStat = stat.id;
            for (let ending of endings) {
                if (ending.stat === gameOverStat && ending.threshold === threshold) {
                    // chooses randomly from the two possible ending texts
                    return ending.options[Math.floor(Math.random() * ending.options.length)].text
                }
            }
        } else if (parseInt(stat.innerText) >= upperLimit) {
            let threshold = 'upper';
            let gameOverStat = stat.id;
            for (let ending of endings) {
                if (ending.stat === gameOverStat && ending.threshold === threshold) {
                    return ending.options[Math.floor(Math.random() * ending.options.length)].text
                }
            }
        }
    }

}


const cards = [
    // each card has two options and each option impacts two of the stats (one negatively and one positively)
    // the whole point of the game is to balance the stats longer
    // the impacts of these options to the stats shouldn't be too high else te game will end in seconds
    {
        id: 1,
        theme: 'church',
        text: 'test situation text 1 church',
        options: [
            {
                text: 'test option text 1',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'positive',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 10
                    },
                    {

                        impactStat: 'king',
                        impactOperator: 'positive',
                        impactValue: 10
                    }
                ]
            },
            {
                text: 'test option text 2',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'negative',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'health',
                        impactOperator: 'positive',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'money',
                        impactOperator: 'positive',
                        impactValue: 10
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        theme: 'king',
        text: 'test situation text 2 kingking',
        options: [
            {
                text: 'test option text 3',
                impacts: [
                    {
                        impactStat: 'money',
                        impactOperator: 'positive',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'health',
                        impactOperator: 'positive',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'king',
                        impactOperator: 'negative',
                        impactValue: 10
                    }
                ],
            },
            {
                text: 'test option 4',
                impacts: [
                    {
                        impactStat: 'money',
                        impactOperator: 'negative',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'king',
                        impactOperator: 'negative',
                        impactValue: 10
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        theme: 'church',
        text: 'test situation text 3 churchchurch',
        options: [
            {
                text: 'test option text 5',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'positive',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 10
                    },
                    {

                        impactStat: 'king',
                        impactOperator: 'positive',
                        impactValue: 10
                    }
                ]
            },
            {
                text: 'test option text 6',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'negative',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 10
                    },
                    {

                        impactStat: 'king',
                        impactOperator: 'positive',
                        impactValue: 10
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        theme: 'money',
        text: 'test situation text 1 moneymoney',
        options: [
            {
                text: 'test option text 7',
                impacts: [
                    {
                        impactStat: 'money',
                        impactOperator: 'negative',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'health',
                        impactOperator: 'positive',
                        impactValue: 10
                    },
                    {

                        impactStat: 'king',
                        impactOperator: 'negative',
                        impactValue: 10
                    }
                ]
            },
            {
                text: 'test option text 8',
                impacts: [
                    {
                        impactStat: 'money',
                        impactOperator: 'positive',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 10
                    },
                    {

                        impactStat: 'king',
                        impactOperator: 'positive',
                        impactValue: 10
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        theme: 'health',
        text: 'test situation text 5 healthhealth',
        options: [
            {
                text: 'test option text 1111',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'negative',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'health',
                        impactOperator: 'positive',
                        impactValue: 10
                    },
                    {

                        impactStat: 'money',
                        impactOperator: 'negative',
                        impactValue: 10
                    }
                ]
            },
            {
                text: 'test option text 10',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'negative',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 10
                    },
                    {

                        impactStat: 'king',
                        impactOperator: 'negative',
                        impactValue: 10
                    }
                ]
            }
        ]
    },
    {
        id: 6,
        theme: 'king',
        text: 'test situation text 6 kingking',
        options: [
            {
                text: 'test option text 62',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'positive',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'money',
                        impactOperator: 'negative',
                        impactValue: 10
                    },
                    {

                        impactStat: 'king',
                        impactOperator: 'negative',
                        impactValue: 10
                    }
                ]
            },
            {
                text: 'test option text 1022',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'positive',
                        impactValue: 10,
                    },
                    {

                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 10
                    },
                    {

                        impactStat: 'king',
                        impactOperator: 'positive',
                        impactValue: 10
                    }
                ]
            }
        ]
    },

]

const endings = [
    {
        stat: 'church',
        threshold: 'lower',
        options: [
            {
                text: 'The church has had enough of your "Renaissance worship of life and nature" nonsense, ' +
                    'so you have been declared a heretic.',
            },
            {
                text: 'Your rebellious attitude reached the ears of the archbishop. The church has excommunicated you.',
            }
        ]
    },
    {
        stat: 'king',
        threshold: 'lower',
        options: [
            {
                text: 'The king finds your songs boring lately. ' +
                    'He would rather test his cool new torture equipments from the far East on you.',
            },
            {
                text: 'king loweraaaaaa',
            }
        ]
    },
    {
        stat: 'health',
        threshold: 'lower',
        options: [
            {
                text: 'Because of your neglected hygiene, you were among the first victims of the plague.',
            },
            {
                text: 'health lowereeeeeeeeee',
            }
        ]
    },
    {
        stat: 'money',
        threshold: 'lower',
        options: [
            {
                text: 'Being low on money, you ended up as every other musician: starving on a street corner.',
            },
            {
                text: "Your wife couldn't put up with poverty anymore, " +
                    "so she grabbed everything that could be moved and went back to her parents.",
            }
        ]
    },
    {
        stat: 'church',
        threshold: 'upper',
        options: [
            {
                text: "You’ve been writing too many hymns lately for the church. " +
                    "The king is bored with them, so you were sentenced to the guillotine.",
            },
            {
                text: 'church upperbbbbbbbbbbbb',
            }
        ]
    },
    {
        stat: 'king',
        threshold: 'upper',
        options: [
            {
                text: 'Being too close to the king lately, you lost your touch with the commoners. ' +
                    'You reputation hit rock bottom.',
            },
            {
                text: "Seeing the king's special treatment of you, your fellow musicians wanted to teach you a lesson." +
                    "While running away, you slipped and died on the spot.",
            }
        ]
    },
    {
        stat: 'health',
        threshold: 'upper',
        options: [
            {
                text: 'People started talking that you are the only one not affected by the plague.' +
                    ' The gossip reached the church and they called a witch-hunt on you.',
            },
            {
                text: 'health upperccccccccccccccc',
            }
        ]
    },
    {
        stat: 'money',
        threshold: 'upper',
        options: [
            {
                text: 'You accumulated a lot of riches over time, so the king decided to "liberate" your from all your assets.',
            },
            {
                text: 'money upperiiiiiiiii',
            }
        ]
    },
]


function animateCard(ev) {
    let t = ev.target;
    if (t.className === 'btn btn-left') {
        document.getElementsByClassName("character-card")[0].classList.add('character-card-nope');
    }
    if (t.className === 'btn btn-right') {
        document.getElementsByClassName("character-card")[0].classList.add('character-card-yay');
    }
}

let buttons = document.getElementsByClassName("option-buttons")
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (ev) => {
        animateCard(ev)
    });
}