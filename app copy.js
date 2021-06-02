const classIcons = [
    'far fa-surprise', 'far fa-sad-cry', 'far fa-smile-beam',
    'far fa-meh-blank', 'far fa-grin-stars', 'far fa-grin-hearts',
    'far fa-grin-tongue', 'far fa-kiss-beam', 'far fa-grimace',
    'far fa-hand-rock', 'far fa-hand-scissors', 'far fa-hand-spock',
    'far fa-dizzy', 'far fa-hand-peace', 'far fa-hand-paper',
    'far fa-thumbs-up', 'far fa-thumbs-down','fas fa-ghost',
    'fas fa-chess-king','fas fa-chess-knight','fas fa-chess-pawn',
    'fas fa-chess-queen','fas fa-chess-rook','fas fa-heart',
    'far fa-heart','fab fa-napster','fab fa-redhat','fas fa-robot',
    'fas fa-smoking','fas fa-user-astronaut','fas fa-user-secret',
    'fas fa-user-ninja'
]

const messages = (title, ms, time = 40) => {
    const message = document.createElement('div')
    const transition = 600;
    message.id = 'message'
    message.classList.add('message-popup')
    message.style.transition = `all ${transition}ms ease`
    message.innerHTML = `
    <h3>${title}</h3>
    <p>${ms}</p>
    <span class="closed-time"></span>    
    `
    document.body.append(message)
    setTimeout(() => message.style.bottom = '20%', 10)
    setTimeout(() => {
        let progress_time = document.querySelector('.closed-time')
        let inter = 0;
        let interval = setInterval(() => {
            inter++;
            progress_time.style.width = `${inter}%`
            if (inter >= 100) {
                message.style.bottom = '-100%'
                setTimeout(() => {
                    message.remove()
                }, transition)
                clearInterval(interval)
            }
        }, time)
    }, transition)
}
const playingDefault = document.querySelector('.playingDefault')
let default_config = {
    name_player1: 'X',
    name_player2: 'O',
    icon_player1: 'fas fa-times',
    icon_player2: 'far fa-circle',
    color_player1: '#1a1919',
    color_player2: '#585858',
    player1_class_color:'color-black',
    player2_class_color:'color-black',
    time: 0,
    rounds: 1
}
playingDefault.addEventListener('click',function(){
    let default_config = {
        name_player1: 'X',
        name_player2: 'O',
        icon_player1: 'fas fa-times',
        icon_player2: 'far fa-circle',
        color_player1: '#1a1919',
        color_player2: '#585858',
        player1_class_color:'color-black',
        player2_class_color:'color-black',
        time: 0,
        rounds: 1
    }
    localStorage.setItem('configGame',JSON.stringify(default_config))
    total_rounds = 1;
    game_count = 0;
    games_won = 0;
    current_position = 0;
    for (let i = 0; i < default_config.rounds; i++) {
        generateCols()
    }
})
const removeClass = (elements, cls) => {
    elements.forEach(el => {
        el.classList.remove(cls)
    })
}

if (localStorage.getItem('configGame')) default_config = JSON.parse(localStorage.getItem('configGame'))
// get config
for (let i = 0; i < 2; i++) {
    document.getElementById(`player${i + 1}`).value = default_config[`name_player${i + 1}`]
}
const timeChange = document.querySelector('.time-change')
if (default_config.time > 0) {
    document.getElementById('optionTime').checked = 1
    timeChange.innerHTML = `
    <label for="time">Tiempo</label>
    <input type="number" value="30" id="time" min="10" name="time">
    `
    document.getElementById('time').value = default_config.time
}

document.getElementById('rounds').value = default_config.rounds

for (let i = 0; i < 2; i++) {
    let inputColors = document.querySelectorAll(`.player${i + 1}-colors input`)
    removeClass(inputColors, 'current-color')
    Array.from(inputColors).find(inputColor => {
        if (inputColor.value == default_config[`color_player${i + 1}`]) {
            let span = inputColor.parentElement.querySelector('span')
            span.classList.add('current-color')
        }
    })
}

let rowSelectFigure = document.querySelector('.row-select-figure')
for (let i = 0; i < 2; i++) {
    let ulFromIcons = document.createElement('ul')
    ulFromIcons.classList.add(`icons-player${i + 1}`)
    rowSelectFigure.appendChild(ulFromIcons)
    classIcons.forEach(cls => {
        let playerClassColor = default_config[`player${i + 1}_class_color`];
        let current_icon_player = (cls == default_config[`icon_player${i + 1}`]) ? 'current-icon' : '';
        ulFromIcons.innerHTML +=
            `<li class="${current_icon_player} ${playerClassColor}"><i class="${cls}"></i></li>`;
    })
}


