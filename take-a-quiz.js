let host = "https://c322-midterm-backend-latest-1ypt.onrender.com";
let quizzes = [];

async function getAll() {
  let response = await fetch(host + "/quizzes");
  let result = await response.json();
  return result;
}

async function displayQuizzes() {
  if (quizzes.length == 0) {
    quizzes = await getAll();
  }

  let quizCards = document.getElementById("quizCards");
  quizCards.innerHTML = "";

  for (let quiz of quizzes) {
    let div = document.createElement("div");
    div.className = "card";
    div.onclick = function() {
      startQuiz(quiz.id);
    };
    let innerHtml = `
      <div class="container">
        <h4><b>${quiz.id}</b></h4> 
        <p>${quiz.title}</p>
        <p>(${quiz.questionIds.length} questions)</p>
      </div>
    `;
    div.innerHTML = innerHtml;
    quizCards.appendChild(div);
  }
}

async function startQuiz(quizId) {
  window.location.href = `quiz.html?id=${quizId}`;
}

displayQuizzes();