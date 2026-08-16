import { SplendidGrandPiano } from "https://unpkg.com/smplr/dist/index.mjs";

const context = new AudioContext();
const piano = SplendidGrandPiano(context);
const soundbtn = document.getElementById("sound-btn")
soundbtn.addEventListener("click", () => playSound(60, 80));
export function playSound(note, velocity) {
  console.log(note, velocity)
  piano.start({ note: note, velocity: velocity });
}