let currentPlayer = 1;

const btnChangeIcon = document.querySelectorAll('.btn-change-icon')

btnChangeIcon.forEach((btn, i) => {
    btn.addEventListener('click', function () {
        removeClass(btnChangeIcon, 'current-player-select')
        this.classList.add('current-player-select')
        rowSelectFigure.style.marginLeft = `-${i}00%`
        currentPlayer = i + 1
        console.log(1);
    })
})
for (let i = 0; i < 2; i++) {
    const listColorsSpan = document.querySelectorAll(`.player${i + 1}-colors span`)

    listColorsSpan.forEach(spanColor => {
        spanColor.addEventListener('click', function () {
            let radio = this.parentElement.querySelector('input');
            let current_color = this.classList[0]
            radio.click()
            let content_icons = document.querySelector(`.icons-player${i + 1}`)
            
            let selectFiguresLi = content_icons.querySelectorAll('li')

            selectFiguresLi.forEach(iconLi => {
                if(iconLi.classList.contains('current')){
                    iconLi.classList.remove(iconLi.classList[1])
                }else{
                    iconLi.classList.remove(iconLi.classList[0])
                }
                iconLi.classList.add(current_color)
                // iconLi.style.color = radio.value
            })
            default_config[`color_player${i + 1}`] = radio.value
            default_config[`player${i + 1}_class_color`] = current_color
            removeClass(listColorsSpan, 'current-color')
            this.classList.add('current-color')
        })
    })
}

for (let i = 0; i < 2; i++) {
    let selectFiguresLi = document.querySelectorAll(`.icons-player${i + 1} li`)
    selectFiguresLi.forEach(iconLi => {
        iconLi.addEventListener('click', function () {
            default_config[`icon_player${currentPlayer}`] = this.firstChild.classList.value;
            removeClass(selectFiguresLi, 'current-icon')
            this.classList.add('current-icon')
        })
    })

}

const optionTime = document.getElementById('optionTime')

optionTime.oninput = (e) => {
    if (optionTime.checked) {
        timeChange.innerHTML = `
        <label for="time">Tiempo</label>
        <input type="number" value="30" id="time" min="10" name="time">
        `
    } else {
        timeChange.innerHTML = ''
    }
}
const shiftTime = ()=>{
    let timeOfChange = default_config.time

    if(time > 0) return
    let interval = setInterval(()=>{
        time++;
        console.log(time);
        // console.log(games_won);
        if(time >= timeOfChange){
            time = 0;
            turn = !turn
        }
        if(endGame){
            time = 0;
            clearInterval(interval)
        }
    },1000)
}
gameOptions.addEventListener('submit', function (e) {
    e.preventDefault()
    let player1_name = this.player1.value.trim()
    let player2_name = this.player2.value.trim()
    if (optionTime.checked) {
        default_config.time = this.time.value
    }
    if (player1_name != '' && player2_name != '') {
        default_config.name_player1 = player1_name
        default_config.name_player2 = player2_name
    }
    default_config.rounds = this.rounds.value
    // default_config.player1_class_color = 

    localStorage.setItem('configGame', JSON.stringify(default_config))
    messages('Nueva configuracion', 'La siguiente configuracion estara lista para el proximo juego.', 50)
    game_count = 0;
    games_won = 0;
    current_position = 0;
    total_rounds = default_config.rounds;
    for (let i = 0; i < default_config.rounds; i++) {
        generateCols()
    }
    shiftTime()
})

const gameContent = document.querySelector('.game-content')
const gameSection = document.querySelector('.game-section')
let total_rounds = 1;
let game_count = 0;
let games_won = 0;
let current_position = 0;
let turn = true
let endGame = false;
let time = 0;
let win = false;
const btn_next = document.querySelector('.next'),
    btn_prev = document.querySelector('.prev');
