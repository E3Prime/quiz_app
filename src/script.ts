type Passage = {
  id: string;
  text: string;
};

type PassageContainer = {
  easy: Passage[];
  medium: Passage[];
  hard: Passage[];
};

// DOM Elements
const beginTestBtn = document.getElementById("beginTest") as HTMLButtonElement;
const restartTestBtn = document.getElementById("restartTest") as HTMLButtonElement;
const textTracker = document.getElementById("textTracker") as HTMLInputElement;
const textPassage = document.getElementById("textPassage") as HTMLTextAreaElement;

// Script Variables
const passages = await retrievePassages();
const {easy, medium, hard}: PassageContainer = passages;

beginTestBtn.addEventListener("click", beginSpeedingAssessment);
restartTestBtn.addEventListener("click", restartSpeedingAssessment);

function textTracking() {
  console.log("Works");
}

function beginSpeedingAssessment() {
  beginTestBtn.parentElement?.parentElement?.setAttribute("hidden", "");
  restartTestBtn.parentElement?.removeAttribute("hidden");
  textTracker.focus();
  textTracker.addEventListener("input", textTracking);
}

function restartSpeedingAssessment() {}

async function retrievePassages() {
  try {
    const response = await fetch("src/data.json");
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("There was a problem fetching passages", e);
  }
}
