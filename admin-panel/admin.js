import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
const quizData = [];
var count = 1;
var submitting = false;
let endQuizClicked = false;



submitBtn.onclick = function pushing(e){
  e.preventDefault();
  function countQues(){
    count++
    quesNum.innerHTML = count
    return count
  }
  
  console.log(quizData);
  
  function getSelected() {
    let answer
    answerEls.forEach(answerEl => {
        if(answerEl.checked) {
            answer = answerEl.id
        }
    })
    return answer
  }

  function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false)
  }

  function selectedAns() {
    countQues()
    const answer = getSelected()
    const newQuiz = {
      question: ques.value,
      a: a_text.value,
      b: b_text.value,
      c: c_text.value ,
      d: d_text.value ,
      correct: answer
    }
    quizData.push(newQuiz);
  }

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
    getSel()

    const octokitAPI = new Octokit({
      auth: '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'
    })
    
    
    endBtn.onclick = function endQuiz() {
      e.preventDefault();
      console.log("end quiz clicked");
      submitting = !submitting;

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

      let quizNum = year + '-' + month + '-' + day + '_' + hours + '-' + minutes + '-' + seconds;


      if(submitting) {
        endBtn.innerHTML = "Confirm Submit"
      } else {
        e.preventDefault();
        console.log("started sending to git");
        const classInVal = classIn.value.replace(/ /g, "_");
        const subjectInVal = subjectIn.value.replace(/ /g, "_");
        const sending = async () => {
          getSel();
          var encodedQuizData = btoa(JSON.stringify(quizData));
          endBtn.innerHTML = "End Quiz";
          console.log("sending to git");
          try {
            await octokitAPI.request('PUT /repos/{owner}/{repo}/contents/{path}', {
              owner: 'naman77s',
              repo: 'quizapi',
              path: `${classInVal}/${subjectInVal}/quiz-${quizNum}.json`,
              message: `Question paper added of class : ${classInVal} and subject is ${subjectInVal}`,
              committer: {
                name: 'Naman Saini',
                email: 'thisispxd@gmail.com'
              },
              content: encodedQuizData
            });
              console.log("changing count to 1");
              count = 0;
              console.log("changed count to 1");
              classIn.value = "";
              subjectIn.value = "";

            e.preventDefault();
            console.log("sent to git");
          } catch (error) {
            alert(error);
            console.log("error sending data to git");
          }
        };
        
        if(classInVal==="" || subjectInVal===""){
          alert("Please enter the Class name & Subject name");
          submitting = true;
          return;
        }else{
          e.preventDefault();
          console.log("classname & subject verified , sending to git");
          sending();
        }
      }
    }
  }
        