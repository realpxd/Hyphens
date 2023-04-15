// Importing the required modules
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
import { octokitAuthKey , repoOwner , repoName , commiterName , commiterEmail } from "../credentials/secure.js";

// Intial database
const quizData = [];

// Local variables
var count = 1;
var submitting = false;
let endQuizClicked = false;

// Function to submit the current question 
submitBtn.onclick = function pushing(e){
  e.preventDefault();
/*  const classInVal = classIn.value.replace(/ /g, "_");
  const subjectInVal = subjectIn.value.replace(/ /g, "_");
  const chapterInVal = chapterIn.value.replace(/ /g, "_");
  console.log(classInVal + subjectInVal + chapterInVal);*/
  //console.log("class" + classIn.value + subjectIn.value + chapterIn.value);
  function countQues(){
    count++
    quesNum.innerHTML = count
    return count
  }
  console.log(quizData);
  
  // Function to get the selected answer
  function getSelected() {
    let answer
    answerEls.forEach(answerEl => {
        if(answerEl.checked) {
            answer = answerEl.id
        }
    })
    return answer
  }

  // Function to deselect the answers after submitting the question to Conitnue writing next question or submit quiz paper
  function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false)
  }

  // Function for pushing the question to the intial database
  function selectedAns() {
    countQues()
    const answer = getSelected()
    const newQuiz = {
      question: ques.value,
      a: a_text.value,
      b: b_text.value,
      c: c_text.value ,
      d: d_text.value ,
      hint: hintIn.value,
      correct: answer
    }
    quizData.push(newQuiz);
  }

  // Function to get the selected answer or check if any answer is selected or not
  function getSel() {
    let answerSelected = false;
    answerEls.forEach(answerEl => {
      if(answerEl.checked) {
        answerSelected = true;
      }
    });
    if(answerSelected) {
      selectedAns();
      deselectAnswers()
      if(!endQuizClicked) {
        quizCont.reset();
      } else {
        endQuizClicked = false;
      }
    } else {
      alert("Please select an answer before submitting the Quiz");
    }
  }
    // Calling the function
    getSel()

    const octokitAPI = new Octokit({
      auth: octokitAuthKey
    })
    // Function to submit the quiz paper to the github repository
    endBtn.onclick = function endQuiz() {
      e.preventDefault();
      console.log("end quiz clicked");
      submitting = !submitting;

      // Function to get the current date and time
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      let day = date.getDate();
      day = day < 10 ? '0' + day : day;
      let hours = date.getHours();
      hours = hours < 10 ? '0' + hours : hours;
      let minutes = date.getMinutes();
      minutes = minutes < 10 ? '0' + minutes : minutes;
      let seconds = date.getSeconds();
      seconds = seconds < 10 ? '0' + seconds : seconds;

      // Creating the file name
      let quizNum = year + '-' + month + '-' + day + '_' + hours + '-' + minutes + '-' + seconds;
	 
	  
	  
	 
	
	
	
      // Function to send the data to the github repository
      if(submitting) {
        endBtn.innerHTML = "Confirm Submit"
       
        
        /*let myData = {
        name: "John Doe",
        age: 30,
        city: "New York"
        };*/
        
        
        
        
        let jsonData = JSON.stringify(quizData);
        
        let blob = new Blob([jsonData], {type: "application/json"});
        console.log(blob.type)
        console.log(blob)
        if (navigator.msSaveBlob) {
        // For IE and Edge
        navigator.msSaveBlob(blob, `${quizNum}.json`);
        } else {
        let downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        //downloadLink.style.display = "none";
        
        if (downloadLink.download !== undefined) {
       		
       		downloadLink.setAttribute("download", , `${quizNum}.json`);
       		downloadLink.setAttribute("target", "_blank");
        }
      
        //quizCont.appendChild(downloadLink);
        
        try {
        downloadLink.click();
        alert("File saved succesfully ,\n Now click on Confirm Submit button to Upload the File to Server.\n\n If you get any error while uploading file to server, then just locate the downlaoded file and send it to the developers. ✨ ");
        } catch (error) {
        alert("Error downloading file , Report to the developers : " , error);
        }
        
        //quizCont.removeChild(downloadLink);
        }
       
       
      
      } else {
        e.preventDefault();
        console.log("started sending to git");
        const classInVal = classIn.value.replace(/ /g, "_");
        const subjectInVal = subjectIn.value.replace(/ /g, "_");
        const chapterInVal = chapterIn.value.replace(/ /g, "_");
        
        // Sending the data to the github repository
        const sending = async () => {
          getSel();
          var encodedQuizData = btoa(JSON.stringify(quizData));
          endBtn.innerHTML = "End Quiz";
          console.log("sending to git");
          try {
            await octokitAPI.request('PUT /repos/{owner}/{repo}/contents/{path}', {
              owner: repoOwner,
              repo: repoName,
              path: `${classInVal}/${subjectInVal}/${chapterInVal}/quiz-${quizNum}.json`,
              message: `Question paper added of class : ${classInVal} , subject is ${subjectInVal} and chapter is ${chapterInVal}`,
              committer: {
                name: commiterName,
                email: commiterEmail
              },
              content: encodedQuizData
            });
              console.log("changing count to 1");
              count = 0;
              console.log("changed count to 1");
              classIn.value = "";
              subjectIn.value = "";
              chapterIn.value = "";

            e.preventDefault();
            console.log("sent to git");
            alert("Data uploaded succesfully. \n Now refresh this page to upload next Question Paper. ✨");
          } catch (error) {
            alert(error + "\n Report this information to the developers.");
            console.log("error sending data to git");
          }
        };
        
        // Checking if the class name and subject name is entered or not
        if(classInVal==="none" || subjectInVal==="none" || chapterInVal==="none"){
          alert("Please enter a valid Class name , Subject name & Chapter");
          submitting = true;
        
      
      
          return;
        }else{
          e.preventDefault();
          console.log("classname , subject & chapter verified , sending to git");
          sending();
        }
      }
    }
  }
        