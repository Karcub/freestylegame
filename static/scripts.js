const startBtn = document.getElementById('start');

startBtn.addEventListener('click', function () {
    startBtn.remove();
    makeContainer();
})


function makeContainer() {
    const container = document.createElement('div');
    const scoreContainer = document.createElement('div');
    document.body.appendChild(scoreContainer);
    document.body.appendChild(container);

    scoreContainer.classList.add('score-container');
    container.classList.add('container');
    scoreContainer.innerHTML = `<p><span id="score">0</span> years lived</p>`
    // inserts a mock card
    let audio = musicMaterial[Math.floor(Math.random() * cards.length)];
    console.log(audio)
    let cardToInsert = `
                            <audio id="foobar" src="${audio}" preload="auto"></audio>
                            <div class="stats">
                                <div class="stat">
                                    <p>
                                    <img src="/static/images/church1-stat.png" class="stat-symbol"><br />
                                    <div id='church-progress'><div data-value="50" id='church'></div></div>
                                    </p>
                                </div>
                                <div class="stat">
                                    <p>
                                    <img src="/static/images/money1-stat.png" class="stat-symbol"><br />
                                    <div id='money-progress'><div data-value="50" id='money'></div></div>
                                    </p>
                                </div>
                                <li class="stat">
                                    <p>
                                    <img src="/static/images/king-stat.png" class="stat-symbol"><br />
                                    <div id='king-progress'><div data-value="50" id='king'></div></div>
                                    </p>
                                </li>
                                <div class="stat">
                                    <p>
                                    <img src="/static/images/health-stat.png" class="stat-symbol"><br />
                                    <div id='health-progress'><div data-value="50" id='health'></div></div>
                                    </p>
                                </div>
                            </div>
                            <div id="text">Text</div>
                            <div class="button-container">
                                <button class="btn btn-left" value="1" id="option1">Option 1</button>
                                <button class="btn btn-right" value="2" id="option2">Option 2</button>
                            </div>
                            <div id="char-card" class="character-card"></div>
                            
                             `;

    container.insertAdjacentHTML('afterbegin', cardToInsert);
    const restartBtn = `<button class="restart" onclick="restartGame()">Restart</button>`;
    container.insertAdjacentHTML('afterend', restartBtn);

    let backgroundMusic = document.getElementById("foobar");
    backgroundMusic.play();

    startGame();
}


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

    let score = document.getElementById('score');

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

            }
            else {
                let addScore = parseInt(score.innerText) + 1;
                score.innerText = addScore.toString();
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

            }
            else {
                let addScore = parseInt(score.innerText) + 1;
                score.innerText = addScore.toString();
                setTimeout(startGame, 1000)
            }
        } else {
            this.removeEventListener('click', arguments.callee, false);
        }

    })
}


function restartGame() {
    let container = document.getElementsByClassName('container');
    document.body.innerHTML = '';
    makeContainer();
}


function impactStats(stats, option) {
    for (let stat of stats) {
        for (let impact of option.impacts)
           if (impact.impactStat === stat.id) {
                let statValue = parseInt(stat.dataset.value);
                if (impact.impactOperator === 'positive') {
                    let sum = statValue + parseInt(impact.impactValue);
                    if (sum >= 100) sum = 100;
                    stat.setAttribute('data-value', sum);
                    stat.style.width = sum  + "%";
                    if (sum >= 80) {
                        stat.style.background = '#37ff00';
                    }
                    else if (sum <= 20) {
                        stat.style.background = '#ff0000';
                    }
                    else {
                        stat.style.background = '#333';
                    }
                }
                else if (impact.impactOperator === 'negative') {
                    let sum = statValue - parseInt(impact.impactValue);
                    if (sum <= 0) sum = 0;
                    stat.setAttribute('data-value', sum);
                    stat.style.width = sum  + "%";
                    if (sum >= 80) {
                        stat.style.background = '#37ff00';
                    }
                    else if (sum <= 20) {
                        stat.style.background = '#ff0000';
                    }
                    else {
                        stat.style.background = '#333';
                    }
                }

            }
    }
}


