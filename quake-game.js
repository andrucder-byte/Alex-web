const quakeQuestions = [
    {
        question: "During an earthquake, what is the safest first action?",
        options: ["Run to the stairs immediately", "Drop, cover, and protect your head", "Stand close to windows"],
        correct: 1
    },
    {
        question: "After a short quake, what should you check first at home?",
        options: ["Gas and electrical safety", "TV channels", "Social media rumors"],
        correct: 0
    },
    {
        question: "If objects are falling, where should you stay?",
        options: ["Near tall shelves", "Under a sturdy table", "In front of glass doors"],
        correct: 1
    }
];

let quakeIndex = 0;
let quakeScore = 0;
let answered = false;
let quakeComplete = false;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const statusEl = document.getElementById("status");
const nextBtn = document.getElementById("next-btn");

function renderQuakeQuestion() {
    const current = quakeQuestions[quakeIndex];
    questionEl.textContent = current.question;
    optionsEl.innerHTML = "";
    answered = false;
    quakeComplete = false;

    current.options.forEach((optionText, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option-btn";
        btn.textContent = optionText;
        btn.addEventListener("click", () => chooseQuakeOption(idx));
        optionsEl.appendChild(btn);
    });

    statusEl.textContent = `Score: ${quakeScore}`;
}

function chooseQuakeOption(idx) {
    if (answered) {
        return;
    }

    answered = true;
    if (idx === quakeQuestions[quakeIndex].correct) {
        quakeScore += 1;
        statusEl.textContent = `Correct. Score: ${quakeScore}`;
    } else {
        statusEl.textContent = `Not correct. Score: ${quakeScore}`;
    }
}

nextBtn.addEventListener("click", () => {
    if (quakeComplete) {
        quakeIndex = 0;
        quakeScore = 0;
        nextBtn.textContent = "Next question";
        renderQuakeQuestion();
        return;
    }

    if (quakeIndex < quakeQuestions.length - 1) {
        quakeIndex += 1;
        renderQuakeQuestion();
    } else {
        questionEl.textContent = "Quiz complete.";
        optionsEl.innerHTML = "";
        statusEl.textContent = `Final score: ${quakeScore} / ${quakeQuestions.length}`;
        if (window.b2AwardForPerfectQuiz) {
            window.b2AwardForPerfectQuiz("quake", quakeScore, quakeQuestions.length);
        }
        quakeComplete = true;
        nextBtn.textContent = "Play again";
    }
});

renderQuakeQuestion();
