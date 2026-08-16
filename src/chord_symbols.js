function parse(chord) {
  chord = chord.toLowerCase()
  // let notes = ["ab", "a", "a#", "bb", "b", "b#", "cb", "c", "c#", "db", "d", "d#", "eb", "e", "e#", "fb", "f", "f#", "gb", "g", "g#"]
  let chordTypeNumbers = ["6", "7", "9", "11", "13"]

  let chordParts = {}

  // root note
  chordParts.root = chord[0]
  if (chord.length > 1 && (chord[1] == "b" || chord[1] == "#")) chordParts.root += chord[1]

  // bass note (if applicable)
  chordParts.bass = chord.split("/")[1] || null

  // maj/min/aug/dim
  let rootless = chord.split(chordParts.root)[0]
  if (chord == chordParts.root) {
    chordParts.quality = "major"
  } else if (rootless.startsWith("ø") || rootless.startsWith("ø7") || rootless.startsWith("halfdim") || rootless.startsWith("halfdim7")) {
    chordParts.quality = "dim"
    chordParts.extensions = { "7": "min" }
  } else if (rootless.startsWith("dim7") || rootless.startsWith("o7") || rootless.startsWith("˚7")) {
    chordParts.quality = "dim"
    chordParts.extensions = { "7": "dim" }
  } else {
    let rootExtensions = chord.split(/[6|7|9|11|13]+/)
    console.log("rootExtensions", rootExtensions)

  
  }


  return chordParts
}

console.log(parse("Ab7(b9)/Bb"))
console.log(parse("Cmaj7"))
console.log(parse("F9sus"))
console.log(parse("G13(#9#5)"))
