import { playChord } from './sounds.js'

let pos = 0
let splitPos = [0, 0]
let bpm = 40
let ts = 4

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class chordPlayer {
  constructor(changes) {
    this.changes = changes
    this.chord = null
  }

  step(pos) {
    let chordPos = pos[0] % this.changes.length
    let notePos = Math.floor(pos[1])
    let chord
    if (this.changes[chordPos].length > 0) {
      if (notePos % 2 === 0) {
        chord = this.changes[chordPos][notePos / 2]
      }
      if (chord != undefined) {
        this.chord = chord
      }
    }
    console.log(this.chord)
    playChord(this.chord)
  }
}

const chords = new chordPlayer([["Bb7"], ["G7"], ["C7", "F7"], ["Bb7", "F7"], ["Bb7"], ["G7"], ["C7"], ["F7"], ["Bb7"], [], ["Eb7"], ["Eo7"], ["Bb7"], ["G7"], ["C7", "F7"], ["Bb7", "F7"]])

async function startEngine() {
  while (true) {
    splitPos = [Math.floor(pos), (pos - Math.floor(pos)) * ts]
    chords.step(splitPos)
    await sleep((60000 / bpm) / ts)
    pos += 1 / ts
  }
}

await startEngine()
