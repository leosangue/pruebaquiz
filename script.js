let score = 0;
let timer = 30;
let interval;
let questionIndex = 0; // Índice para las preguntas
let questions = []; // Definir la variable questions
const timeBonus = 10; 
let correctAnswers = 0; // Contador de respuestas correctas

// Array para almacenar preguntas incorrectas y respuestas seleccionadas
const incorrectAnswers = [];

function startTimer() {
    interval = setInterval(() => {
        if (timer > 0) {
            timer--;
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.textContent = `Tiempo restante: ${timer}`;
            }
        } else {
            clearInterval(interval);
            handleTimeout(); // Manejar tiempo agotado
        }
    }, 1000);
}

function loadQuestion(data) {
    questions = data; // Asignar datos cargados a la variable questions
    if (questionIndex < questions.length) {
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
                button.onclick = () => checkAnswer(button, index === currentQuestion.correct, currentQuestion);
                optionsDiv.appendChild(button);
            });

            // Reiniciar el temporizador
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

        if (questionTitle && optionsDiv && timerElement && incorrectDiv && resultDiv) {
            questionTitle.textContent = "¡Has terminado el cuestionario!";
            optionsDiv.innerHTML = '';
            timerElement.textContent = '';

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

function checkAnswer(button, isCorrect, question) {
    clearInterval(interval); // Detener temporizador

    const buttons = document.querySelectorAll('.option');
    buttons.forEach(btn => {
        // Deshabilitar todos los botones después de una selección
        btn.disabled = true;
        if (btn.textContent === question.options[question.correct]) {
            btn.style.backgroundColor = 'green'; // Respuesta correcta en verde
        } else if (btn === button) {
            btn.style.backgroundColor = 'red'; // Respuesta seleccionada incorrecta en rojo
        }
    });

    if (isCorrect) {
        score += 500 + (timer * 15); // Sumar puntaje basado en rapidez
        correctAnswers++; // Incrementar el conteo de respuestas correctas
    } else {
        // Registrar respuesta incorrecta
        incorrectAnswers.push({
            question: question.question,
            selected: button.textContent,
            correct: question.options[question.correct]
        });
    }

    // Actualizar puntaje
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Puntaje: ${score}`;
    }

    // Pasar a la siguiente pregunta después de 3 segundos
    setTimeout(() => {
        questionIndex++;
        loadQuestion(questions); // Pasar el array de preguntas a la función
    }, 3000); // Espera de 3 segundos
}

// Función para manejar el tiempo agotado
function handleTimeout() {
    // Registrar la respuesta incorrecta debido a tiempo agotado
    const currentQuestion = questions[questionIndex];
    incorrectAnswers.push({
        question: currentQuestion.question,
        selected: 'Tiempo agotado',
        correct: currentQuestion.options[currentQuestion.correct]
    });

    // Pasar a la siguiente pregunta después de 3 segundos
    setTimeout(() => {
        questionIndex++;
        loadQuestion(questions); // Pasar el array de preguntas a la función
    }, 3000); // Espera de 3 segundos
}

// Cargar las preguntas desde el archivo
fetch('preguntas.txt')
    .then(response => response.json())
    .then(data => {
        loadQuestion(data); // Pasar el array de preguntas a la función
    })
    .catch(error => console.error('Error al cargar las preguntas:', error));
