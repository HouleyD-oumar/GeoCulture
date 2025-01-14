import { countriesInfo } from './data/data.js';





fetch('./json/quizz.json')
  .then((response) => response.json())
  .then((data) => console.log(data));
const quiz = document.getElementById("quizz");
const answerEls = document.querySelectorAll(".option");
const questionEl = document.getElementById("p-question");
const a_text = document.getElementById("option-a");
const b_text = document.getElementById("option-b");
const c_text = document.getElementById("option-c");
const d_text = document.getElementById("option-d");
const gameTime = document.getElementById("game-time");
//   gameTime.innerHTML =`${2}:${59}`
//   discountGameTime(gameTime)
let min = 2,
  sec = 60;
/*  async function  discountGameTime(params) {
    setInterval(function () {
     
      for (let i = 2 ; i >= 0;i--){
          min=i     
            params.innerHTML =`${min}:${sec}`
        
           
           
        
        setInterval(function(){
        for (let  j= 59; j>=0;j-- ) {
            
          sec=j;
            
          
          params.innerHTML =`${min}:${sec}`
          console.log(`${i} ${j}`)
          if (i ===0 && j ===0) {
              return 
          }
        }
    },1000)
      }
     
},60000)
} 
discountGameTime = (params) => {
  setInterval(() => {
    if (min > 0) {
      min--;
      params.innerHTML = `${min}:${sec}`;
    }
  }, 60000);
  setInterval(() => {
    if (min !== 0 || sec !== 0) {
      sec--;
      params.innerHTML = `${min}:${sec}`;
      if (sec == 0 && min !== 0) {
        sec += 60;
      }
      // console.log(min +'  '+sec)
    }
  }, 1000);
};
discountGameTime(gameTime);

let currentQuiz = 0;
let score = 0;

loadQuiz();

function loadQuiz() {
  deselectAnswers();

  const currentQuizData = quizData[currentQuiz];

  questionEl.textContent = currentQuizData.question;
  a_text.innerText = currentQuizData.a;
  b_text.innerText = currentQuizData.b;
  c_text.innerText = currentQuizData.c;
  d_text.innerText = currentQuizData.d;
}

function deselectAnswers() {
  answerEls.forEach((answerEl) => (answerEl.checked = false));
}

// function getSelected() {
let answer;
let correctAnswer;
answerEls.forEach((answerEl) => {
  answerEl.addEventListener(
    "click",
    () => {
      answer = answerEl.id.slice(length - 1, answerEl.id.length);
      console.log(answerEl.id.length);
      console.log(answer);
      if (answer) {
        const   progress=document.querySelector('.progress .determinate')
        if (answer === quizData[currentQuiz].correct) {
          score++;
          answerEl.addEventListener("focus", () => {
            answerEl.classList.add("green");
          });
          correctAnswer=answer
          console.log(correctAnswer)
        }else{
          progress.classList.add("red");
          
        }
        
        progress.style.width =`calc(${progress.style.width} + 33.33%)`
        console.log(progress.style.width)
        currentQuiz++;
        
        if (currentQuiz < quizData.length) {
          setTimeout(loadQuiz(), 5000);
        } else {
          console.log(correctAnswer)
          quiz.innerHTML = `
                       
                    
        
    <i class="material-icons large">reload</i>
    <button onclick="location.reload()" class="btn bg-Lawngreen btn-large">Rejouer
    <i class="material-icons right large">refresh</i>
     </button>
                    `;
        }
      }
    },
    // if(answerEl.checked) {
    // }
    false
  );
});

// return answer
// }

// answerEl.addEventListener('click', () => {
//     const answer = getSelected()

// })

*/
let GAME_MODES = {
  NAME: 'name',
  CAPITAL: 'capital',
  CURRENCY: 'currency',
  LANGUAGE: 'language',
};
let gameModes;

