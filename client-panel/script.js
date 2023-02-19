var containerOngoing = document.getElementById("container-ongoing-quiz-data-user")
var containeOngoingQuizDataUser = document.getElementById("container-ongoing-quiz-data-user")
// var userClass = "Class_10th";
var score = 0
var currentQuiz = 0
var quizData = []
// let quizDataUser = []
const username = "naman77s";
const repoName = "quizapi";
var path = "Class_10th";
var pathVal;
quiz.style.display = "none"

var tempObj = [{hey : "hemlo", tempVal : 0},{}];
var tempVal = 5;
tempObj[0].tempVal += tempVal;
console.log(tempObj);
// alert(tempObj);

const getUserProfileData = async () => {
  try {
    const response = await fetch(`https://naman77s.github.io/quizapi/userData.json`);
    console.log(response);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const checkUserData = await response.json();
    checkUserData.forEach((user) => {
      if (user.userEmail === localStorage.getItem("inEmailValue") && user.userPass === localStorage.getItem("inPasswordValue")) {
          userName.innerHTML = user.userName;
          userCurClass.innerHTML = user.userClass + "th";
          userSchool.innerHTML = user.userSchool;
          userEmail.innerHTML = user.userEmail;

          path = user.userClass;
      
          var chart = anychart.pie();

          // set the chart title
          // chart.title("Population by Race for the United States: 2010 Census");
          var data = [
            {x: "Total Questions Attempt", value: user.totalQs},
            {x: "Total Correct", value: user.totalScore},
          ]
          // add the data
          chart.data(data);
          // set legend position
          chart.legend().position("right");
          // set items layout
          chart.legend().itemsLayout("vertical");
          // display the chart in the container
          chart.container('statsChart');
          chart.draw();

        // userPhone = user.userPhone;
        // userAddress = user.userAddress;
        // userCity = user.userCity;
        // userState = user.userState;
        // userPincode = user.userPincode;
        // userCountry = user.userCountry;
        // userGender = user.userGender;
        // userDOB = user.userDOB;
        // userAge = user.userAge;
        // userSchoolBoard = user.userSchoolBoard;
        // userSchoolCity = user.userSchoolCity;
        // userSchoolState = user.userSchoolState;
        // userSchoolPincode = user.userSchoolPincode;
        // userSchoolCountry = user.userSchoolCountry;
        // userSchoolPhone = user.userSchoolPhone;
        // userSchoolEmail = user.userSchoolEmail;
        // userSchoolWebsite = user.userSchoolWebsite;
        // userSchoolAddress = user.userSchoolAddress;
        // userSchoolType = user.userSchoolType;
        // userSchoolMedium = user.userSchoolMedium;

        
      }
    });
  } catch (error) {
    console.error(error);
  }
  return path;
};
const getUserClassDataOut = async () => {
  pathVal = await getUserProfileData();
  path = "Class_" + pathVal + "th";
  classInNameProfile.innerHTML = pathVal + "th";
  classInName.innerHTML = pathVal + "th";

}
getUserClassDataOut()

const getQuiz = async (dirName, fileName) => {
  try {
      const response = await fetch(`https://naman77s.github.io/${repoName}/${path}/${dirName}/${fileName}`);
      if (!response.ok) {
          throw new Error(response.statusText);
         // containerOngoing.innerHTML = "Uh ohh , Something went wrong"
      }
      quizData = await response.json();
      if (!Array.isArray(quizData)) {
          throw new Error("Data is not an array");
      }
      quiz.style.display = "block"
      containerOngoing.style.display = "none"
      Bar.style.display = "none"
      BarChild.style.display = "none"
      $("#bottom-nav").fadeOut(100);
      $("#header-div-container").fadeOut(100);
      loadQuiz()
      totalQues.innerHTML = quizData.length
  } catch (error) {
      console.error(error);
  }
};
// if(window.location.href === ".../client-panel/client-panel.html"){
//   if (window.history && window.history.pushState) {

//     window.history.pushState('forward', null, './#forward');

//     $(window).on('popstate', function() {
//       alert('Back button was pressed.');
//     });

