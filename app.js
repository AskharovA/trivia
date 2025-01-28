let dbData;
let categoryCont;

let qButtons = document.querySelector(".buttons");
let answerButton = document.querySelector(".get-answer-button")
let questionBg = document.querySelector("#question-bg");
let questionBlock = document.querySelector(".question-block");
let categoryName = document.querySelector(".category-name");
let questionText = document.querySelector(".question-text-block");
let categories = document.querySelectorAll(".nav-list-item");


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

function createQuestionElem(id) {
    let elem = document.createElement("div");
    elem.classList.add("question-cont");
    elem.id = id;
    elem.innerText = id;
    categoryCont.appendChild(elem);
}

function getCategory(id) {
    categoryCont = document.createElement("div");
    categoryCont.classList.add("category-cont");
    mainCont.appendChild(categoryCont);

    dbData.forEach(elem => {
        if (elem.id == id) {
            categoryName.innerHTML = elem.name;
            elem.data.forEach(question => {
                if (!playedQuestions.includes(question.id)) {
                    createQuestionElem(question.id);
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
                        questionText.innerHTML = question.question;
                        return
                    }
                })
            })
        }, 750
    )
}

function getAnswer(questionID) {
    playedQuestions.push(Number(questionID));

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
})