function generateModeOptions(selectElement) {
  let params = ''
  const country =
  {
    "name": "Afghanistan",
    "topLevelDomain": [".af"],
    "alpha2Code": "AF",
    "alpha3Code": "AFG",
    "callingCodes": ["93"],
    "capital": "Kabul",
    "altSpellings": ["AF", "Afġānistān"],
    "subregion": "Southern Asia",
    "region": "Asia",
    "population": 40218234,
    "latlng": [33, 65],
    "demonym": "Afghan",
    "area": 652230,
    "timezones": ["UTC+04:30"],
    "borders": ["IRN", "PAK", "TKM", "UZB", "TJK", "CHN"],
    "nativeName": "افغانستان",
    "numericCode": "004",
    "flags": {

      "svg": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg",
      "png": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_the_Taliban.svg/320px-Flag_of_the_Taliban.svg.png"
    },
    "currencies": [
      {
        "code": "AFN",
        "name": "Afghan afghani",
        "symbol": "؋"
      }
    ],
    "languages": [
      {
        "iso639_1": "ps",
        "iso639_2": "pus",
        "name": "Pashto",
        "nativeName": "پښتو"
      },
      {
        "iso639_1": "uz",
        "iso639_2": "uzb",
        "name": "Uzbek",
        "nativeName": "Oʻzbek"
      },
      {
        "iso639_1": "tk",
        "iso639_2": "tuk",
        "name": "Turkmen",
        "nativeName": "Türkmen"
      }
    ],
    "translations": {
      "br": "Afghanistan",
      "pt": "Afeganistão",
      "nl": "Afghanistan",
      "hr": "Afganistan",
      "fa": "افغانستان",
      "de": "Afghanistan",
      "es": "Afganistán",
      "fr": "Afghanistan",
      "ja": "アフガニスタン",
      "it": "Afghanistan",
      "hu": "Afganisztán"
    },
    "flag": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg",
    "regionalBlocs": [
      {
        "acronym": "SAARC",
        "name": "South Asian Association for Regional Cooperation"
      }
    ],
    "cioc": "AFG",
    "independent": true
  }
  for (const key in country) {

    country[key] = ''
    console.log(key);
    country[key].replaceAll(`: '',`, ',')
    function getOption(key) {
      if (key === 'name') {
        return `Country Name`

      } else if (key === 'capital') {
        return `Capital City`

      } else {
        return key
      }

    }

    params += `
      <option value="${key}">
            ${getOption(key)}
      </option>`
    let key_prop = key.toUpperCase()
    GAME_MODES_Array.push(key)
    GAME_MODES_Array.forEach(k => {
      console.log(k)
    })

    console.log(GAME_MODES_Array);
    for (let k in GAME_MODES) {
      k = key
      console.log(GAME_MODES);
    }
    for (var k in GAME_MODES) {
      if (Object.prototype.hasOwnProperty.call(GAME_MODES, k)) {
        const element = GAME_MODES[k];
        k = key_prop
        console.log(k)
        console.log(element)
        console.log(GAME_MODES)
        gameModes = GAME_MODES
      }
    }
  }
  // for (const element of object) {

  // }
  selectElement.innerHTML = params
  console.log(params);
  console.log(gameModes)
  return gameModes
}
let GAME_MODES_Array = []
console.log(gameModes)
// Constants for game modes and difficulty levels

console.log(GAME_MODES);
const selectMode = document.getElementById('game-mode')
generateModeOptions(selectMode)
const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};
const discountGameTime = (params) => {

  setInterval(() => {
    if (min !== 0 || sec !== 0) {
      sec--;
      params.innerHTML = `${formatDigit(min)}:${formatDigit(sec)}`;
      if (sec == 0 && min !== 0) {
        sec += 60;
        min--
      }
      // console.log(min +'  '+sec)
    }
  }, 1000);
};
function formatDigit(num) {
  return num > 9 ? num : `0${num}`

}
let totalQuestions = 10;

