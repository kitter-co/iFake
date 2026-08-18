let notes = ["ab", "a", "a#", "bb", "b", "b#", "cb", "c", "c#", "db", "d", "d#", "eb", "e", "e#", "fb", "f", "f#", "gb", "g", "g#"]
let chordQualityChart = {
  maj: [
    "maj",
    "ma",
    "^",
    ""
  ],
  min: [
    "m",
    "mi",
    "min",
    "-"
  ],
  aug: [
    "+",
    "aug"
  ],
  dim: [
    "o",
    "º",
    "˚",
    "dim"
  ]
}

chordQualityChart = Object.fromEntries(Object.entries(chordQualityChart).flatMap(([k, vs]) => [[k, k], ...vs.map((v) => [v, k])]))

console.log(chordQualityChart)

function parse(chord) {
  console.log("original chord", chord)

  chord = chord.toLowerCase()

  let chordParts = {}

  // root note
  chordParts.root = chord[0]
  if (chord.length > 1 && (chord[1] == "b" || chord[1] == "#")) chordParts.root += chord[1]
  if (!notes.includes(chordParts.root)) return `${chordParts.root} is not a valid note`

  // bass note (if applicable)
  let slash = chord.split("/")[1]
  chordParts.bass = null
  if (notes.includes(slash)) chordParts.bass = slash
  else if (slash) {
    return `${slash} is not a valid bass note`
  }

  if (chordParts.bass == "9") {
    chordParts.bass = null
  } else {
    chord = chord.split("/")[0]
  }

  // maj/min/aug/dim
  let rootless = chord.slice(chordParts.root.length)
  console.log("rootless", rootless)
  if (rootless == "69" || rootless == "6/9") {
    chordParts.quality = "maj"
    chordParts.extensions = { 
      "6": "natural",
      "9": "natural"
    }
  } else if (chord == chordParts.root) {
    chordParts.quality = "major"
  } else if (rootless.startsWith("ø") || rootless.startsWith("ø7") || rootless.startsWith("halfdim") || rootless.startsWith("halfdim7")) {
    chordParts.quality = "min"
    chordParts.extensions = { "5": "flat", "7": "min" }
  } else if (rootless.startsWith("dim7") || rootless.startsWith("o7") || rootless.startsWith("˚7") || rootless.startsWith("º7")) {
    chordParts.quality = "min"
    chordParts.extensions = { "5": "flat", "7": "dim" }
  } else {
    let rootExtensions = chord.split(/(add9|add2|add11|add4|5|6|7|9|11|13)+/)
    let chordType = rootExtensions[0].replace(chordParts.root, "") + rootExtensions[1], chordNumber = rootExtensions[1], chordQuality = chordType.replace(chordNumber, ""), sevenQuality
    console.log("#", chordNumber)
    if (!Object.keys(chordQualityChart).includes(chordQuality)) {
      for (let i of Object.keys(chordQualityChart)) {
        if (chordQuality.endsWith(i)) {
          chordQuality = chordQualityChart[chordQuality.replace(i, "")]
          sevenQuality = chordQualityChart[i]
          break
        }
      }
    } else {
      chordQuality = chordQualityChart[chordQuality]
      sevenQuality = chordQuality.replace("aug", "min")
      if (["7", "9"].includes(chord[chordParts.root.length])) sevenQuality = "min"
      if (chord[chordParts.root.length] == "1" && ["1", "3"].includes(chord[chordParts.root.length + 1])) sevenQuality = "min"
    }

    chordParts.quality = chordQuality

    if (["add9", "add2", "add11", "add4"].includes(chordNumber)) {
      if (["add9", "add2"].includes(chordNumber)) {
        chordParts.extensions = {
          "9": "natural"
        }
      } else if (["add11", "add4"].includes(chordNumber)) {
        chordParts.extensions = {
          "11": "natural"
        }
      }
    } else if (chordNumber == "5") {
      chordParts.quality = "power chord"
    } else if (chordNumber == "13") {
      chordParts.extensions = {
        "13": "natural",
        "11": "natural",
        "9": "natural",
        "7": sevenQuality
      }
    } else if (chordNumber == "11") {
      chordParts.extensions = {
        "11": "natural",
        "9": "natural",
        "7": sevenQuality
      }
    } else if (chordNumber == "9") {
      chordParts.extensions = {
        "9": "natural",
        "7": sevenQuality
      }
    } else if (chordNumber == "7") {
      chordParts.extensions = {
        "7": sevenQuality
      }
    } else if (chordNumber == "6") {
      chordParts.extensions = {
        "6": "natural"
      }
    } else {
      chordParts.extensions = {}

      if (!chordQuality && rootless.startsWith("sus")) {
        if (rootless == "sus4" || rootless == "sus") {
          chordParts.quality = "sus4"
        } else if (rootless == "sus2") {
          chordParts.quality = "sus2"
        }
      }
    }

    if (chordQuality == "aug") {
      chordParts.quality = "maj"
      if (!chordParts.extensions) chordParts.extensions = {}
      chordParts.extensions["5"] = "sharp"
    }

    let extraAlterations = chord.slice(chordParts.root.length + chordType.length)
    if (extraAlterations) {
      extraAlterations = extraAlterations.replaceAll("(", "").replaceAll(")", "")
      // b5 #5 b9 #9 #11 b13
      console.log(extraAlterations)

      if (extraAlterations == "alt") {
        // this is kinda weird cause alt is so non-specific so like I just kinda chose these alterations
        chordParts.extensions["5"] = "sharp"
        chordParts.extensions["9"] = "sharp"
      } else {
        let extraAlterationChars = extraAlterations.split("")
        if (["u", "#", "b"].includes(extraAlterationChars[extraAlterationChars.length - 1]) || !["1", "2", "3", "4", "5", "9", "s"].includes(extraAlterationChars[extraAlterationChars.length - 1])) {
          return "bad chord alteration"
        }
        for (let i = 0; i < extraAlterationChars.length; i++) {
          let char = extraAlterationChars[i]
          if (char == "#" || char == "b") {
            // #11, b13
            if (extraAlterationChars[i + 1] == "1") {
              if (char + extraAlterationChars[i + 1] + extraAlterationChars[i + 2] == "b13") chordParts.extensions["13"] = "flat"
              else if (char + extraAlterationChars[i + 1] + extraAlterationChars[i + 2] == "#11") chordParts.extensions["11"] = "sharp"
              else {
                return "bad chord alteration"
              }
            // b5, #5, b9, #9
            } else if (["5", "9"].includes(extraAlterationChars[i + 1])) {
              chordParts.extensions[extraAlterationChars[i + 1]] = char.replace("#", "sharp").replace("b", "flat")
            } else {
              return "bad chord alteration"
            }
          } else if (char == "s") {
            if (char + extraAlterationChars[i + 1] + extraAlterationChars[i + 2] == "sus") {
              if (!extraAlterationChars[i + 3] || extraAlterationChars[i + 3] == "#" || extraAlterationChars[i + 3] == "b") {
                chordParts.quality = "sus4"
              } else if (extraAlterationChars[i + 3] == "4") {
                chordParts.quality = "sus4"
              } else if (extraAlterationChars[i + 3] == "2") {
                chordParts.quality = "sus2"
              } else {
                return "bad chord alteration"
              }
            }
          } else if (["1", "2", "3", "4", "5", "9", "s", "u"].includes(char)) {
            continue
          } else {
            return "bad chord alteration"
          }
        }
      }
    }
  }


  return chordParts
}

// console.log(parse("Ab7(b9)/Bb"))
// console.log(parse("A"))
// console.log(parse("Dbm7b5/G"))
// console.log(parse("A9alt"))
// console.log(parse("Eb7b9b13"))
// console.log(parse("A6"))
// console.log(parse("Gb5"))
// console.log(parse("Bb6/9"))
// console.log(parse("E/F#"))
// console.log(parse("F9sus"))
// console.log(parse("Fsus2"))
// console.log(parse("Fsus2/A"))
// console.log(parse("G13(#9#5)"))
// console.log(parse("Gma13(#9#5)"))
// console.log(parse("Cmaj7"))
// console.log(parse("F#halfdim"))
// console.log(parse("Dadd9"))
// console.log(parse("D-add9"))
// console.log(parse("Caug7"))
// console.log(parse("G+maj13"))
// console.log(parse("Cmmaj7"))
// console.log(parse("Cminmaj7"))
// console.log(parse("c-ma7"))
document.getElementById("go").onclick = () => {
  document.getElementById("output").innerText = JSON.stringify(parse(document.getElementById("input").value))
}
