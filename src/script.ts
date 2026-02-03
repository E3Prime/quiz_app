interface Quiz {
  title: string;
  questions: Question[];
}

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const escapeHTML = (str: string) => {
  const span = document.createElement("span");
  span.textContent = str;
  return span.innerHTML;
};

const fetchQuizData = async () => {
  try {
    const response = await fetch("src/data.json");
    if (!response.ok) throw new Error("There was an issue getting the data!");
    const data = await response.json();
    return [...data.quizzes];
  } catch (e) {
    console.log("There was an issue in acquiring quiz data", e);
  }
};

const titleScreen = document.getElementById("titleScreen") as HTMLElement;
const quizScreen = document.getElementById("quizScreen") as HTMLElement;
const subjectSelection = document.getElementById("subjectSelection") as HTMLDivElement;
const quizElem = document.getElementById("quiz") as HTMLDivElement;
const currentQuizIcon = document.getElementById("currentQuizIcon") as HTMLDivElement;
const resultsElem = document.getElementById("results") as HTMLElement;
const resultsScreen = document.getElementById("resultsScreen") as HTMLElement;
const replayQuizElem = document.getElementById("replayQuiz") as HTMLButtonElement;
const bodyElem = document.body as HTMLBodyElement;
const switchElem = document.getElementById("switch") as HTMLInputElement;

const quizzes: Quiz[] = await fetchQuizData();
let questionCounter = 0;
let correctAnswers = 0;
let currentQuiz: Question[] | null = null;

switchElem.addEventListener("change", () => (switchElem.checked ? (bodyElem.dataset.state = "light") : (bodyElem.dataset.state = "dark")));

subjectSelection.addEventListener("click", async (e: PointerEvent) => {
  if (!(e.target instanceof HTMLButtonElement)) return;
  titleScreen.classList.add("quiz-active");
  await sleep(1000);
  titleScreen.setAttribute("hidden", "");
  setupQuiz(e);
});

quizElem.addEventListener("click", quizAssessment);

replayQuizElem.addEventListener("click", async () => {
  currentQuizIcon.innerHTML = "";
  resultsScreen.classList.remove("fade-in");
  await sleep(1000);
  resultsScreen.setAttribute("hidden", "");
  titleScreen.removeAttribute("hidden");
  await sleep(1000);
  titleScreen.classList.remove("quiz-active");
});

async function quizAssessment(e: PointerEvent) {
  if (!(e.target instanceof HTMLButtonElement)) return;
  const chosenAnswer = e.target.id;
  const currentQuestion = currentQuiz[questionCounter];

  if (questionCounter === currentQuiz.length - 1) {
    if (chosenAnswer === currentQuestion.answer) ++correctAnswers;
    resultsElem.innerHTML = `<span class="text-6xl flex flex-col items-center font-semibold">${correctAnswers + 1}<span class="text-lg font-light">out of 10</span></span>`;
    questionCounter = 0;
    correctAnswers = 0;
    currentQuiz = null;
    quizScreen.classList.add("fade-out");
    await sleep(1000);
    quizScreen.setAttribute("hidden", "");
    quizScreen.classList.remove("quiz-active");
    quizScreen.classList.remove("fade-out");
    resultsScreen.removeAttribute("hidden");
    await sleep(1000);
    resultsScreen.classList.add("fade-in");
    return;
  }

  if (chosenAnswer === currentQuestion.answer) ++correctAnswers;
  ++questionCounter;
  renderQuiz(currentQuiz);
}

async function renderQuiz(currentQuiz: Question[]) {
  let htmlContent = `
    <div class="flex-1 flex flex-col justify-around">
      <div>
        <span class="text-sm font-light">Question ${questionCounter} of 10</span>
        <p class="my-3">${currentQuiz[questionCounter].question}</p>
      </div>
      <div class="bar p-1 bg-[#3c4c67] rounded">
        <span class="progress-bar h-2 bg-violet-500 block rounded" style="width: ${correctAnswers === 0 ? 0 : (correctAnswers / currentQuiz.length) * 100}%"></span>
      </div>
    </div>

    <div class="space-y-3 flex-2">
      <button type="button" class="bg-[#3b4b66] px-2.5 py-4 rounded-md w-full text-start text-sm" id="${escapeHTML(currentQuiz[questionCounter].options[0])}"><span class="rounded-lg bg-[#f6e6fa] p-1.5 text-zinc-800 cursor-pointer me-2 pointer-events-none">A</span> ${escapeHTML(currentQuiz[questionCounter].options[0])}</button>  
      <button type="button" class="bg-[#3b4b66] px-2.5 py-4 rounded-md w-full text-start text-sm" id="${escapeHTML(currentQuiz[questionCounter].options[1])}"><span class="rounded-lg bg-[#f6e6fa] p-1.5 text-zinc-800 cursor-pointer me-2 pointer-events-none">B</span> ${escapeHTML(currentQuiz[questionCounter].options[1])}</button>
      <button type="button" class="bg-[#3b4b66] px-2.5 py-4 rounded-md w-full text-start text-sm" id="${escapeHTML(currentQuiz[questionCounter].options[2])}"><span class="rounded-lg bg-[#f6e6fa] p-1.5 text-zinc-800 cursor-pointer me-2 pointer-events-none">C</span> ${escapeHTML(currentQuiz[questionCounter].options[2])}</button>
      <button type="button" class="bg-[#3b4b66] px-2.5 py-4 rounded-md w-full text-start text-sm" id="${escapeHTML(currentQuiz[questionCounter].options[3])}"><span class="rounded-lg bg-[#f6e6fa] p-1.5 text-zinc-800 cursor-pointer me-2 pointer-events-none">D</span> ${escapeHTML(currentQuiz[questionCounter].options[3])}</button>
      <button type="button" class="bg-[#a429f5] w-full py-3.5 rounded-md" hidden>Play Again</button>
    </div>
  `;

  quizElem.innerHTML = htmlContent;
}

async function setupQuiz(e: PointerEvent) {
  if (!(e.target instanceof HTMLButtonElement)) return;
  const target = e.target;
  const quizTitle = target.id;
  const selectedQuiz = quizzes.find((quiz) => quiz.title.toLowerCase() === quizTitle);
  currentQuiz = selectedQuiz.questions;
  let lowercaseWord = selectedQuiz.title.toLowerCase();
  let quizIconTitle = lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1).toLowerCase();

  currentQuizIcon.innerHTML = `
    <img src="src/assets/images/icon-${selectedQuiz.title.toLowerCase()}.svg" alt="${selectedQuiz.title} icon" width="30" height="30" />
    <p>${selectedQuiz.title !== "HTML" && selectedQuiz.title !== "CSS" ? quizIconTitle : selectedQuiz.title}</p>
  `;

  renderQuiz(currentQuiz);

  quizScreen.removeAttribute("hidden");
  await sleep(1000);
  quizScreen.classList.add("quiz-active");
}
