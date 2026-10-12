let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;
let questions = [];
let user = "";

// Handle login
function login() {
  user = document.getElementById("username").value.trim();
  if (!user) {
    alert("Please enter your name");
    return;
  }
  document.getElementById("user-display").textContent = user;
  switchScreen("signup-screen", "dashboard-screen");
}

// Start the quiz
function startQuiz() {
  const subject = document.getElementById("subject-select").value;
  const difficulty = document.getElementById("difficulty-select").value;

  questions = generateQuestions(subject, difficulty);
  currentQuestion = 0;
  score = 0;

  switchScreen("dashboard-screen", "quiz-screen");
  showQuestion();
}

// Show a question
function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question-number").textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  document.getElementById("question").textContent = q.question;
  document.getElementById("choices").innerHTML = "";
  document.getElementById("explanation").classList.add("hidden");
  document.getElementById("next-btn").disabled = true;

  q.choices.forEach((choice, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => selectAnswer(i);
    li.appendChild(btn);
    document.getElementById("choices").appendChild(li);
  });

  startTimer();
}

// Select answer
function selectAnswer(index) {
  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll("#choices button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    if (i === index && i !== q.correct) btn.classList.add("incorrect");
  });

  document.getElementById("next-btn").disabled = false;
  document.getElementById("explanation").textContent = q.explanation;
  document.getElementById("explanation").classList.remove("hidden");

  if (index === q.correct) score++;
  clearInterval(timer);
}

// Next question
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

// End the quiz
function endQuiz() {
  document.getElementById("score").textContent = score;
  saveScore();
  switchScreen("quiz-screen", "result-screen");
}

// Restart quiz
function restartQuiz() {
  switchScreen("result-screen", "dashboard-screen");
}

// Go back to dashboard
function goToDashboard() {
  switchScreen(document.querySelector(".screen:not(.hidden)").id, "dashboard-screen");
}

// Switch screens
function switchScreen(hideId, showId) {
  document.getElementById(hideId).classList.remove("active");
  document.getElementById(hideId).classList.add("hidden");
  document.getElementById(showId).classList.remove("hidden");
  document.getElementById(showId).classList.add("active");
}

// Start timer
function startTimer() {
  timeLeft = 10;
  document.getElementById("time").textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      selectAnswer(-1);
    }
  }, 1000);
}

// Save score per username
function saveScore() {
  const key = "quiz_scores";
  let scores = JSON.parse(localStorage.getItem(key)) || {};

  if (!user) return;

  if (!scores[user]) {
    scores[user] = [];
  }

  scores[user].push({
    score: score,
    date: new Date().toLocaleString()
  });

  localStorage.setItem(key, JSON.stringify(scores));
}

// View scores by username
function viewUserScores() {
  const scores = JSON.parse(localStorage.getItem("quiz_scores")) || {};
  const list = document.getElementById("scoreboard-list");
  list.innerHTML = "";

  if (!user || !scores[user] || scores[user].length === 0) {
    list.innerHTML = "<li>No scores yet.</li>";
    return;
  }

  scores[user].slice().reverse().forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `#${scores[user].length - index} – ${entry.date} – Score: ${entry.score}/10`;
    list.appendChild(li);
  });

  switchScreen("dashboard-screen", "scoreboard-screen");
}

// Sample 10-question generator
function generateQuestions(subject, difficulty) {
  const pool = [
    { question: "Capital of France?", choices: ["Berlin", "Madrid", "Paris", "Rome"], correct: 2, explanation: "Paris is the capital of France." },
    { question: "Which planet is red?", choices: ["Earth", "Mars", "Venus", "Jupiter"], correct: 1, explanation: "Mars is the Red Planet." },
    { question: "Square root of 64?", choices: ["6", "8", "7", "9"], correct: 1, explanation: "8 × 8 = 64." },
    { question: "Author of 'Romeo and Juliet'?", choices: ["Dickens", "Shakespeare", "Austen", "Tolstoy"], correct: 1, explanation: "Shakespeare wrote it." },
    { question: "Gas used by plants?", choices: ["O2", "CO2", "N2", "H2"], correct: 1, explanation: "Plants use CO₂ for photosynthesis." },
    { question: "H2O is?", choices: ["Oxygen", "Hydrogen", "Water", "Steam"], correct: 2, explanation: "H₂O = Water." },
    { question: "How many continents?", choices: ["5", "6", "7", "8"], correct: 2, explanation: "There are 7 continents." },
    { question: "Instrument with keys?", choices: ["Guitar", "Piano", "Violin", "Flute"], correct: 1, explanation: "Piano has keys and pedals." },
    { question: "What do bees make?", choices: ["Sugar", "Milk", "Wax", "Honey"], correct: 3, explanation: "Bees make honey." },
    { question: "Organ that pumps blood?", choices: ["Brain", "Heart", "Lungs", "Liver"], correct: 1, explanation: "The heart pumps blood." }
  ];

  return pool.sort(() => Math.random() - 0.5).slice(0, 10);
}
