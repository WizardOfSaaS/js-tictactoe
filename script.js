console.clear()
console.log('Script running', new Date())

class Cell {
    constructor(id) {
        this.elem = document.getElementById(`cell-${id}`)
        this.handleClick = this.handleClick.bind(this)
        this.elem.addEventListener('click', this.handleClick)
        this.clear()
    }

    fill(val) {
        this.content = val
        this.isFilled = true
        this.elem.innerText = val
        this.elem.classList.add('filled')
    }

    clear() {
        this.content = ''
        this.elem.innerText = ''
        this.isFilled = false
        this.elem.classList.remove('filled')
    }

    handleClick() {
        if (game.state.isActive && !this.isFilled) {
            this.fill(game.state.currentTurn)
            game.turnPlayed()
        }
    }
}

class Board {
    constructor() {
        this.cells = [0,1,2].map(i=>[0,1,2].map(j=>new Cell(`${i}${j}`)))
        this.elem = document.getElementById('board')
    }

    checkEnd() {
        return this.checkWin() || (this.checkFull() ? 'DRAW' : false)
    }
    
    checkFull() {
        return this.cells.every(row=>row.every(c=>c.isFilled))
    }

    checkWin() {
        return this.cells.map(row=>this.checkAllCellsEqual(row)).find(el=>el) ||
        [0,1,2].map(
            i=>this.checkAllCellsEqual(
                [0,1,2].map(
                    j=>this.cells[j][i]
                )
            )
        ).find(el=>el) ||
        this.checkAllCellsEqual([0,1,2].map(i=>this.cells[i][i])) ||
        this.checkAllCellsEqual([0,1,2].map(i=>this.cells[i][2-i])) ||
        null
    }

    checkAllCellsEqual(arr) {
        return arr.every(el=>el.content===arr[0].content) &&
        arr[0].content
    }

}

class Game {
    constructor() {
        this.board = new Board()
        this.msgBox = document.getElementById('msg')
        this.resetBtn = document.getElementById('reset-btn')
        this.reset = this.reset.bind(this)
        this.reset()
        this.resetBtn.addEventListener('click', this.reset)
    }

    turnPlayed() {
        const winner = this.board.checkEnd()
        if (winner) {
            this.state.isActive = false
            this.state.currentTurn = undefined
            this.state.ended = true
            this.board.elem.classList.add('faded')
            this.resetBtn.classList.remove('hidden')
            if (winner==='DRAW') {
                console.log('GAME DRAWN')
                this.msgBox.textContent = 'GAME DRAWN'
            } else {
                console.log(`${winner} wins!`)
                this.msgBox.textContent = `${winner} wins!`
                this.state.winner = winner
            }
        } else {
            this.state.currentTurn = this.state.currentTurn==='X' ? 'O' : 'X'
            this.msgBox.innerText = `${this.state.currentTurn}'s Turn`
        }
    }

    reset() {
        this.state = {
            isActive: true,
            currentTurn: 'X',
            winner: null,
            ended: false,
        }
        this.board.elem.classList.remove('faded')
        this.resetBtn.classList.add('hidden')
        this.board.cells.forEach(row=>row.forEach(c=>c.clear()))
        this.msgBox.innerText = `${this.state.currentTurn}'s Turn`
    }
}

const game = new Game()
const testValues = [['X', 'O', ''],
                    ['', '', ''],
                    ['X', 'O', 'O']];

[0,1,2].forEach( i => {
    [0,1,2].forEach( j=> {
        testValues[i][j] ? game.board.cells[i][j].fill(testValues[i][j]) : null
    })
})

// console.log(game.board.checkWin())