let questions = [];
let questionIndex = 0;
let timer;
let timerInterval;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = [];

function fetchQuestions() {
    fetch('preguntas.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            loadQuestion();
        })
        .catch(error => console.error('Error al cargar las preguntas:', error));
}

function loadQuestion() {
    if (questionIndex < questions.length) {
        // Actualizar el número de pregunta en la esquina superior derecha
        const questionCounter = document.getElementById('question-counter');
        if (questionCounter) {
            questionCounter.textContent = `Pregunta ${questionIndex + 1} de ${questions.length}`;
        }

        // Cargar la nueva pregunta
        const currentQuestion = questions[questionIndex];
        const questionTitle = document.getElementById('question-title');
        const optionsDiv = document.getElementById('options');

        if (questionTitle && optionsDiv) {
            questionTitle.textContent = `Pregunta ${questionIndex + 1}: ${currentQuestion.question}`;
            
            // Cargar las nuevas opciones
            optionsDiv.innerHTML = ''; // Limpiar opciones anteriores
            currentQuestion.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.classList.add('option');
                button.textContent = option;
                button.onclick = () => checkAnswer(button, index === currentQuestion.correct);
                optionsDiv.appendChild(button);
            });

            // Reiniciar el temporizador
            if (timerInterval) clearInterval(timerInterval); // Detener el temporizador anterior si existe
            timer = 30;
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.textContent = `Tiempo restante: ${timer}`;
            }
            startTimer();
        }
    } else {
        // Si no hay más preguntas
        const questionTitle = document.getElementById('question-title');
        const optionsDiv = document.getElementById('options');
        const timerElement = document.getElementById('timer');
        const incorrectDiv = document.getElementById('incorrect-questions');
        const resultDiv = document.getElementById('results');
        const questionCounter = document.getElementById('question-counter'); // Agregar referencia al contador

        if (questionTitle && optionsDiv && timerElement && incorrectDiv && resultDiv) {
            questionTitle.textContent = "¡Has terminado el cuestionario!";
            optionsDiv.innerHTML = '';
            timerElement.textContent = '';
            questionCounter.textContent = ''; // Limpiar el contador de preguntas

            // Mostrar preguntas incorrectas
            incorrectDiv.innerHTML = '<h2>Preguntas Incorrectas</h2>';
            incorrectAnswers.forEach((item, index) => {
                const p = document.createElement('p');
                p.textContent = `Pregunta: ${item.question} - Respuesta Seleccionada: ${item.selected} - Respuesta Correcta: ${item.correct}`;
                incorrectDiv.appendChild(p);
            });

            // Mostrar resumen de resultados
            resultDiv.innerHTML = `<h2>Resumen</h2>
                                   <p>Puntaje Total: ${score}</p>
                                   <p>Respuestas Correctas: ${correctAnswers} / ${questions.length}</p>`;
        }
    }
}

function checkAnswer(button, isCorrect) {
    if (button) {
        // Implementa la lógica para verificar si la respuesta es correcta
        // Actualiza el puntaje y el número de respuestas correctas o incorrectas
        // Cambia el estilo del botón según la respuesta
        if (isCorrect) {
            button.classList.add('correct');
            score++;
            correctAnswers++;
        } else {
            button.classList.add('incorrect');
            incorrectAnswers.push({
                question: document.getElementById('question-title').textContent,
                selected: button.textContent,
                correct: questions[questionIndex].options[questions[questionIndex].correct]
            });
        }
        questionIndex++;
        if (timerInterval) clearInterval(timerInterval); // Detener el temporizador cuando se selecciona una respuesta
        setTimeout(() => {
            loadQuestion();
        }, 1000); // Cambia de pregunta después de 1 segundo
    }
}

function startTimer() {
    timer = 30;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = `Tiempo restante: ${timer}`;
    }
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            timerElement.textContent = `Tiempo restante: ${timer}`;
        } else {
            clearInterval(timerInterval); // Detener el temporizador cuando el tiempo se agota
            checkAnswer(null, false); // Marca la respuesta como incorrecta cuando el tiempo se agota
        }
    }, 1000);
}

// Inicializar la carga de preguntas cuando la página cargue
window.onload = fetchQuestions;
