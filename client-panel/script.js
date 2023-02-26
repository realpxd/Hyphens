// Importing the required modules and variables
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
import { octokitAuthKey , repoOwner , repoName , databaseName , commiterName , commiterEmail } from "../credentials/secure.js";

// Intializing the Octokit
// Octokit is a library that helps us to interact with the GitHub API
const octokit = new Octokit();




// Some local variables
var containeOngoingQuizDataUser = document.getElementById("container-ongoing-quiz-data-user")
// var userClass = "Class_10th";
var score = 0
var currentQuiz = 0
var quizData = []
      // let quizDataUser = []
      // const username = "naman77s";
      // const repoName = "quizapi";

// Setting up variables for path to get quiz files
//  Assigning local value to Path
var path = "Class_10th";
var pathVal;

// Removing the quiz container
quiz.style.display = "none"

// Getting the user profile data
const getUserProfileData = async () => {
  try {
    const response = await fetch(`https://${repoOwner}.github.io/${repoName}/${databaseName}`);
    console.log(response);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const checkUserData = await response.json();
    checkUserData.forEach((user) => {
      // Checking if the user exists and getting the user data
      // If user exists , it's data is accessed from the api and displayed
      if (user.userEmail === localStorage.getItem("inEmailValue") && user.userPass === localStorage.getItem("inPasswordValue")) {
          // General user data
          userName.innerHTML = user.userName;
          userCurClass.innerHTML = user.userClass + "th";
          userSchool.innerHTML = user.userSchool;
          userEmail.innerHTML = user.userEmail;

          // Path for the quiz files
          path = user.userClass;
      
          // Chart data for statistics
          var chart = anychart.pie();
          // Set Chart Data
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

          // Some more user data incase if required in future versions, but this data is not initialized in the databse
             
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
  // Storing the path outside the function
  return path;
};
// Calling the function
// Accesing the Path
const getUserClassDataOut = async () => {
  pathVal = await getUserProfileData();
  // storing value of path in a variable
  path = "Class_" + pathVal + "th";
  classInNameProfile.innerHTML = pathVal + "th";
  classInName.innerHTML = pathVal + "th";
}
getUserClassDataOut()

// Subjects slider 
  //  Subjects List
  const subjectsList = {
    "Class_9th" : ["Maths"],
    "Class_10th" : ["Maths" , "Biology"],
    "Class_11th" : ["Maths"],
    "Class_12th" : ["Maths"]
  }

  // Local variable for subjects slider
  let subjectsContainer = "";
  // Checking the subjectsList object for the path 
  // If the path is present in the object , then the subjects are displayed
  // Path is the user class
  if(Object.keys(subjectsList).includes(path)){
    // Getting the index of the path in the object
      // Local variable for index of the path
      let sub = Object.keys(subjectsList).indexOf(path);
      let subject = subjectsList[Object.keys(subjectsList)[sub]];
      subject.forEach((sub) => {
        subjectsContainer += `
          <div class="ss-blocks">
            <img src="../assets/img/${sub}.jpg" alt="Subject" id="${sub}" onerror="removeSubject(this)" onclick="replaceQp('${sub}')">
          </div>
        `
    })
  }
  // Adding / Appending the subjects to the subjects slider
  subjectsSlider.insertAdjacentHTML("beforeend", subjectsContainer);

  //  Function to remove the subject if the image is not found
  function removeSubject(img) {
    img.parentNode.remove();
  }

// Function to access the quiz data of the selected quiz paper
const getQuiz = async (dirName, fileName) => {
  try {
      const response = await fetch(`https://${repoOwner}.github.io/${repoName}/${path}/${dirName}/${fileName}`);
      if (!response.ok) {
          throw new Error(response.statusText);
      }
      quizData = await response.json();
      if (!Array.isArray(quizData)) {
          throw new Error("Data is not an array");
      }
      // Displaying the quiz container
      quiz.style.display = "block"
      // Hiding the Quiz Files container
      containeOngoingQuizDataUser.style.display = "none"
      // Hiding the Header Bars container
      Bar.style.display = "none"
      BarChild[0].style.display = "none"
      BarChild[1].style.display = "none"
      // Hiding the Bottom Nav Bar
      navBar.style.display = "none"
      $("#bottom-nav").fadeOut(100);
      $("#header-div-container").fadeOut(100);

      // Loading the quiz
      loadQuiz()
      totalQues.innerHTML = quizData.length

      // Blocking the user from going back to the previous page
      history.pushState(null, document.title, location.href);
      window.addEventListener('popstate', function (event){
        history.pushState(null, document.title, location.href);
      });
  } catch (error) {
      console.error(error);
  }
};

// Function to display the quiz files
const displayFiles = async (dirName) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}/${dirName}`);
      if (!response.ok) {
          const erRes = `<p class="err-response">Uh ohh , &#129301; <br> Seems like nothing found<br> Try searching for something else </p>`
          containeOngoingQuizDataUser.insertAdjacentHTML('beforeend' , erRes);
          throw new Error(response.statusText);

      }else{
        // Getting the data from the response
	      const fileData = await response.json();
        // Reversing the data to get the latest data first
        fileData.reverse();
        // Looping through the data to get the file name and displaying it
	      fileData.forEach(file => {
	        const ongoingFeedData = `
	          <div class="quiz-box-user" id="quiz-box-user" onclick="getQuiz('${dirName}', '${file.name}')">
	            ${file.name}
	          </div> <hr>
	        `;
	        console.log("writing on doc" , file.name);
	        containeOngoingQuizDataUser.insertAdjacentHTML('beforeend' , ongoingFeedData);
      });
      }

    } catch (error) {
      console.error(error);
    }
}
  
