// Event listener que espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencia al modal y al botón de cerrar
    var infoModal = document.getElementById('infoModal');
    var closeModalButton = document.getElementById('closeModal');

    // Event listener que cierra el modal cuando se hace clic en el botón de cerrar
    closeModalButton.addEventListener('click', function() {
        infoModal.style.display = 'none'; // Ocultar el modal cambiando su estilo de visualización
    });
});

// Variables globales para la simulación
let running = false;
let intervalId;
let currentBatch = 0;
let totalProbability = 0;
let successfulWalks = 0;
let numIterations = 100000;
const batchSize = 10000;

// Event listeners para los botones de control de la simulación
document.getElementById('runSimulation').addEventListener('click', startSimulation);
document.getElementById('stopSimulation').addEventListener('click', stopSimulation);
document.getElementById('resetSimulation').addEventListener('click', resetSimulation);

// Función para iniciar la simulación
function startSimulation() {
    numIterations = parseInt(document.getElementById('iterations').value); // Obtener el número de iteraciones desde el input
    running = true; // Indicar que la simulación está corriendo
    processBatch(); // Iniciar el procesamiento del lote inicial

    // Iniciar un intervalo para procesar lotes continuamente
    if (!intervalId) {
        intervalId = setInterval(processBatch, 1000);
    }
}

// Función para detener la simulación
function stopSimulation() {
    running = false; // Indicar que la simulación está detenida
    clearInterval(intervalId); // Limpiar el intervalo
    intervalId = null; // Reiniciar el ID del intervalo
}

// Función para reiniciar la simulación
function resetSimulation() {
    stopSimulation(); // Detener la simulación
    currentBatch = 0; // Reiniciar el contador del lote actual
    totalProbability = 0; // Reiniciar la probabilidad total
    successfulWalks = 0; // Reiniciar el contador de caminatas exitosas
    document.getElementById('result').innerText = ''; // Limpiar el resultado en el HTML
    const canvas = document.getElementById('walkCanvas'); // Obtener referencia al canvas
    const ctx = canvas.getContext('2d'); // Obtener el contexto del canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
}

// Función para procesar un lote de iteraciones de la simulación
function processBatch() {
    if (!running) return; // Si la simulación no está corriendo, salir de la función

    const numSteps = 10; // Número de pasos en cada caminata
    const numBatches = Math.ceil(numIterations / batchSize); // Calcular el número de lotes necesarios
    const canvas = document.getElementById('walkCanvas'); // Obtener referencia al canvas
    const ctx = canvas.getContext('2d'); // Obtener el contexto del canvas
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)'; // Establecer el color de las líneas

    // Iterar sobre cada iteración en el lote actual
    for (let i = 0; i < batchSize && (currentBatch * batchSize + i) < numIterations; i++) {
        const result = simulateWalk(numSteps); // Simular una caminata
        if (result.success) {
            successfulWalks++; // Incrementar el contador de caminatas exitosas si la caminata fue exitosa
        }
        if (currentBatch === 0) { // Dibujar solo el primer lote para visualizar el recorrido
            drawWalk(result.path, ctx); // Dibujar el recorrido en el canvas
        }
    }

    currentBatch++; // Avanzar al siguiente lote
    if (currentBatch >= numBatches) {
        // Calcular la probabilidad y mostrarla en el HTML
        const probability = (successfulWalks / numIterations) * 100;
        document.getElementById('result').innerText = `Probabilidad de estar a dos calles de distancia después de 10 pasos: ${probability.toFixed(2)}%`;
        currentBatch = 0; // Reiniciar el contador del lote
        successfulWalks = 0; // Reiniciar el contador de caminatas exitosas
    }
}

// Función para simular una caminata
function simulateWalk(numSteps) {
    let x = 0;
    let y = 0;
    const path = [{ x: 250, y: 250 }]; // Ruta para el dibujo

    // Iterar sobre el número de pasos
    for (let i = 0; i < numSteps; i++) {
        const direction = Math.floor(Math.random() * 4); // Generar una dirección aleatoria

        // Mover en la dirección generada
        switch (direction) {
            case 0: y++; break; // Norte
            case 1: y--; break; // Sur
            case 2: x++; break; // Este
            case 3: x--; break; // Oeste
        }

        if (i < 10) { // Limitar el número de pasos dibujados
            path.push({ x: 250 + x * 10, y: 250 + y * 10 });
        }
    }

    const distance = Math.abs(x) + Math.abs(y); // Calcular la distancia total
    return { success: distance === 2, path: path }; // Devolver el resultado de la caminata
}

// Función para dibujar el recorrido en el canvas
function drawWalk(path, ctx) {
    ctx.beginPath(); // Comenzar el dibujo
    ctx.moveTo(path[0].x, path[0].y); // Mover al primer punto

    // Iterar sobre cada punto en la ruta
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y); // Dibujar una línea al siguiente punto
    }

    ctx.stroke(); // Realizar el dibujo
}