let players_stats = {
    player1: {
        name: default_config.name_player1,
        good: 0,
        bad: 0,
    },
    player2: {
        name: default_config.name_player2,
        good: 0,
        bad: 0
    },
    all_rounds: total_rounds - 1
}
const prev_next_buttons = () => {

    const nextEvent = () => {
        current_position++;
        endGame = false
        shiftTime()
        console.log('current_player:', turn);
        if (current_position >= total_rounds - 1 || current_position >= games_won) {
            btn_next.classList.remove('button-visible')
        }
        gameContent.style.marginLeft = `-${current_position}00%`
        if (current_position > 0) {
            btn_prev.classList.add('button-visible')
        }
    }

    const prevEvent = () => {
        current_position--;
        if (current_position <= 0) {
            current_position = 0;
            btn_prev.classList.remove('button-visible')
        }

        gameContent.style.marginLeft = `-${current_position}00%`;

        if (current_position < games_won) {
            btn_next.classList.add('button-visible')
        }
    }
    btn_next.addEventListener('click', nextEvent)
    btn_prev.addEventListener('click', prevEvent)

}

prev_next_buttons()

const generateStats = () => {
    if (!localStorage.getItem('playersStats')) return
    let stats = JSON.parse(localStorage.getItem('playersStats'));
    let player_winner = (stats.player1.good > stats.player2.good) ? stats.player1.name : stats.player2.name ;
    console.log(stats, ' res');
    const lastPlayings = document.querySelector('.last-playings');

    const table = `
    <div class="last-plays">
    <h3>${(stats.player1.good == stats.player2.good) ? 'Empate' : player_winner}</h3>
    <table>
        <thead>
            <tr>
                <th>Jugador</th>
                <th>Gana</th>
                <th>Pierde</th>
                <th>Rondas</th>
            </tr>
        </thead>
        <tbody>
            <tr class="player-wins">
                <td>${stats.player1.name}</td>
                <td>${stats.player1.good}</td>
                <td>${stats.player1.bad}</td>
                <td>${stats.all_rounds}</td>
            </tr>
            <tr>
                <td>${stats.player2.name}</td>
                <td>${stats.player2.good}</td>
                <td>${stats.player2.bad}</td>
                <td>${stats.all_rounds}</td>
            </tr>
        </tbody>
    </table>
</div>
    `
 lastPlayings.innerHTML = table
}
generateStats()
const generateCols = () => {
    const roundContent = document.createElement('div')
    roundContent.classList.add('round-content')
    gameSection.style.display = 'flex'
    gameContent.append(roundContent)
    const winnerInfo = document.createElement('div')
    winnerInfo.classList.add('winner-info')
    game_count++;
    const game = document.createElement('div')
    game.appendChild(winnerInfo)
    game.classList.add('game', `game-${game_count}`)
    roundContent.append(game)

    let width_and_height = game.clientWidth / 3,
        row = ''
    let count = 0,
        count_row_area = 1
    for (let i = 0; i < 9; i++) {
        const area = document.createElement('span')
        area.style = `
        width:${width_and_height}px;
        height:${width_and_height}px;
        `
        area.style.animation = `upArea ${i + 2}00ms 1 ease`
        area.classList.add('area')
        if (i == 0) {
            row = document.createElement('div')
            row.classList.add('row-area', `row-area-${count_row_area}`)
            game.appendChild(row)
        }
        if (count >= 3) {
            count = 0;
            count_row_area++
            row = document.createElement('div')
            row.classList.add('row-area', `row-area-${count_row_area}`)
            game.appendChild(row)
        }
        count++
        row.appendChild(area)
    }
    startGame(game_count)
}
const closeButton = ()=>{
    const btnEndGame = document.createElement('button')
    btnEndGame.textContent = 'Cerrar juego'
    btnEndGame.classList.add('btn-end-game')
    gameContent.appendChild(btnEndGame)
    btnEndGame.addEventListener('click',()=>{
        const btnControls = gameSection.querySelectorAll('.controls button')
        console.log(btnControls);
        removeClass(btnControls, 'button-visible') 
        gameContent.removeAttribute('style')
        gameContent.innerHTML = ''
        gameSection.style.display = 'none'
        generateStats()
    })
}
const checkGame = (player_name = '?', player_plays = [], bgPlayerColor = '#bfbfbf', current_game, current_number_player = 1) => {
    if (player_plays.length <= 0) return;
    let players_stats = {
        player1: {
            name: default_config.name_player1,
            good: 0,
            bad: 0,
        },
        player2: {
            name: default_config.name_player2,
            good: 0,
            bad: 0
        },
        all_rounds: total_rounds
    }
    let rules_map = [
        // horizontal
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // vetical
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // esquinas
        [0, 4, 8],
        [2, 4, 6]
    ]
    let enc = 0;
    let enc_rule = [];
    let game = document.querySelector(`.game-${current_game}`)
    rules_map.forEach((rule, index) => {
        rule.find((r, i) => {
            if (enc >= 3) return

            enc_rule = rule
            player_plays.forEach(el => {
                if (r == el) {
                    enc++;
                } else {
                    enc = (enc < 0) ? 0 : enc--
                }
            })

            if (i >= 2) {
                if (enc == 3) {
                    messages(`Jugador ${player_name} gana`, 'Felicidades jugador, continua ganando.')
                    win = true
                    game.classList.add('end-game')
                    games_won++;
                    let player_win = game.querySelector('.winner-info')
                    player_win.innerHTML = `
                    <h3>Gana ${player_name}</h3>
                    <p>Ronda ${(games_won == 0) ? games_won+1:games_won}/${total_rounds}</p>
                    `
                    players_stats[`player${current_number_player}`].good++

                    if (current_number_player != 1) {
                        players_stats['player1'].bad++
                    } else {
                        players_stats['player2'].bad++
                    }

                    if (games_won > 0 && games_won < default_config.rounds) {
                        btn_next.classList.add('button-visible')
                    }
              
                    if (games_won >= default_config.rounds) {
                        btn_next.classList.remove('button-visible')
                        localStorage.setItem('playersStats', JSON.stringify(players_stats))
                        // const gameContent = document.querySelector('.game-content');
                        closeButton()
                    }
                } else {
                    enc = 0
                }
            }
        })
        if (enc == 3 && index >= rules_map.length - 1) {
            enc_rule.forEach(i => {
                setTimeout(() => {
                    let ar = game.querySelectorAll(`.area`)[i]
                    ar.style.backgroundColor = bgPlayerColor;
                    ar.querySelector('i').style.color = '#fff'
                })
            })
            endGame = true
            win = false
           
            if(current_number_player == 1){
                turn = true
            }else{
                turn = false
            }
        }
    })
    if (player_plays.length >= 5 && !win) {
        messages('Nadie gana', 'Ronda sin ganadores ni perdedores.')
        let player_win = game.querySelector('.winner-info')
        games_won++;
        player_win.innerHTML = `
        <h3>Empate</h3>
        <p>Ronda ${games_won}/${total_rounds}</p>
        `
        console.log('end down');
        players_stats['player1'].bad++
        players_stats['player2'].bad++

        if (games_won > 0 && games_won < default_config.rounds) {
            btn_next.classList.add('button-visible')
        }
        if (games_won >= default_config.rounds) {
            btn_next.classList.remove('button-visible')
            localStorage.setItem('playersStats', JSON.stringify(players_stats))
            closeButton()
        }

    }
}