// Replacing and setting the quiz files with the subjects slider
function replaceQp(e) {
  // Some animations
  $('#dashboard-user').fadeOut(800);
  userDashboard.style.display = "none";
  $('#container-quiz-user').fadeIn(800);
  quizSection.style.display = "block";
  console.log(e);

  // Checking if the subject is available or not
  if(e === "Maths" || e === ""){
    containeOngoingQuizDataUser.innerHTML = "";
    displayFiles("Maths");
    subjectInName.innerHTML = "Maths";
  }
  else{
    containeOngoingQuizDataUser.innerHTML = "";
    displayFiles(e);
    subjectInName.innerHTML = e;
  }
}
// Calling the function to display the Math quiz files as default
displayFiles("Maths");

// Function to load the quiz
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

// Function to deselect the answers after submitting the previous answers to get the next questions
const deselectAnswers = () => {
    answerEls.forEach(answerEl => answerEl.checked = false)
}

// Function to get the selected answer from the user
const getSelected = () => {
    let answer
    answerEls.forEach(answerEl => {
        if(answerEl.checked) {
            answer = answerEl.id
        }
    })
    return answer
}

// Function to check if the quiz is finished or not
const push = () => { 
	if(currentQuiz < quizData.length) {
	    loadQuiz()
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

// Function to get the sha of the userfile to update it after the quiz is finished
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

// Function to update the userfile after the quiz is finished
function sendAndReload(score , quizDataLength) {
    setStatsUser(score , quizDataLength);
    navBar.style.display = "grid"
    BarChild[0].style.display = "block"
    BarChild[1].style.display = "block"
    Bar.style.display = "block"
  }
  
  // Function to set the stats of the user
  function setStatsUser(score , quizDataLength){
    const getUserDataForStats = async () => {
  try {
      const response = await fetch(`https://${repoOwner}.github.io/${repoName}/${databaseName}`);
      console.log(response);
      if (!response.ok) {
          throw new Error(response.statusText);
      }
      const prevUserData = await response.json();
    // Getting the previous stats and updating accordingly
    prevUserData.forEach((user) => {
    if (user.userEmail === localStorage.getItem("inEmailValue") && user.userPass === localStorage.getItem("inPasswordValue")) {
      user.totalScore += score;
      user.totalQs += quizDataLength;
    }
  }); 
  console.log(prevUserData);

    return prevUserData
  } catch (error) {
      console.error(error);
  }
};


  const octokitAPI = new Octokit({
    auth: octokitAuthKey
  })

      const sending = async (encodedUserData, sha) => {
        console.log("sending to git");

        try {
          await octokitAPI.request('PUT /repos/{owner}/{repo}/contents/{path}', {
              
            owner: repoOwner,
            repo: repoName,
            path: databaseName,
            message: `Database updated`,
            committer: {
              name: commiterName,
              email: commiterEmail
            },
            content: encodedUserData,
            sha : sha
          });
          //e.preventDefault();
          console.log("sent to git");
        } catch (error) {
          console.error(error);
          console.log("error sending data to git");
        }
      };

// Calling the functions to update the userfile
async function main() {
        var shaSet = await getSha(repoOwner, repoName, databaseName);
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

// Event listeners for the submit button to check the answers and increment score with quiz 
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

// Event listeners for the navigation bar
// Required to switch between the Dashboard and the Profile page
  quizNav.addEventListener('click', () => {
    $("#container-profile-user").fadeOut(300);
    profileSection.style.display = "none"
    $("#dash-and-quiz").fadeIn(800);
    $("#dashboard-user").fadeIn(800);
    userDashboard.style.display = "block"
    quizSection.style.display = "none"
    /*Bar.style.display = "block"
    BarChild[0].style.display = "block"
      BarChild[1].style.display = "block"*/
    
  })
  userNav.addEventListener('click', () => {
    $("#container-profile-user").fadeIn(800);
    /*Bar.style.display = "block"
    BarChild.style.display = "block"*/
    profileSection.style.display = "block"
    $("#dash-and-quiz").fadeOut(300);
  })


// Check if the user is logged in or not
if (localStorage.getItem("inEmailValue") == null && localStorage.getItem("inPasswordValue") == null) {
  window.location.href = "../index.html";
}

// Exporting the functions to the global scope
window.removeSubject = removeSubject;
window.replaceQp = replaceQp;
window.getQuiz = getQuiz;
window.sendAndReload = sendAndReload;