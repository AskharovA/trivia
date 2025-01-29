let dbData;
let categoryCont;

let qButtons = document.querySelector(".buttons");
let answerButton = document.querySelector(".get-answer-button")
let questionBg = document.querySelector("#question-bg");
let questionBlock = document.querySelector(".question-block");
let categoryName = document.querySelector(".category-name");
let questionText = document.querySelector(".question-text-block");
let categories = document.querySelectorAll(".nav-list-item");


if (!localStorage.getItem("triviaData")) {
    localStorage.setItem("triviaData", JSON.stringify([]));
}


async function loadData() {
    try {
        const response = await fetch('db.json');
        dbData = await response.json();
        console.log(dbData);
    } catch (error) {
        console.error(error);
    }
}

const mainCont = document.getElementById("main");

function createQuestionElem(id, name, price) {
    let elem = document.createElement("div");
    elem.classList.add("question-cont");
    elem.id = id;
    elem.innerText = name;
    if (price > 5) {
        elem.innerText = name + "\n" + price;
    }
    categoryCont.appendChild(elem);
}

function getCategory(id) {
    categoryCont = document.createElement("div");
    categoryCont.classList.add("category-cont");
    mainCont.appendChild(categoryCont);
    let playedQuestionsData = getDataFromLocalStorage();
    console.log(playedQuestionsData);

    dbData.forEach(elem => {
        if (elem.id == id) {
            categoryName.innerHTML = elem.name;
            elem.data.forEach(question => {
                if (!playedQuestionsData.includes(question.id)) {
                    createQuestionElem(question.id, question.name, question.price);
                }
            })
        }
    })
}

loadData();

const playedQuestions = [];

function getQuestion(questionID) {
    answerButton.id = questionID;
    questionBg.style.display = "block";
    setTimeout(
        () => {
            questionBlock.style.display = "flex";
            qButtons.style.display = "block";
            dbData.forEach(elem => {
                elem.data.forEach(question => {
                    if (question.id == questionID) {
                        console.log(question);
                        questionBlock.id = questionID;
                        questionText.innerText = question.question;
                        return
                    }
                })
            })
        }, 750
    )
}

function getAnswer(questionID) {
    playedQuestions.push(Number(questionID));
    setDataToLocalStorage();

    setTimeout(
        () => {
            dbData.forEach(elem => {
                elem.data.forEach(question => {
                    if (question.id == questionID) {
                        questionText.style.color = "greenyellow";
                        console.log(question);
                        questionText.innerText = question.answer;
                        return
                    }
                })
            })       
        }, 500
    )
}

function getActiveCategory() {
    categories.forEach(category => {
        if (category.classList.contains("active-category")) {
            console.log(category.id)
            getCategory(category.id)
            return
        }
    })
}

function getDataFromLocalStorage() {
    data = localStorage.getItem("triviaData");
    return JSON.parse(data)
}

function setDataToLocalStorage() {
    localStorage.setItem("triviaData", JSON.stringify(playedQuestions));
}

function clearLocalStorage() {
    localStorage.removeItem("triviaData");
}

document.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("question-cont")) {
        questionText.style.color = "white";
        getQuestion(e.target.id);
    }
    if (e.target.classList.contains("nav-list-item")) {
        categories.forEach(category => {
            category.classList.remove("active-category");
        })
        e.target.classList.add("active-category");
        mainCont.innerHTML = "";
        getCategory(e.target.id);
    }
    if (e.target.classList.contains("get-answer-button")) {
        questionText.innerText = "";
        getAnswer(e.target.id);
    }
    if (e.target.classList.contains("home-btn")) {
        questionText.style.color = "white";
        questionText.innerText = "";
        questionBlock.style.display = "none";
        questionBg.style.display = "none";
        qButtons.style.display = "none";
        mainCont.innerHTML = "";
        getActiveCategory();
    }
    if (e.target.classList.contains("new-game-button")) {
        clearLocalStorage();
        localStorage.setItem("triviaData", JSON.stringify([]))
        document.querySelector(".start-window").remove();
    }
    if (e.target.classList.contains("continue-game-button")) {
        document.querySelector(".start-window").remove();
    }
})
