function openSettingsMenu() {
    document.getElementById("settings-menu").classList.remove("hidden")
}

document.getElementById("open-settings").onclick = () => {
    document.getElementById("settings-menu").classList.toggle("hidden")
    document.getElementById("open-settings").classList.toggle("close")
}

document.getElementById("toggle-sidebar").onclick = () => {
    document.getElementById("sidebar").classList.toggle("hidden")
    document.getElementById("toggle-sidebar").classList.toggle("open")
}

let updateChordExamples

let form = document.querySelector("form")
let settingsData = [
    {
        label: "Major Chords",
        id: "maj",
        font: "Inkpen2ChordsStd",
        options: [
            {
                label: "^",
                selected: true
            },
            {
                label: "²"
            },
            {
                label: "¯"
            },
            {
                label: "¥"
            },
            {
                label: "<"
            },
            {
                label: "¾"
            }
        ]
    },
    {
        label: "Minor Chords",
        id: "min",
        font: "Inkpen2ChordsStd",
        options: [
            {
                label: "€",
                selected: true,
            },
            {
                label: "-"
            },
            {
                label: "Œ"
            },
            {
                label: "‹"
            },
            {
                label: "¿"
            },
            {
                label: "."
            },
            {
                label: "®"
            },
            {
                label: "¦"
            }
        ]
    },
    {
        label: "Diminished and Augmented Chords",
        id: "dim-aug",
        font: "Inkpen2ChordsStd",
        options: [
            {
                label: "º | &",
                selected: true
            },
            {
                label: "° | +"
            },
            {
                label: "¶ | ç"
            }
        ]
    },
    {
        label: "Half-Diminished Chords",
        id: "halfdim",
        font: "Inkpen2ChordsStd",
        options: [
            {
                label: "Ø",
                selected: true
            },
            {
                label: "±"
            },
            {
                label: "m7(b5)",
                value: "b5"
            }
        ]
    },
    {
        label: "Extended Chords",
        id: "nums",
        font: "Inkpen2ChordsStd",
        options: [
            {
                label: "7",
                selected: true,
                value: "small"
            },
            {
                label: "Þ",
                value: "large"
            }
        ]
    },
    {
        label: "Chord Text",
        id: "text",
        font: "Inkpen2ChordsStd",
        options: [
            {
                label: "¡",
                selected: true,
                value: "up"
            },
            {
                label: "¤"
            }
        ]
    },
    {
        label: "Sus4 Chords",
        id: "sus",
        font: "Inkpen2ChordsStd",
        options: [
            {
                label: "·",
                selected: true,
                value: "noNumber"
            },
            {
                label: "·Û",
                value: "number"
            }
        ]
    },
    {
        label: "Extra Alterations",
        id: "stacked",
        font: "Inkpen2ChordsStd",
        options: [
            {
                label: "[åÁ]",
                selected: true,
                value: "true"
            },
            {
                label: "(#9#5)",
                value: "false"
            }
        ]
    }
]

for (let i of settingsData) {
    /* 
    <!-- <fieldset>
            <span></span>
            <label>
              <input type="radio" name="" id="">
            </label>
          </fieldset> -->
    */
    let fieldset = document.createElement("fieldset")
    form.append(fieldset)
    fieldset.innerHTML = `<span>${i.label}</span>`
    for (let o of i.options) {
        let label = document.createElement("label")
        if (i.font) label.style.fontFamily = `${i.font}, system-ui, sans-serif`
        label.innerText = o.label
        fieldset.append(label)
        fieldset.id = "fieldset-" + i.id
        let input = document.createElement("input")
        input.type = "radio"
        input.name = i.id
        input.value = o.value || o.label
        if (o.selected) input.checked = true
        label.append(input)
        input.oninput = () => {
            updateChordExamples()
        }
    }
}

function getSetting(id) {
    let fieldset = document.getElementById("fieldset-" + id)
    return fieldset.querySelector("input:checked").value
}
