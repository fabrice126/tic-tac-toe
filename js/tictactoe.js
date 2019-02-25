window.addEventListener('load', main)
function main () {
  const tCells = document.querySelectorAll('table td')
  if (!tCells.length) return
  const game = new TicTacToe(tCells)
}

class TicTacToe {
  constructor (tCells) {
    this.board = Array(9).fill(null)
    // this.board = ['O', null, 'X', 'X', null, 'X', null, 'O', 'O']
    this.board.forEach((cell, i) => {
      document.getElementById(i).innerHTML = cell
    })
    this.countTurn = 0
    this.withWinner = false
    // Cellules ou doivent se trouver 3 pions d'un même joueur afin de gagner
    this.tWins = ['012', '345', '678', '036', '147', '258', '048', '246']
    this.tCells = tCells
    this.onClickCell = this.onClickCell.bind(this)
    // O = human player, X = AI
    this.currentPlayer = Math.random() > 0.5 ? 'X' : 'O'
    // this.currentPlayer = 'X'
    this.tCells.forEach(cell => cell.addEventListener('click', this.onClickCell))
    if (this.currentPlayer === 'X') {
      this.setRoundText('Au joueur robot')
      const oScore = this.minmax(this.board, this.currentPlayer)
      // console.log('oScore', oScore)
      document.getElementById(oScore.index).click()
    } else {
      this.setRoundText('Au joueur humain')
    }
  }
  onClickCell (e) {
    if (this.withWinner) return
    const { id, innerHTML } = e.target
    if (innerHTML === 'X' || innerHTML === 'O') {
      return console.log('Case déjà joué')
    }
    this.board[id] = this.currentPlayer
    document.getElementById(id).innerHTML = this.currentPlayer
    if (this.countTurn >= 4) {
      if (this.hasWinner(this.board, this.currentPlayer)) {
        this.withWinner = true
        this.setRoundText(`Le joueur ${this.currentPlayer} a gagné`)
        return
      }
    }
    this.changePlayer(this.currentPlayer)
    this.countTurn++
  }
  changePlayer (player) {
    if (player === 'X') {
      this.setRoundText('Au joueur humain')
      this.currentPlayer = 'O'
    } else {
      this.setRoundText('Au joueur robot')
      this.currentPlayer = 'X'
      setTimeout(() => {
        const move = this.minmax(this.board, this.currentPlayer)
        console.log('move', move)
        if (move.index === undefined) return
        document.getElementById(move.index).click()
      }, 1000)
    }
  }
  setRoundText (text) {
    document.getElementById('roundPlayer').innerHTML = text
  }
  getEmptyCells (board) {
    const tEmptyCells = []
    board.forEach((cell, i) => cell === null && tEmptyCells.push(i))
    return tEmptyCells
  }
  hasWinner (board, player) {
    for (let i = 0; i < this.tWins.length; i++) {
      const tIndex = this.tWins[i].split('')
      const first = board[Number(tIndex[0])]
      const second = board[Number(tIndex[1])]
      const third = board[Number(tIndex[2])]
      if (first === player && second === player && third === player) {
        return true
      }
    }
    return false
  }
  minmax (board, player) {
    // On copy le tableau afin de ne pas modifier la référence
    // board = [...board]
    const emptyCells = this.getEmptyCells(board)

    if (this.hasWinner(board, 'O')) {
      return { score: -10 }
    } else if (this.hasWinner(board, 'X')) {
      return { score: 10 }
    } else if (emptyCells.length === 0) {
      // Match nul
      return { score: 0 }
    }
    const tScores = []
    for (let i = 0; i < emptyCells.length; i++) {
      // Le joueur joue
      const index = emptyCells[i]
      const oScore = { index }
      board[index] = player
      // humain else IA
      let score
      if (player === 'O') {
        score = this.minmax(board, 'X')
        oScore.score = score.score
      } else {
        score = this.minmax(board, 'O')
        oScore.score = score.score
      }
      tScores.push(oScore)
      board[index] = null
    }
    let bestScore = tScores[0]
    for (let j = 0; j < tScores.length; j++) {
      // humain else IA
      if (player === 'O') {
        if (bestScore.score > tScores[j].score) {
          bestScore = tScores[j]
        }
      } else {
        if (bestScore.score < tScores[j].score) {
          bestScore = tScores[j]
        }
      }
    }
    return bestScore
  }
}
