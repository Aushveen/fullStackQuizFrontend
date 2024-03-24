let host = "https://c322-midterm-backend-latest-1ypt.onrender.com";
let questions = [];
let quizQuestions = [];
let quizId = null;

async function getAll() {
  let response = await fetch(host + "/questions");
  let result = await response.json();
  return result;
}

async function displayQuestions() {
  if (questions.length == 0) {
    questions = await getAll();
  }

  let questionBank = document.getElementById("questionBank");
  questionBank.innerHTML = "";

  for (let question of questions) {
    let div = document.createElement("div");
    div.className = "card";
    div.onclick = function() {
      addToQuiz(question);
    };
    let innerHtml = `
      <img src="https://c322-midterm-backend-latest-1ypt.onrender.com/questions/${question.id}/image" alt="question" style="width:100%">
      <div class="container">
        <h4><b>${question.id}</b></h4> 
        <p>${question.description}</p>
      </div>
    `;
    div.innerHTML = innerHtml;
    questionBank.appendChild(div);
  }
}

function addToQuiz(question) {
  if (!quizQuestions.includes(question)) {
    quizQuestions.push(question);
    displayQuizQuestions();
  }
}

function removeFromQuiz(question) {
  let index = quizQuestions.indexOf(question);
  if (index > -1) {
    quizQuestions.splice(index, 1);
    displayQuizQuestions();
  }
}

function displayQuizQuestions() {
  let quizQuestionsDiv = document.getElementById("quizQuestions");
  quizQuestionsDiv.innerHTML = "";

  for (let question of quizQuestions) {
    let div = document.createElement("div");
    div.className = "card";
    div.onclick = function() {
      removeFromQuiz(question);
    };
    let innerHtml = `
      <img src="https://c322-midterm-backend-latest-1ypt.onrender.com/questions/${question.id}/image" alt="question" style="width:100%">
      <div class="container">
        <h4><b>${question.id}</b></h4> 
        <p>${question.description}</p>
      </div>
    `;
    div.innerHTML = innerHtml;
    quizQuestionsDiv.appendChild(div);
  }

  let quizTitle = document.querySelector("h2");
  quizTitle.innerHTML = `The new quiz(${quizQuestions.length} questions)`;
}

async function saveChanges() {
  let quizTitle = document.getElementById("quizTitle").value;
  let questionIds = quizQuestions.map(question => question.id);
  let quiz = {
    title: quizTitle,
    questionIds: questionIds
  };

  let request = {
    method: quizId ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quiz)
  };

  let url = quizId ? host + "/quizzes/" + quizId : host + "/quizzes";
  let response = await fetch(url, request);
  if (response.status == 200) {
    if (!quizId) {
      quizId = await response.json();
    }
    alert("Quiz saved successfully!");
  } else {
    alert("Something went wrong. Quiz could not be saved.");
  }
}

async function saveAndStartNew() {
  await saveChanges();
  quizQuestions = [];
  quizId = null;
  document.getElementById("quizTitle").value = "";
  displayQuizQuestions();
}

displayQuestions();