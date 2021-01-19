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
                                    <p>Stat 1<br/>
                                    <span id="stat1">3</span>/10
                                    </p>
                                </div>
                                <div class="stat">
                                    <p>Stat 2<br/>
                                    <span id="stat2">3</span>/10
                                    </p>
                                </div>
                                <div class="stat">
                                    <p>Stat 3<br/>
                                    <span id="stat3">3</span>/10
                                    </p>
                                </div>
                                <div class="stat">
                                    <p>Stat 4<br/>
                                    <span id="stat4">3</span>/10
                                    </p>
                                </div>
                            </div>
                            <div id="text">Text</div>
                            <div id="option-buttons">
                                <button class="btn btn-left" value="1" id="option1">Option 1</button>
                                <button class="btn btn-right" value="2" id="option2">Option 2</button>
                            </div>
                             `;

    container.insertAdjacentHTML('afterbegin', cardToInsert);

    startGame();
})


function startGame() {
    let cardText = document.getElementById('text')

    // gets a random card
    let card = cards[Math.floor(Math.random() * cards.length)];

    let stat1 = document.getElementById('stat1');
    let stat2 = document.getElementById('stat2');
    let stat3 = document.getElementById('stat3');
    let stat4 = document.getElementById('stat4');

    const option1 = document.getElementById('option1')
    const option2 = document.getElementById('option2')

    // changes things to the new card's data in each round
    cardText.innerText = card.text;
    option1.innerText = card.options[0].text;
    option2.innerText = card.options[1].text;

    // These two event listeners are almost duplicates of each other, sorry
    option1.addEventListener('click', function (event) {
        let stats = [stat1, stat2, stat3, stat4];
        let option = card.options[0];
        impactStats(stats, option);
        // checks if the stats are below minimum or above max thresholds
        if (isGameOver(stats) === true) {
            // nothing actually happens yet
            console.log('GAME OVER')
        }
        // removes the event listener in each round, else all hell brakes loose
        this.removeEventListener('click',arguments.callee,false);
        //load a new round
        startGame();
    })
    option2.addEventListener('click', function (event) {
        let stats = [stat1, stat2, stat3, stat4];
        let option = card.options[1];
        impactStats(stats, option);
        if (isGameOver(stats) === true) {
            console.log('GAME OVER')
        }
        this.removeEventListener('click',arguments.callee,false);
        startGame();
    })
}


function impactStats(stats, option) {
    // adds the corresponding impact values to the stats
    for (let stat of stats) {
       // checks which stat corresponds with you option impact
       if (option.impactStat1 === stat.id) {
        let stat1Value = parseInt(stat.innerText);
        let sum = stat1Value + parseInt(option.impactValue1);
        stat.innerText = sum.toString();
        }

       if (option.impactStat2 === stat.id) {
        let stat2Value = parseInt(stat.innerText);
        let sum = stat2Value + parseInt(option.impactValue2);
        stat.innerText = sum.toString();
        }
    }
}


function isGameOver(stats) {
    let gameOver = false
    const lowerLimit = 0;
    // up for debate
    const upperLimit = 10;
    for (let stat of stats) {
        if ((parseInt(stat.innerText) === lowerLimit) || (parseInt(stat.innerText) === upperLimit)) {
            gameOver = true
        }
    }
    return gameOver
}


const cards = [
    // each card has two options and each option impacts two of the stats (one negatively and one positively)
    // the whole point of the game is to balance the stats longer
    // the impacts of these options to the stats shouldn't be too high else te game will end in seconds
    {
        id: 1,
        text: 'test situation text 1',
        options: [
            {
                text: 'test option text 1',
                impactStat1: 'stat1',
                impactValue1: 1,
                impactStat2: 'stat4',
                impactValue2: -1
            },
            {
                text: 'test option text 2',
                impactStat1: 'stat1',
                impactValue1: -1,
                impactStat2: 'stat4',
                impactValue2: 1
            }
        ]
    },
    {
        id: 2,
        text: 'test situation text 2',
        options: [
            {
                text: 'test option text 3',
                impactStat1: 'stat3',
                impactValue1: 1,
                impactStat2: 'stat4',
                impactValue2: -1
            },
            {
                text: 'test option text 4',
                impactStat1: 'stat1',
                impactValue1: -1,
                impactStat2: 'stat2',
                impactValue2: 1
            }
        ]
    },
    {
        id: 3,
        text: 'test situation text 3',
        options: [
            {
                text: 'test option text 5',
                impactStat1: 'stat3',
                impactValue1: 1,
                impactStat2: 'stat1',
                impactValue2: -1
            },
            {
                text: 'test option text 6',
                impactStat1: 'stat1',
                impactValue1: -1,
                impactStat2: 'stat2',
                impactValue2: 1
            }
        ]
    },
        {
        id: 4,
        text: 'test situation text 1',
        options: [
            {
                text: 'test option text 1',
                impactStat1: 'stat1',
                impactValue1: 1,
                impactStat2: 'stat4',
                impactValue2: -1
            },
            {
                text: 'test option text 4444',
                impactStat1: 'stat1',
                impactValue1: -1,
                impactStat2: 'stat4',
                impactValue2: 1
            }
        ]
    },
        {
        id: 5,
        text: 'test situation text 5',
        options: [
            {
                text: 'test option text 1111',
                impactStat1: 'stat1',
                impactValue1: 1,
                impactStat2: 'stat4',
                impactValue2: -1
            },
            {
                text: 'test option text 2332',
                impactStat1: 'stat1',
                impactValue1: -1,
                impactStat2: 'stat4',
                impactValue2: 1
            }
        ]
    },
        {
        id: 6,
        text: 'test situation text 6',
        options: [
            {
                text: 'test option text 62',
                impactStat1: 'stat1',
                impactValue1: 1,
                impactStat2: 'stat4',
                impactValue2: -1
            },
            {
                text: 'test option text 212',
                impactStat1: 'stat1',
                impactValue1: -1,
                impactStat2: 'stat4',
                impactValue2: 1
            }
        ]
    },

]