const content = document.getElementById('content');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

let isAnswerLoading = false;
let answerSectionId = 0;

sendButton.addEventListener('click', () => handleSendMessage());
chatInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        handleSendMessage();
    }
});

function handleSendMessage() {
    const question = chatInput.value.trim();
    if (question === '' || isAnswerLoading) return;

    sendButton.classList.add('send-button-nonactive');
    addQuestionSection(question);
    chatInput.value = '';
}

function addQuestionSection(question) {
    const questionSection = document.createElement('section');
    questionSection.classList.add('question-section');
    questionSection.innerText = question;
    content.appendChild(questionSection);

    addAnswerSection(question);
}

function addAnswerSection(question) {
    const answerSection = document.createElement('section');
    answerSection.classList.add('answer-section');
    answerSection.id = `answer-${answerSectionId}`;
    content.appendChild(answerSection);

    isAnswerLoading = true;
    getAnswer(question, answerSectionId);
    answerSectionId++;
}

function getAnswer(question, id) {
    fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: question })
    })
    .then(res => res.json())
    .then(data => {
        const answerEl = document.getElementById(`answer-${id}`);
        if (answerEl) {
          answerEl.innerText = data.reply;
        }
        })
    .catch(err => {
        const errorEl = document.getElementById(`answer-${id}`);
        if (errorEl) errorEl.innerText = "Error getting response.";
    })
    .finally(() => {
        isAnswerLoading = false;
        sendButton.classList.remove('send-button-nonactive');
    });
}

function addQuestionSection(message) {
    isAnswerLoading = true;
    // Create section element
    const sectionElement = document.createElement('section');
    sectionElement.className = 'question-section';
    sectionElement.textContent = message;

    content.appendChild(sectionElement);
    // Add answer section after added question section
    addAnswerSection(message)
    scrollToBottom();
}

function addAnswerSection(message) {
    if (isAnswerLoading) {
        // Increment answer section ID for tracking
        answerSectionId++;
        // Create and empty answer section with a loading animation
        const sectionElement = document.createElement('section');
        sectionElement.className = 'answer-section';
        sectionElement.innerHTML = getLoadingSvg();
        sectionElement.id = `answer-${answerSectionId}`;

        content.appendChild(sectionElement);
        getAnswer(message, answerSectionId);
    } else {
        // Fill in the answer once it's received
        const answerSectionElement = document.getElementById(answerSectionId);
        answerSectionElement.textContent = message;
    }
}

function getLoadingSvg() {
    return `<svg style="height: 25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#137A7F" stroke="#137A7F" stroke-width="15" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#137A7F" stroke="#137A7F" stroke-width="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#137A7F" stroke="#137A7F" stroke-width="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>`;
}

function scrollToBottom() {
    content.scrollTo({
        top: content.scrollHeight,
        behavior: 'smooth',
    });
}