//   }
// }
const displayFiles = async (dirName) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${path}/${dirName}`);
      if (!response.ok) {
          const erRes = `<p class="err-response">Uh ohh , &#129301; <br> Seems like nothing found<br> Try searching for something else </p>`
          containeOngoingQuizDataUser.insertAdjacentHTML('beforeend' , erRes);
          throw new Error(response.statusText);

      }else{
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
      }

    } catch (error) {
      console.error(error);
    }
  }
  
  // subjectInUser.addEventListener('change', (e) => {
    
  //   if(subjectInUserVal === " "){
  //     containeOngoingQuizDataUser.innerHTML = "";
  //     displayFiles("Maths");
  // }else{
  //   subjectInUserVal = e.target.value;
  //   containeOngoingQuizDataUser.innerHTML = "";
  //   displayFiles(subjectInUserVal);
  // }}
  // );
  sBlocks.forEach(sBlock => {
  sBlock.addEventListener("click", (e) => replaceQp(e));
});
  function replaceQp(e) {
    $('#dashboard-user').fadeOut(800);
    userDashboard.style.display = "none";
    $('#container-quiz-user').fadeIn(800);
    quizSection.style.display = "block";
    console.log(e.target.id);
    if(e.target.id === "Maths" || e.target.id === ""){
      containeOngoingQuizDataUser.innerHTML = "";
      displayFiles("Maths");
      subjectInName.innerHTML = "Maths";
    }
/*    else if(e.target.id === "Science"){
      containeOngoingQuizDataUser.innerHTML = "";
      displayFiles("Science");
      subjectInName.innerHTML = "Science";
    }*/
    else{
      containeOngoingQuizDataUser.innerHTML = "";
      displayFiles(e.target.id);
      subjectInName.innerHTML = e.target.id;
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
    containeOngoingQuizDataUser.innerHTML = "";
	    var resquiz = `
	    <h2>You answered ${score}/${quizData.length} questions correctly</h2>
	    <button class="reload-user-quiz" onclick="sendAndReload(${score} , ${quizData.length})">Solve More</button>
	    `
      quiz.innerHTML = resquiz;

	    scoreSec.style.display = "none"
	}
}
const getSha = async (owner, repo, path) => {
  try {
      const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path
      });
      return data.sha;
  } catch (error) {
      console.error(error);
  }
  }
    function sendAndReload(score , quizDataLength) {
      setStatsUser(score , quizDataLength);
      
    }
    import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
		const octokit = new Octokit();
		function setStatsUser(score , quizDataLength){
      const getUserDataForStats = async () => {
    try {
        const response = await fetch(`https://naman77s.github.io/quizapi/userData.json`);
        console.log(response);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const prevUserData = await response.json();
      prevUserData.forEach((user) => {
      if (user.userEmail === localStorage.getItem("inEmailValue") && user.userPass === localStorage.getItem("inPasswordValue")) {
        // user.push(score);
        // user+=score;
        // user+=quizDataLength;

        // var scoreNum = score.toString()
        // var quizDataLengthNum = quizDataLength.toString()
        user.totalScore += score;
        user.totalQs += quizDataLength;

        // tempObj[0].tempVal += tempVal;
        
        // user= {...user, score: user.totalScore + scoreNum};
        // user= {...user, quizDataLength: user.totalQs + quizDataLengthNum};


      }
    }); 
      console.log(prevUserData);
  
        return prevUserData
    } catch (error) {
        console.error(error);
    }
  };
  

    const octokitAPI = new Octokit({
      auth: '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'
    })

        const sending = async (encodedUserData, sha) => {
          console.log("sending to git");

          try {
            await octokitAPI.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                
              owner: 'naman77s',
              repo: 'quizapi',
              path: `userData.json`,
              message: `Database updated`,
              committer: {
                name: 'Naman Saini',
                email: 'thisispxd@gmail.com'
              },
              content: encodedUserData,
              sha : sha
            });
            e.preventDefault();
            console.log("sent to git");
          } catch (error) {
            console.error(error);
            console.log("error sending data to git");
          }
        };

async function main() {
        var shaSet = await getSha("naman77s", "quizapi", "userData.json");
        var shaGet = shaSet.toString();
        console.log(shaGet);
        var sha = await shaSet;
        var updatedUserData = await getUserDataForStats();
        var encodedUserData = btoa(JSON.stringify(updatedUserData));
        await sending(encodedUserData, sha);
        setTimeout(() => {
          window.location.reload();
        })
    }
    main();
}


// ${score}/${quizData.length}
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
quizNav.addEventListener('click', () => {
  $("#container-profile-user").fadeOut(300);
  profileSection.style.display = "none"
  $("#dash-and-quiz").fadeIn(800);
  $("#dashboard-user").fadeIn(800);
  userDashboard.style.display = "block"
  quizSection.style.display = "none"
  
})
userNav.addEventListener('click', () => {
  $("#container-profile-user").fadeIn(800);
  profileSection.style.display = "block"
  $("#dash-and-quiz").fadeOut(300);
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


window.getQuiz = getQuiz;
window.sendAndReload = sendAndReload;