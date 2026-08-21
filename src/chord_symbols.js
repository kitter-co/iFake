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

function parseChord(chord) {
  console.log("original chord", chord)

  chord = chord.toLowerCase()

  let chordParts = {}

  if (chord == "nc" || chord == "n.c" || chord == "n.c.") chordParts.quality = "nc"
  else {
    // root note
    chordParts.root = chord[0]
    if (chord.length > 1 && (chord[1] == "b" || chord[1] == "#")) chordParts.root += chord[1]
    if (!notes.includes(chordParts.root)) return `${chordParts.root} is not a valid note`
  }

  // bass note (if applicable)
  if (chord.includes("/")) {
    let slash = chord.split("/")[chord.split("/").length - 1]
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
  }

  if (chordParts.quality != "nc") {
    // maj/min/aug/dim
    let rootless = chord.slice(chordParts.root.length)
    console.log("rootless", rootless)
    if (rootless == "69" || rootless == "6/9") {
      chordParts.quality = "maj"
      chordParts.extensions = { 
        "6": "natural",
        "9": ["natural"]
      }

      if (chord != chordParts.root + "69" && chord != chordParts.root + "6/9") return "illegal 6/9 extensions"
    } else if (chord == chordParts.root && chordParts.quality != "nc") {
      chordParts.quality = "major"
    } else if (rootless.startsWith("ø") || rootless.startsWith("ø7") || rootless.startsWith("halfdim") || rootless.startsWith("halfdim7")) {
      chordParts.quality = "min"
      chordParts.extensions = { "5": ["flat"], "7": "min" }
    } else if (rootless.startsWith("dim7") || rootless.startsWith("o7") || rootless.startsWith("˚7") || rootless.startsWith("º7")) {
      chordParts.quality = "min"
      chordParts.extensions = { "5": ["flat"], "7": "dim" }
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
            "9": ["natural"]
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
          "9": ["natural"],
          "7": sevenQuality
        }
      } else if (chordNumber == "11") {
        chordParts.extensions = {
          "11": "natural",
          "9": ["natural"],
          "7": sevenQuality
        }
      } else if (chordNumber == "9") {
        chordParts.extensions = {
          "9": ["natural"],
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
        if (!chordParts.extensions["5"]) chordParts.extensions["5"] = []
        chordParts.extensions["5"].push("sharp")
      }

      let extraAlterations = chord.slice(chordParts.root.length + chordType.length)
      if (extraAlterations) {
        extraAlterations = extraAlterations.replaceAll("(", "").replaceAll(")", "")
        // b5 #5 b9 #9 #11 b13
        console.log(extraAlterations)

        if (extraAlterations == "alt") {
          chordParts.quality = "alt"
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
                if (!chordParts.extensions[extraAlterationChars[i + 1]]) chordParts.extensions[extraAlterationChars[i + 1]] = []
                chordParts.extensions[extraAlterationChars[i + 1]].push(char.replace("#", "sharp").replace("b", "flat"))
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
  }


  return chordParts
}

let largeNumbers = [
  null,
  "¹",
  "Ù",
  "Ú",
  "Û",
  "Ü",
  "Ý",
  "Þ",
  null,
  "ß",
  null,
  "¹¹",
  null,
  "¹Ú"
],
smallNumbers = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"
]

let smallAccidentals = {
  "flat": "b",
  "sharp": "#"
}

let stackedAccidentals = {
  "bb": "á",
  "#b": "â",
  "b#": "ä",
  "##": "å",
  "55": "À",
  "95": "Á",
  "115": "Â",
  "135": "Ã",
  "99": "Ä",
  "119": "Å",
  "139": "Æ",
  "1311": "È",
  "1199": "Ì",
  "13119": "Í",
  "995": "Î",
  "955": "Ï"
}

let upperText = {
  "sus": "š"
}, normalText = {
  "sus": "·"
}

function getText(text) {
  if (getSetting("text") == "up") {
    return upperText[text]
  }
  return normalText[text]
}

updateChordExamples = () => {
  let examples = document.getElementById("chord-examples")
  examples.innerHTML = ""

  examples.append(renderChord(parseChord("Ab7(b9)/Bb")))
  examples.append(renderChord(parseChord("Ammaj9")))
  examples.append(renderChord(parseChord("Bbaug")))
  examples.append(renderChord(parseChord("B7(#9#5)")))
  examples.append(renderChord(parseChord("C69/A")))
  examples.append(renderChord(parseChord("C#halfdim")))
  examples.append(renderChord(parseChord("D13#11b9sus")))
  examples.append(renderChord(parseChord("nc")))
}

updateChordExamples()

function renderChord(chord) {
  console.log(chord)

  let string

  if (chord.quality == "nc") {
    string = "µ"
  } else {
    let numbers = smallNumbers
    if (getSetting("nums") == "large") numbers = largeNumbers

    if (typeof chord == "string") return
    console.log(chord.root)
    string = chord.root[0].toUpperCase() + (chord.root[1] || "")

    if (chord.extensions["6"] == "natural" && chord.extensions["9"] == "natural") {
      string += "%"
    }

    if (chord.extensions["7"]) {
      if (chord.quality == "maj" && chord.extensions["7"] == "maj") string += getSetting("maj")
      else if (chord.quality == "min" && chord.extensions["7"] == "min") string += getSetting("min")
      else if (chord.quality == "min" && chord.extensions["7"] == "maj") {
        string += getSetting("min") + getSetting("maj")
      }

      let natural = Object.keys(chord.extensions).filter(key => chord.extensions[key] == "natural").map(Number), max = natural.length ? Math.max(...natural) : 7
      console.log("max", max)
      string += numbers[max]

      if (chord.quality == "min" && chord.extensions["5"] == "flat" && chord.extensions["7"] == "min" && Object.keys(chord.extensions).length == 2 && getSetting("halfdim") != "b5") {
        string = string.replace(getSetting("min"), getSetting("halfdim"))
      } else {
        let extensions = ""
        if (getSetting("stacked") == "true") {
          let stackString = "", stackStringAccidentals = ""
          for (let [k, v] of Object.entries(chord.extensions).sort(([a], [b]) => b - a)) {
            if (k == max.toString() || v == "natural" || (k == "7" && max.toString() != "7")) {
              continue
            }
            stackString += k
            extensions += smallAccidentals[v] + k

            if (k == "11" || k == "13") {
              stackStringAccidentals += v.replace("sharp", "#").replace("flat", "b")
            } else if (k == "9" || k == "5") {
              for (let i of v) {
                if (i == "natural") continue
                stackStringAccidentals += i.replace("sharp", "#").replace("flat", "b")
              }
            }
          }
          
          if (stackedAccidentals[stackStringAccidentals] && stackedAccidentals[stackString]) {
            extensions = `[${stackedAccidentals[stackStringAccidentals] + stackedAccidentals[stackString]}]`
            string += extensions
          } else {
            if (extensions) string += `(${extensions})`
          }
          console.log(extensions)
        } else {
          for (let [k, v] of Object.entries(chord.extensions).sort(([a], [b]) => b - a)) {
            if (k == max.toString() || v == "natural" || (k == "7" && max.toString() != "7")) {
              continue
            }
            extensions += smallAccidentals[v] + k
          }
          if (extensions) string += `(${extensions})`
        }
      }
    }

    if (chord.quality.includes("sus")) {
      let susNumber = getSetting("sus") == "number" || chord.quality == "sus2" ? chord.quality.slice(-1) : ""
      string += getText("sus") + susNumber
    }

    if (chord.bass) string += "/" + chord.bass[0].toUpperCase() + (chord.bass[1] || "")
  }

  let element = document.createElement("div")
  element.classList.add("chord-symbol")
  element.innerText = string
  return element
}

// console.log(parseChord("Ab7(b9)/Bb"))
// console.log(parseChord("A"))
// console.log(parseChord("Dbm7b5/G"))
// console.log(parseChord("A9alt"))
// console.log(parseChord("Eb7b9b13"))
// console.log(parseChord("A6"))
// console.log(parseChord("Gb5"))
// console.log(parseChord("Bb6/9"))
// console.log(parseChord("E/F#"))
// console.log(parseChord("F9sus"))
// console.log(parseChord("Fsus2"))
// console.log(parseChord("Fsus2/A"))
// console.log(parseChord("G13(#9#5)"))
// console.log(parseChord("Gma13(#9#5)"))
// console.log(parseChord("Cmaj7"))
// console.log(parseChord("F#halfdim"))
// console.log(parseChord("Dadd9"))
// console.log(parseChord("D-add9"))
// console.log(parseChord("Caug7"))
// console.log(parseChord("G+maj13"))
// console.log(parseChord("Cmmaj7"))
// console.log(parseChord("Cminmaj7"))
// console.log(parseChord("c-ma7"))
document.getElementById("go").onclick = () => {
  document.getElementById("output").innerText = JSON.stringify(parseChord(document.getElementById("input").value))
}
