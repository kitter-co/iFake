let rows = [], rowCount = 7

let keypadNoteNames = [
  "Ab", "A", "A#", "Bb", "B", "B#", "Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#"
]

let keypadData = {
  "maj": {
    text: "Maj",
    row: 0,
    disables: ["min", "dim", "aug", "sus2", "sus4"]
  },
  "min": {
    text: "Min",
    row: 0,
    disables: ["maj", "dim", "aug", "sus2", "sus4"]
  },
  "dim": {
    text: "Dim",
    row: 0,
    disables: ["maj", "min", "aug", "sus2", "sus4"]
  },
  "aug": {
    text: "Aug",
    row: 0,
    disables: ["maj", "min", "dim", "sus2", "sus4"]
  },
  "sus2": {
    text: "Sus2",
    row: 1,
    disables: ["maj", "min", "dim", "aug", "sus4"]
  },
  "sus4": {
    text: "Sus4",
    row: 1,
    disables: ["maj", "min", "dim", "aug", "sus2"]
  },
  "b5": {
    text: "b5",
    row: 2
  },
  "#5": {
    text: "#5",
    row: 2
  },
  "6/9": {
    text: "6/9",
    row: 2
  },
  "6": {
    text: "6",
    row: 2
  },
  "ø7": {
    text: "ø7",
    row: 3
  },
  "˚7": {
    text: "˚7",
    row: 3
  },
  "7": {
    text: "7",
    row: 3
  },
  "maj7": {
    text: "∆7",
    row: 3
  },
  "b9": {
    text: "b9",
    row: 4
  },
  "9": {
    text: "9",
    row: 4
  },
  "maj9": {
    text: "∆9",
    row: 4
  },
  "#9": {
    text: "#9",
    row: 4
  },
  "11": {
    text: "11",
    row: 5
  },
  "maj11": {
    text: "∆11",
    row: 5
  },
  "#11": {
    text: "#11",
    row: 5
  },
  "b13": {
    text: "b13",
    row: 6
  },
  "13": {
    text: "13",
    row: 6
  },
  "maj13": {
    text: "∆13",
    row: 6
  },
  "add9": {
    text: "add9",
    row: 7
  },
  "add11": {
    text: "add11",
    row: 7
  }
}

for (let i = 0; i < rowCount + 1; i++) {
  let row = document.createElement("div")
  row.classList.add("keypad-row")
  rows[i] = row
  document.getElementById("keypad-chords").append(row)
}

for (let [k, v] of Object.entries(keypadData)) {
  let button = document.createElement("button")
  button.classList.add("keypad-button")
  button.innerText = v.text || k
  if (typeof v.row != "number") continue
  rows[v.row].append(button)
}

function createNoteButtons(text) {
  let wrapper = document.createElement("div")
  wrapper.classList.add("keypad-notes-wrapper")
  wrapper.innerHTML = `<div>${text}</div>`
  for (let i of keypadNoteNames) {
    let button = document.createElement("button")
    button.classList.add("keypad-button")
    button.innerText = i
    wrapper.append(button)
  }

  return wrapper
}

document.getElementById("keypad-chords").prepend(createNoteButtons("Chord Root"))
document.getElementById("keypad-chords").append(createNoteButtons("Bass Note"))
