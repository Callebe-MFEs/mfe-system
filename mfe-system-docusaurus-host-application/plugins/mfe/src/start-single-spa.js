import * as singleSpa from "single-spa";

let started = false;
export function start() {
  if (!started) {
    started = true;
    singleSpa.start();
    window.singleSpa = singleSpa;
  }
}

export default start;