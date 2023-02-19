var containerOngoing = document.getElementById("container-ongoing-quiz-data-user")

let userClass = "class_10th";
let score = 0
let currentQuiz = 0
let quizData = []
// let quizDataUser = []
const username = "naman77s";
const repoName = "quizapi";
const path = "Class_10th";
quiz.style.display = "none"

const getQuiz = async (dirName, fileName) => {
  try {
      const response = await fetch(`https://naman77s.github.io/${repoName}/${path}/${dirName}/${fileName}`);
      if (!response.ok) {
          throw new Error(response.statusText);
      }
      quizData = await response.json();
      if (!Array.isArray(quizData)) {
          throw new Error("Data is not an array");
      }
      quiz.style.display = "block"
      containerOngoing.style.display = "none"
      navBar.style.display = "none"
      loadQuiz()
      totalQues.innerHTML = quizData.length
  } catch (error) {
      alert(error);
  }
};

const displayFiles = async (dirName) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${path}/${dirName}`);
      const fileData = await response.json();
      fileData.forEach(file => {
        const ongoingFeedData = `
          <div class="quiz-box-user" id="quiz-box-user" onclick="getQuiz('${dirName}', '${file.name}')">
            ${file.name}
          </div> <hr>
        `;
        console.log("writing on doc" , file.name);
        containerOngoing.insertAdjacentHTML('beforeend' , ongoingFeedData);
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  
  displayFiles("Maths");

const loadQuiz = () => {
    
    deselectAnswers()
    const currentQuizData = quizData[currentQuiz]
    questionEl.innerText = currentQuizData.question
    a_text.innerText = currentQuizData.a
    b_text.innerText = currentQuizData.b
    c_text.innerText = currentQuizData.c
    d_text.innerText = currentQuizData.d
    scoreSec.style.display = "inline-block"
    
}

const deselectAnswers = () => {
    answerEls.forEach(answerEl => answerEl.checked = false)
}

const getSelected = () => {
    let answer
    answerEls.forEach(answerEl => {
        if(answerEl.checked) {
            answer = answerEl.id
        }
    })
    return answer
}

// const selectedAns = () => {
//   const answer = getSelected()
//   const newQuiz = {
//     question: questionEl.value,
//     a: a_text.value,
//     b: b_text.value,
//     c: c_text.value ,
//     d: d_text.value ,
//     correct: answer
//   }
//   quizDataUser.push(newQuiz);
//   console.log(quizDataUser);
// }

const push = () => { 
	if(currentQuiz < quizData.length) {
    
	    loadQuiz()
    //   selectedAns()
	} else {
	    quiz.innerHTML = `
	    <h2>You answered ${score}/${quizData.length} questions correctly</h2>
	    <button class="reload-user-quiz" onclick="location.reload()">Solve More</button>
	    `
	    scoreSec.style.display = "none"
	}
}

submitBtn.addEventListener('click', () => {
	const answer = getSelected()
	if(answer) {
		$("#quiz-container-user").fadeOut(300);
		$("#quiz-container-user").fadeIn(800);
	   if(answer === quizData[currentQuiz].correct) {
	       score++
	       scored.innerHTML = score      
	   }
	   	currentQuiz++
		setTimeout(push,450);
	}

  
})




// const getQuiz = async (dirName, fileName) => {
//   try {
//       const response = await fetch(`https://naman77s.github.io/${repoName}/${path}/${dirName}/${fileName}`);
//       if (!response.ok) {
//           throw new Error(response.statusText);
//       }
//       const quizData = await response.json();
//       if (!Array.isArray(quizData)) {
//           throw new Error("Data is not an array");
//       }
//       quizData.map((curElm) => {
//       const feedDataQuiz = `
//         <div class="quiz-container-user" id="quiz-container-user">
//           <div class="quiz-header-user" id="quiz-header-user">
//           <h2 id="question-user"> ${curElm.question} </h2>
//           <ul>
//             <li>
//               <input type="radio" name="answer" id="a" class="answer-user">
//               <label for="a" id="a_text_user">${curElm.a}</label>
//             </li>
//             <li>
//               <input type="radio" name="answer" id="b" class="answer-user">
//               <label for="b" id="b_text_user">${curElm.b}</label>
//             </li>
//             <li>
//               <input type="radio" name="answer" id="c" class="answer-user">
//               <label for="c" id="c_text_user">${curElm.c}</label>
//             </li>
//             <li>
//               <input type="radio" name="answer" id="d" class="answer-user">
//               <label for="d" id="d_text_user">${curElm.d}</label>
//             </li>
//             </ul>
//           </div>
//         <button id="submit-user">Next</button>
//         </div>
//       `;
//       container.insertAdjacentHTML('beforeend' , feedDataQuiz);
//       });
//   } catch (error) {
//       alert(error);
//   }
// };






// const displayFiles = async (dirName) => {
//   try {
//     const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${path}/${dirName}`);
//     const fileData = await response.json();
//     // containerOngoing.innerHTML = "";
//     fileData.forEach(file => {
//       const ongoingFeedData = `
//         <div class="quiz-box-user" id="quiz-box-user" onclick="getQuiz('${dirName}', '${file.name}')">
//           ${file.name}
//         </div> <hr>
//       `;
//       console.log("writing on doc" , file.name);
//       containerOngoing.insertAdjacentHTML('beforeend' , ongoingFeedData);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }


// displayFiles("Maths");