// discountGameTime(gameTime,min,sec);
function loadQuiz() {

  // Variables to keep track of score and question count
  let score = 0;
  let currentQuestionIndex = 0;
  let currentCorrectAnswer = '';

  // Function to generate questions based on selected mode and difficulty
  function generateQuestion(mode) {
    const countryIndex = Math.floor(Math.random() * countriesInfo.length);
    const country = countriesInfo[countryIndex];
    document.getElementById('play-img').src = `/images/contries/flags/${country.alpha2Code}.svg`


let question;
switch (mode) {
  case GAME_MODES.NAME:
    question = `Quel est le nom de ce pays ?`;
    currentCorrectAnswer = country.translations.fr;
    break;
  case GAME_MODES.CAPITAL:
    question = `Quelle est la capitale de ${country.translations.fr} ?`;
    currentCorrectAnswer = country.capital;
    break;
  case GAME_MODES.CURRENCY:
    question = `Quelle est la monnaie utilisée dans ${country.translations.fr} ?`;
    currentCorrectAnswer = country.currencies[0].name;
    break;
  case GAME_MODES.LANGUAGE:
    question = `Quelle est l'une des langues officielles de ${country.translations.fr} ?`;
    currentCorrectAnswer = country.languages[0].name;
    break;
  default:
    throw new Error('Invalid game mode');
}

    // Generate multiple choice answers
    let options = [currentCorrectAnswer];
    while (options.length < 4) {
      const randomCountryIndex = Math.floor(Math.random() * countriesInfo.length);
      const randomCountry = countriesInfo[randomCountryIndex];

      if (!options.includes(randomCountry.name)) {
        switch (mode) {
          case GAME_MODES.NAME:
            options.push(randomCountry.translations.fr);

            break;
          case GAME_MODES.CAPITAL:
            randomCountry.capital
              ? options.push(randomCountry.capital)
              : options.push('N/VA');

            break;
          case GAME_MODES.CURRENCY:
            randomCountry.currencies[0].name
              ? options.push(randomCountry.currencies[0].name)
              : options.push('N/VA');
            break;
          case GAME_MODES.LANGUAGE:
            options.push(randomCountry.languages[0].name);
            break;
          default:
            throw new Error('Invalid game mode');
        }
      }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    // totalQuestions;
    console.log(options.sort(() => Math.random() - 0.5));
    return {
      question,
      options,

    };
  }

  // Function to display the question and options
  function displayQuestion(mode) {
    discountGameTime(gameTime);

    const { question, options, totalQuestions } = generateQuestion(mode);

    document.getElementById('p-question').innerText = question;
    options.forEach((option, index) => {
      document.getElementById(`option-${String.fromCharCode(97 + index)}`).innerText = option;
    });
  }

  // Function to handle the answer checking
  function checkAnswer(selectedAnswer) {
    console.log(currentCorrectAnswer + '||' + selectedAnswer);
    // console.log();
    let correct = false
    if (selectedAnswer.toLowerCase() === currentCorrectAnswer.toLowerCase()) {
      score++;
      console.log('score :' + score);
      correct = true

    }
    let answerBG
      // correct ? answerBG='correct' : answerBG='incorrect'
    console.log(currentQuestionIndex);
    correct
      ? M.toast({ html: 'Bonne réponse ! +1pT', classes: 'green' })
      : M.toast({ html: 'Mauvaise réponse !', classes: 'red' });


    // option.classList.add(answerBG)
    setTimeout(() => {
      // option.classList.remove(answerBG)

      console.log(totalQuestions);
      updateProgress(currentQuestionIndex);
      const patternJ = /$correct/g


      if (currentQuestionIndex + 1 < totalQuestions) {
        currentQuestionIndex++;
        displayQuestion(document.getElementById('game-mode').value);
        // displayQuestion(document.getElementById('game-mode').value);
        console.log('went to next!');

      } else {
        showScore();
      }
    }, 2000);

    console.log(totalQuestions);

  }

  // Function to show the score and results
  function showScore() {
    document.getElementById('quizz').style.display = 'none';
    document.getElementById('score-container').style.display = 'block';
    document.getElementById('score').innerText = score;
  }

  // Event listener for the start quiz button
  document.getElementById('start-quiz').addEventListener('click', () => {
    const mode = document.getElementById('game-mode').value;

    // Hide the selection UI and show the quiz area
    document.querySelector('.mode-selection').style.display = 'none';
    document.querySelector('.difficulty-selection').style.display = 'none';
    document.getElementById('start-quiz').style.display = 'none';
    document.getElementById('quizz').style.display = 'block';

    // Initialize the game
    displayQuestion(mode);
  });

  // Add event listener for option clicks
  document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', (event) => {
      const selectedAnswer = event.target.innerText;
      checkAnswer(selectedAnswer);
      console.log(selectedAnswer);


    });
  });
}
loadQuiz()
// Restart quiz button functionality
document.getElementById('restart-quiz').addEventListener('click', () => {

  // totalQuestions = 0;
  // currentQuestionIndex = 0;
  document.getElementById('score-container').style.display = 'none';
  document.querySelector('.mode-selection').style.display = 'block';
  document.querySelector('.difficulty-selection').style.display = 'block';
  document.getElementById('start-quiz').style.display = 'block';
  loadQuiz()
});
function selectAnswer(answer) {
  clearInterval(timer); // Arrête le minuteur actuel
  if (answer.correct) {
    score++;
    timeLeft += timeGain; // Ajoute du temps pour une bonne réponse
    M.toast({ html: 'Bonne réponse ! +1pT', classes: 'green animateIn dissmiss' ,displayLength: 50});
  } else {
    timeLeft -= timeLoss; // Retire du temps pour une mauvaise réponse
    M.toast({ html: 'Mauvaise réponse !', classes: 'red' ,displayLength: 50 ,position:'top'});
  }

  updateTimerDisplay(); // Met à jour l'affichage du minuteur

  // Attendre 2 secondes avant de passer à la question suivante
  setTimeout(() => {
    if (currentQuestionIndex < questions[selectedDifficulty].length - 1) {
      currentQuestionIndex++;
      showQuestion(questions[selectedDifficulty][currentQuestionIndex]);
      updateProgress();
      startTimer();
    } else {

    }


  })
};
function updateProgress(currentQuestionIndex) {
  const progress = document.querySelector('.progress .determinate')

  progress.style.width = `calc(${progress.style.width} + 10%)`
  console.log(progress.style.width);
  console.log(currentQuestionIndex / totalQuestions);

}