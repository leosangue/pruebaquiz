function loadQuestion(data) {
    questions = data; // Asignar datos cargados a la variable questions
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
