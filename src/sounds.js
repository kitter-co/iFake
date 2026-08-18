import { SplendidGrandPiano, Soundfont } from "https://unpkg.com/smplr/dist/index.mjs";
const context = new AudioContext();
const marimba = Soundfont(context, { instrument: "marimba" });
const soundbtn = document.getElementById("sound-btn")
soundbtn.addEventListener("click", () => playChord("E-11"));

function playSound(note, velocity) {
  console.log(note, velocity)
  marimba.start({ note: note, velocity: velocity });
}

// welcome to map hell
const noteMap = {
  C: 60,
  "C#": 61,
  Db: 61,
  D: 62,
  "D#": 63,
  Eb: 63,
  E: 64,
  F: 65,
  "F#": 66,
  Gb: 66,
  G: 67,
  "G#": 68,
  Ab: 68,
  A: 69,
  "A#": 70,
  Bb: 70,
  B: 71
};

//ayush™ patented lookup table
const whyDoPeopleTypeThisWayMap = {
  "m": ["mi", "-"],

  "dim": ["o"],

  "aug": ["+"],

  "7b9": ["7(b9)"],

  "m7": ["mi7", "-7"],
  "m9": ["mi9", "-9"],
  "m11": ["mi11", "-11"],

  "maj7": ["ma7"],

  "halfdim7": ["ø7"],

  "dim7": ["o7", "˚7"]
};

const chordTypes = {
  "": [0, 4, 7],
  "m": [0, 3, 7],
  "7": [0, 4, 7, 10],
  "m9": [0, 3, 7, 10, 14],
  "m11": [0, 3, 7, 10, 17],
  "maj7": [0, 4, 7, 11],
  "m7": [0, 3, 7, 10],
  "dim": [0, 3, 6],
  "dim7": [0, 3, 6, 9],
  "halfdim7": [0, 3, 6, 10],
  "aug": [0, 4, 8],
  "add2": [0, 2, 4, 7],
  "add4": [0, 4, 5, 7],
  "add9": [0, 4, 7, 14],
  "add11": [0, 4, 7, 17],
  "minmaj7": [0, 3, 7, 11],
  "sus2": [0, 2, 7],
  "sus4": [0, 5, 7]
};

function getChordType(chordSymbol) {
  for (const key in whyDoPeopleTypeThisWayMap) {
    if (whyDoPeopleTypeThisWayMap[key].includes(chordSymbol)) {
      return key;
    }
  }

  return chordSymbol;
}

export function playChord(symbol) {
  let rootName;
  let chordSymbol;

  if (symbol[1] === "#" || symbol[1] === "b") {
    rootName = symbol.slice(0, 2);
    chordSymbol = symbol.slice(2);
  } else {
    rootName = symbol.slice(0, 1);
    chordSymbol = symbol.slice(1);
  }

  const chordType = getChordType(chordSymbol);
  const root = noteMap[rootName];

  for (const interval of chordTypes[chordType]) {
    playSound(root + interval, 80);
  }
}
