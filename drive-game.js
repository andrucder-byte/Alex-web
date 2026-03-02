const driveQuestions = [
    {
        question: "Before starting a long drive, what is most important?",
        options: ["Check fuel, tires, and documents", "Only pick a playlist", "Skip planning to save time"],
        correct: 0
    },
    {
        question: "You feel tired after 3 hours of driving. Best choice?",
        options: ["Keep going at the same pace", "Take a short rest stop", "Drive faster to finish early"],
        correct: 1
    },
    {
        question: "Weather changes and heavy rain starts. You should:",
        options: ["Increase speed", "Turn off headlights", "Slow down and keep safe distance"],
        correct: 2
    }
];

let driveIndex = 0;
let driveScore = 0;
let driveAnswered = false;
let driveComplete = false;

const driveQuestionEl = document.getElementById("drive-question");
const driveOptionsEl = document.getElementById("drive-options");
const driveStatusEl = document.getElementById("drive-status");
const driveNextBtn = document.getElementById("drive-next");

function renderDriveQuestion() {
    const current = driveQuestions[driveIndex];
    driveQuestionEl.textContent = current.question;
    driveOptionsEl.innerHTML = "";
    driveAnswered = false;
    driveComplete = false;

    current.options.forEach((optionText, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option-btn";
        btn.textContent = optionText;
        btn.addEventListener("click", () => chooseDriveOption(idx));
        driveOptionsEl.appendChild(btn);
    });

    driveStatusEl.textContent = `Score: ${driveScore}`;
}

function chooseDriveOption(idx) {
    if (driveAnswered) {
        return;
    }

    driveAnswered = true;
    if (idx === driveQuestions[driveIndex].correct) {
        driveScore += 1;
        driveStatusEl.textContent = `Correct. Score: ${driveScore}`;
    } else {
        driveStatusEl.textContent = `Not correct. Score: ${driveScore}`;
    }
}

driveNextBtn.addEventListener("click", () => {
    if (driveComplete) {
        driveIndex = 0;
        driveScore = 0;
        driveNextBtn.textContent = "Next decision";
        renderDriveQuestion();
        return;
    }

    if (driveIndex < driveQuestions.length - 1) {
        driveIndex += 1;
        renderDriveQuestion();
    } else {
        driveQuestionEl.textContent = "Challenge complete.";
        driveOptionsEl.innerHTML = "";
        driveStatusEl.textContent = `Final score: ${driveScore} / ${driveQuestions.length}`;
        if (window.b2AwardForPerfectQuiz) {
            window.b2AwardForPerfectQuiz("drive", driveScore, driveQuestions.length);
        }
        driveComplete = true;
        driveNextBtn.textContent = "Play again";
    }
});

renderDriveQuestion();
