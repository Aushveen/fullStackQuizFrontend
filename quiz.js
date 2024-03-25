let host = "http://localhost:8080";
let quiz;
let currentQuestionIndex = 0;
let score = 0;

async function getQuiz() {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('id');
  let response = await fetch(host + "/quizzes/" + quizId);
  quiz = await response.json();
  displayQuestion(quiz.questions[currentQuestionIndex]);
}

function displayQuestion(question) {
  let questionScreen = document.getElementById("questionScreen");
  questionScreen.innerHTML = `
    <img src="http://localhost:8080/questions/${question.id}/image" alt="question" class="question-image">
    <h3>${question.description}</h3>
    <form>
      <input type="radio" id="optionA" name="answer" value="${question.choices[0]}">
      <label for="optionA">${question.choices[0]}</label><br>
      <input type="radio" id="optionB" name="answer" value="${question.choices[1]}">
      <label for="optionB">${question.choices[1]}</label><br>
      <input type="radio" id="optionC" name="answer" value="${question.choices[2]}">
      <label for="optionC">${question.choices[2]}</label><br>
    </form>
  `;
  updateNavigationButtons();
  updateQuestionNumber();
}

function updateNavigationButtons() {
  let prevButton = document.getElementById("prevButton");
  let nextButton = document.getElementById("nextButton");
  if (currentQuestionIndex === 0) {
    prevButton.style.visibility = "hidden";
  } else {
    prevButton.style.visibility = "visible";
  }
  if (currentQuestionIndex === quiz.questionIds.length - 1) {
    nextButton.textContent = "Finish";
  } else {
    nextButton.textContent = "Next";
  }
}

function updateQuestionNumber() {
  let questionNumber = document.getElementById("questionNumber");
  questionNumber.textContent = `(Question ${currentQuestionIndex + 1} out of ${quiz.questionIds.length})`;
}

function showPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(quiz.questions[currentQuestionIndex]);
  }
}

async function handleNextButton() {
  let selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    if (selectedAnswer.value === quiz.questions[currentQuestionIndex].answer) {
      score++;
    }
    if (currentQuestionIndex < quiz.questionIds.length - 1) {
      currentQuestionIndex++;
      displayQuestion(quiz.questions[currentQuestionIndex]);
    } else {
      showFinalScore();
    }
  }
}

function showFinalScore() {
  document.getElementById("quizScreen").style.display = "none";
  document.getElementById("scoreScreen").style.display = "block";
  document.getElementById("scoreTitle").textContent = `You completed the quiz ${quiz.title}.`;
  document.getElementById("score").textContent = `You scored ${score} out of ${quiz.questionIds.length}.`;
}

function goToQuizList() {
  window.location.href = "take-a-quiz.html";
}

getQuiz();