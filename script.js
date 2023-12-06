// Function to shuffle the array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const jsonFile = 'data.json';

fetch(jsonFile)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Shuffle the array of questions
    shuffleArray(data);

    // Process your JSON data here
    createQuestionCards(data);
  })
  .catch(error => {
    console.error('Error fetching JSON:', error);
  });

function createQuestionCards(questions) {
  const container = document.querySelector('.container-fluid .card-container');

  questions.forEach(question => {
    const card = document.createElement('div');
    card.classList.add('mcq-card', 'border', 'border-2', 'rounded-2', 'm-2', 'w-auto', 'text-center');

    const header = document.createElement('div');
    header.classList.add('mcq-card-header');
    const questionNumber = document.createElement('h3');
    questionNumber.classList.add('text-center');
    questionNumber.textContent = question.QuestionID;
    header.appendChild(questionNumber);

    const body = document.createElement('div');
    body.classList.add('mcq-card-body');
    const questionText = document.createElement('p');
    questionText.textContent = question.Question;
    body.appendChild(questionText);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('mcq-card-body-options');

    question.Options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('mcq-card-body-option');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `option${question.QuestionID}`;
      input.id = `option${question.QuestionID}-${index + 1}`;
      const label = document.createElement('label');
      label.htmlFor = input.id;
      label.textContent = option;

      optionElement.appendChild(input);
      optionElement.appendChild(label);
      optionsContainer.appendChild(optionElement);
    });

    body.appendChild(optionsContainer);

    const answer = document.createElement('div');
    answer.classList.add('mcq-card-answer');
    const answerText = document.createElement('p');
    answerText.classList.add('text-center', 'text-success', 'visually-hidden');
    answerText.textContent = question.Answer;
    answer.appendChild(answerText);

    const footer = document.createElement('div');
    footer.classList.add('mcq-card-footer');
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.classList.add('btn', 'btn-primary');
    submitButton.textContent = 'Submit';
    footer.appendChild(submitButton);

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(document.createElement('br'));
    card.appendChild(footer);
    card.appendChild(document.createElement('br'));
    card.appendChild(answer);

    container.appendChild(card);
  });
}

var score = 0;
var scoreList = [];
var time = 0;

// Timer
var timer = setInterval(function () {
  time++;
  document.getElementById("time").innerHTML = time + " seconds";
}, 1000);

document.addEventListener('DOMContentLoaded', function () {
  console.log("Script loaded");

  // Add click event to the entire document for submit buttons
  document.addEventListener('click', function (event) {
    const button = event.target.closest('.mcq-card-footer button');
    if (button) {
      console.log("Button clicked");
      handleButtonClick(event);
    }
  });

  // Function to handle button click
  function handleButtonClick(event) {
    const card = event.target.closest('.mcq-card');
    const answer = card.querySelector('.mcq-card-answer');
    const answerText = answer.querySelector('.text-success');
    const options = card.querySelectorAll('.mcq-card-body-option input');
    const selectedOption = Array.from(options).find(option => option.checked);

    if (selectedOption) {
      const selectedOptionText = selectedOption.nextElementSibling.textContent.trim();
      const correctAnswerText = answerText.textContent.trim();

      if (selectedOptionText === correctAnswerText) {
        answerText.classList.remove('visually-hidden');
        answerText.textContent = 'Correct Answer';
        score++;
      } else {
        answerText.classList.remove('text-success');
        answerText.classList.add('text-danger');
        answerText.classList.remove('visually-hidden');
        answerText.textContent = "Incorrect Answer, Correct Answer is: " + correctAnswerText + "";
      }
    } else {
      alert('Please select an option');
    }
    // update score 
    document.getElementById("score").innerHTML = score + " / 61" + "  " + (score / 61 * 100).toFixed(2) + "%";

    if (score > 31) {
      document.getElementById("score").style.color = "green";
    } else {
      document.getElementById("score").style.color = "red";
    }

    // Save the score to local storage
    scoreList.push(score);
    localStorage.setItem("score", JSON.stringify(scoreList));

    // only display the users top score
    var topScore = Math.max(...scoreList);
    document.getElementById("topScore").innerHTML = "Top Score: " + topScore + " / 61" + "  " + (topScore / 61 * 100).toFixed(2) + "%";
  }
});

