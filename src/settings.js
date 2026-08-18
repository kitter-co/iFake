function openSettingsMenu() {

}

let form = document.querySelector("form")
let settingsData = [
    {
        label: "Half-Diminished Chords",
        font: "Inkpen2ChordsStd",
        options: [
            {
                label: "Cm7(b5)",
                selected: true
            },
            {
                label: "CØ7"
            },
            {
                label: "C±7"
            }
        ]
    },
    {
        label: "Major Chords",
        font: "Inkpen2ChordsStd",
        options: [
            {
                label: "C^7",
                selected: true
            },
            {
                label: "C²7"
            },
            {
                label: "C¯7"
            },
            {
                label: "C¥7"
            },
            {
                label: "C¾7"
            },
            {
                label: "C<7"
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
        let input = document.createElement("input")
        input.type = "radio"
        input.name = i.label.replaceAll(" ", "-")
        if (o.selected) input.checked = true
        label.append(input)
    }
}
