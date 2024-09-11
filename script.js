let questions = [];
let questionIndex = 0;
let timer;
let timerInterval;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = [];

// Función para cargar preguntas desde JSON
function fetchQuestions() {
    fetch('preguntas.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            loadQuestion();
        })
        .catch(error => console.error('Error al cargar las preguntas:', error));
}

// Función para cargar una nueva pregunta
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
            resetTimer();
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

// Función para verificar la respuesta seleccionada
function checkAnswer(button, isCorrect) {
    if (button) {
        // Deshabilitar todos los botones para evitar múltiples clics
        const optionsButtons = document.querySelectorAll('.option');
        optionsButtons.forEach(btn => {
            btn.disabled = true;
            if (btn.classList.contains('correct') || btn.classList.contains('incorrect')) {
                // Si ya tiene clase de respuesta, mantener su color
                btn.classList.add('disabled');
            }
        });

        // Implementa la lógica para verificar si la respuesta es correcta
        if (isCorrect) {
            button.classList.add('correct');
            score++;
            correctAnswers++;
        } else {
            button.classList.add('incorrect');
            const correctOption = Array.from(button.parentNode.children).find(btn => btn.textContent === questions[questionIndex].options[questions[questionIndex].correct]);
            if (correctOption) {
                correctOption.classList.add('correct');
            }
            incorrectAnswers.push({
                question: document.getElementById('question-title').textContent,
                selected: button.textContent,
                correct: questions[questionIndex].options[questions[questionIndex].correct]
            });
        }

        // Actualizar el puntaje en el HTML
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = `Puntaje: ${score}`;
        }

        // Detener el temporizador
        stopTimer();

        // Avanzar a la siguiente pregunta
        questionIndex++;
        setTimeout(() => {
            loadQuestion();
        }, 1000); // Cambia de pregunta después de 1 segundo
    }
}




// Función para iniciar el temporizador
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
            checkAnswer(null, false); // Marca la respuesta como incorrecta cuando el tiempo se agota
        }
    }, 1000);
}

// Función para detener el temporizador
function stopTimer() {
    clearInterval(timerInterval);
}

// Función para reiniciar el temporizador
function resetTimer() {
    timer = 30;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = `Tiempo restante: ${timer}`;
    }
    startTimer();
}

// Inicializar la carga de preguntas cuando la página cargue
window.onload = fetchQuestions;