function isGameOver(stats) {
    let gameOver = false
    const lowerLimit = 0;
    // up for debate
    const upperLimit = 100;
    for (let stat of stats) {
        let statValue = parseInt(stat.dataset.value);
        if ((statValue <= lowerLimit) || (statValue >= upperLimit)) {
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
        let statValue = parseInt(stat.dataset.value);
        if (statValue <= lowerLimit) {
            let threshold = 'lower';
            let gameOverStat = stat.id;
            for (let ending of endings) {
                if (ending.stat === gameOverStat && ending.threshold === threshold) {
                    // chooses randomly from the two possible ending texts
                    return ending.options[Math.floor(Math.random() * ending.options.length)].text
                }
            }
        }
        else if (statValue >= upperLimit) {
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
        theme: 'church',
        text: "You’re playing a gig and you’re performing a lot of rebellious tracks, but the archbishop shows up.",
        options: [
            {
                text: "Continue like nothing happened",
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'negative',
                        impactValue: 10,
                    },
                    {
                        impactStat: 'money',
                        impactOperator: 'positive',
                        impactValue: 10
                    }
                ]
            },
            {
                text: 'Start playing some nice church music',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'positive',
                        impactValue: 10,
                    }
                ]
            }
        ]
    },
    {
        theme: 'church',
        text: 'You suddenly feel an urge to go find a priest and confess your sins.',
        options: [
            {
                text: 'Where was the church again?',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'negative',
                        impactValue: 20,
                    },
                    {
                        impactStat: 'health',
                        impactOperator: 'positive',
                        impactValue: 10,
                    }
                ],
            },
            {
                text: 'Take the whole family',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'positive',
                        impactValue: 20,
                    },
                    {
                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 10,
                    }
                ]
            }
        ]
    },
    {
        theme: 'king',
        text: 'Your King seems to have set his interests upon a daughter of yours.',
        options: [
            {
                text: 'One less mouth to feed',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'negative',
                        impactValue: 10,
                    },
                    {
                        impactStat: 'king',
                        impactOperator: 'positive',
                        impactValue: 10
                    }
                ]
            },
            {
                text: 'Shameless old pig!',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'positive',
                        impactValue: 10,
                    },
                    {
                        impactStat: 'king',
                        impactOperator: 'negative',
                        impactValue: 20
                    }
                ]
            }
        ]
    },
    {
        theme: 'church',
        text: "My son, I haven’t seen you at my sermons lately.",
        options: [
            {
                text: "Don’t feel like it ",
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'negative',
                        impactValue: 20,
                    }
                ]
            },
            {
                text: "I’m repenting, Father",
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'positive',
                        impactValue: 20,
                    }
                ]
            }
        ]
    },
    {
        theme: 'user',
        text: "Your lute tunes seem to have channelled Hell’s frequencies " +
            "and summoned the Great Goat Devil, Baphomet. He likes your music, so he offers his help.",
        options: [
            {
                text: 'Call an exorcist!',
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
                        impactStat: 'health',
                        impactOperator: 'negative',
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
                text: 'Why, thanks',
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
                        impactStat: 'king',
                        impactOperator: 'positive',
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
        theme: 'money',
        text: "You ran out of chickens at the farmer’s market and there’s still a line at your little stand but your back hurts like hell.",
        options: [
            {
                text: 'Go home and come back with another batch of chickens',
                impacts: [
                    {
                        impactStat: 'money',
                        impactOperator: 'positive',
                        impactValue: 10
                    },
                    {
                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 10
                    }
                ]
            },
            {
                text: 'Just go home and rest',
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
                    }
                ]
            }
        ]
    },
    {
        theme: 'king',
        text: "The king is in your village for a visit. Everyone is excited and wants to throw a celebration.\n",
        options: [
            {
                text: 'Join and contribute, celebrate you king! ',
                impacts: [
                    {
                        impactStat: 'money',
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
                text: 'Hide and start to dream about regicide',
                impacts: [
                    {
                        impactStat: 'health',
                        impactOperator: 'positive',
                        impactValue: 10
                    },
                    {
                        impactStat: 'king',
                        impactOperator: 'negative',
                        impactValue: 20
                    }
                ]
            }
        ]
    },
    {
        theme: 'user',
        text: "A knight -whom you squire for- entered a tournament, but suddenly dies.",
        options: [
            {
                text: "Finally, let’s pull ‘A knight's tale’, let’s win this thing",
                impacts: [
                    {
                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 10,
                    },
                    {
                        impactStat: 'money',
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
                text: 'Report the death of your master',
                impacts: [
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
        theme: 'money',
        text: "The wheat crops are having a hard time since the drought, you have to take action.",
        options: [
            {
                text: 'Do a pagan rain dance which has 100% rate of success',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'negative',
                        impactValue: 10,
                    },
                    {
                        impactStat: 'money',
                        impactOperator: 'positive',
                        impactValue: 10
                    }
                ]
            },
            {
                text: 'Just pray to your simple god and hope for the best',
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
                    }
                ]
            }
        ]
    },
    {
        theme: 'king',
        text: "Your band is just about to perform on the King’s birthday feast, but you noticed that your lute is off-key, it needs a restring.",
        options: [
            {
                text: 'Get someone who can do it ASAP',
                impacts: [
                    {
                        impactStat: 'money',
                        impactOperator: 'negative',
                        impactValue: 20
                    },
                    {
                        impactStat: 'king',
                        impactOperator: 'positive',
                        impactValue: 20
                    }
                ]
            },
            {
                text: 'Play as if nothing is wrong',
                impacts: [
                    {
                        impactStat: 'king',
                        impactOperator: 'negative',
                        impactValue: 20,
                    }
                ]
            }
        ]
    },
    {
        theme: 'user',
        text: "Suddenly you see a huge black cat crossing your path, but with any more delay, " +
            "you will be late from the king’s birthday, where you have to perform.",
        options: [
            {
                text: 'Say a quick prayer and continue forward',
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
                text: 'Turn around and rush back home',
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
                        impactOperator: 'positive',
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
        theme: 'health',
        text: "Your spouse is having plague-like symptoms.",
        options: [
            {
                text: "Let’s get the plague doctor",
                impacts: [
                    {
                        impactStat: 'health',
                        impactOperator: 'positive',
                        impactValue: 10,
                    },
                    {
                        impactStat: 'money',
                        impactOperator: 'negative',
                        impactValue: 10
                    }
                ]
            },
            {
                text: "Pray like there’s no tomorrow [because your spouse might not have one]",
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
                    }
                ]
            }
        ]
    },
    {
        theme: 'money',
        text: "Your dried salted meat supplies are decreasing.\n",
        options: [
            {
                text: 'Convert to veganism',
                impacts: [
                    {
                        impactStat: 'money',
                        impactOperator: 'positive',
                        impactValue: 10
                    },
                    {
                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 20
                    }
                ]
            },
            {
                text: 'Sell some of your children to a nice man with a fez',
                impacts: [
                    {
                        impactStat: 'money',
                        impactOperator: 'positive',
                        impactValue: 30,
                    },
                    {
                        impactStat: 'health',
                        impactOperator: 'positive',
                        impactValue: 20
                    }
                ]
            }
        ]
    },
    {
        theme: 'user',
        text: "Your daughter shows you her mathematics skills.",
        options: [
            {
                text: 'Give it to a great school',
                impacts: [
                    {
                        impactStat: 'money',
                        impactOperator: 'negative',
                        impactValue: 20
                    }
                ]
            },
            {
                text: 'Ask your priest about witchcraft',
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'positive',
                        impactValue: 20,
                    },
                    {
                        impactStat: 'money',
                        impactOperator: 'positive',
                        impactValue: 20
                    }
                ]
            }
        ]
    },
    {
        theme: 'user',
        text: "Your private parts are burning after a mysterious night out.",
        options: [
            {
                text: 'Go to the doctor, he might have some medicine for medieval STDs',
                impacts: [
                    {
                        impactStat: 'health',
                        impactOperator: 'positive',
                        impactValue: 10,
                    },
                    {
                        impactStat: 'money',
                        impactOperator: 'negative',
                        impactValue: 20
                    }
                ]
            },
            {
                text: "Just confess, there’s nothing you can do",
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'positive',
                        impactValue: 20,
                    },
                    {
                        impactStat: 'health',
                        impactOperator: 'negative',
                        impactValue: 20
                    },
                    {
                        impactStat: 'money',
                        impactOperator: 'negative',
                        impactValue: 20
                    }
                ]
            }
        ]
    },
    {
        theme: 'church',
        text: "One of your vocalists sang God’s name with bad emphasis on your concert in your local church.",
        options: [
            {
                text: 'Blackmail him for playing free',
                impacts: [
                    {
                        impactStat: 'money',
                        impactOperator: 'positive',
                        impactValue: 20,
                    },
                    {
                        impactStat: 'church',
                        impactOperator: 'positive',
                        impactValue: 20
                    }
                ]
            },
            {
                text: "Do nothing, pretend it didn't happen",
                impacts: [
                    {
                        impactStat: 'church',
                        impactOperator: 'negative',
                        impactValue: 20,
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
                text: "Seeing the archbishop's special treatment of you, your fellow musicians wanted to teach you a lesson." +
                    "While running away, you slipped and died on the spot.",
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
                text: "Your relationship with the king -and his queen is truly just too good." +
                    " The king caught the two of you in the act and the queen pushed all the blame to you. You were hanged the next morning.",
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
                text: "Your eldest son couldn't wait for your death to get his inheritance, " +
                    "so he decided to take action a bit earlier and poisoned you.",
            }
        ]
    },
]


const musicMaterial = ["/static/music/music1.mp3", "/static/music/music2.mp3", "/static/music/music3.mp3", "/static/music/music4.mp3",
                        "/static/music/music5.mp3", "/static/music/music6.mp3", "/static/music/music7.mp3", "/static/music/music8.mp3",
                        "/static/music/music9.mp3", "/static/music/music10.mp3", "/static/music/music11.mp3", "/static/music/music12.mp3"]



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