const startGame = (currentGame = 1) => {
    default_config = JSON.parse(localStorage.getItem('configGame'))
    total_rounds = default_config.rounds;
    let player_x = [],
        player_o = [],
        win = false
    let game = document.querySelector(`.game-${currentGame}`)
    let gameAreas = game.querySelectorAll(`.area`)


    gameAreas.forEach((area, i) => {
        area.addEventListener('mouseenter', function () {
            if (this.classList.contains('used-area') || game.classList.contains('end-game')) return
            if (turn) {
                this.innerHTML = `<i class="${default_config.icon_player1}" style="color:${default_config.color_player1};animation:none"></i>`
            } else {
                this.innerHTML = `<i class="${default_config.icon_player2}" style="color:${default_config.color_player2};animation:none""></i>`
            }
        })
        area.addEventListener('mouseleave', function () {
            if (this.classList.contains('used-area') || game.classList.contains('end-game')) return
            this.innerHTML = ''
        })
        area.addEventListener('click', function () {
            time = 0;
            
            if (win || game.classList.contains('end-game')) return
            if (this.classList.contains('used-area')) return

            if (turn) {
                this.classList.add('used-area')
                player_x.push(i)
                checkGame(default_config.name_player1, player_x, default_config.color_player1, currentGame, 1)
                this.innerHTML = `<i class="${default_config.icon_player1}" style="color:${default_config.color_player1}"></i>`
            } else {
                this.classList.add('used-area')
                player_o.push(i)

                checkGame(default_config.name_player2, player_o, default_config.color_player2, currentGame, 2)
                this.innerHTML = `<i class="${default_config.icon_player2}" style="color:${default_config.color_player2}"></i>`
            }

            turn = !turn
        })

    })
}


