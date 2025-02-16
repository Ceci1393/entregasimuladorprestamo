// Función para guardar datos en LocalStorage
function guardarDatosEnStorage(datos) {
    localStorage.setItem('prestamo', JSON.stringify(datos));
}

// Función para obtener datos de LocalStorage
function obtenerDatosDeStorage() {
    return JSON.parse(localStorage.getItem('prestamo')) || null;
}

// Función para mostrar notificaciones con SweetAlert2
function mostrarNotificacion(tipo, mensaje) {
    Swal.fire({
        title: tipo === 'error' ? 'Error' : 'Éxito',
        text: mensaje,
        icon: tipo,
        confirmButtonText: 'OK'
    });
}

// Obtener tasa de interés desde la API
async function obtenerTasaInteres() {
    const tasaGuardada = localStorage.getItem("tasaInteres");
    if (tasaGuardada) {
        document.getElementById("tasa").value = tasaGuardada;
        return parseFloat(tasaGuardada);
    }

    try {
        const respuesta = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        if (!respuesta.ok) throw new Error("Error al obtener la tasa de interés.");

        const datos = await respuesta.json();
        const tasaCalculada = Math.abs(datos.rates.EUR * 10);

        document.getElementById("tasa").value = tasaCalculada.toFixed(2);
        localStorage.setItem("tasaInteres", tasaCalculada.toFixed(2));

        return tasaCalculada;

    } catch (error) {
        console.error(" Error al conectar con la API:", error);
        mostrarNotificacion('error', 'No se pudo obtener la tasa de interés.');

        return 5; // Valor predeterminado en caso de error
    }
}

// Función para actualizar la tasa de interés cuando se cambia la opción
async function actualizarTasaInteres() {
    let tasaInteres = await obtenerTasaInteres();
    const tipoTasa = document.getElementById("tipoTasa").value;

    if (tipoTasa === "variable") {
        tasaInteres += 2; // Si es variable, sumamos 2%
    }

    document.getElementById("tasa").value = tasaInteres.toFixed(2);
}

//  Detectar cambios en la selección de tasa y actualizarla automáticamente
document.getElementById("tipoTasa").addEventListener("change", actualizarTasaInteres);

// Función para calcular el préstamo
async function calcularPrestamo() {
    const monto = parseFloat(document.getElementById("monto").value);
    const cuotas = parseInt(document.getElementById("cuotas").value);
    const tipoTasa = document.getElementById("tipoTasa").value;

    if (isNaN(monto) || isNaN(cuotas) || monto <= 0 || cuotas <= 0) {
        mostrarNotificacion('error', 'Por favor ingresa valores válidos.');
        return;
    }

    let tasaInteres = await obtenerTasaInteres();
    if (tipoTasa === "variable") {
        tasaInteres += 2;
    }

    const totalPagar = monto + (monto * (tasaInteres / 100));

    guardarDatosEnStorage({ monto, cuotas, tasaInteres, totalPagar, tipoTasa });

    mostrarNotificacion('success', `Monto: $${monto}\nTotal a Pagar: $${totalPagar.toFixed(2)}\nTipo de Tasa: ${tipoTasa === "fija" ? "Tasa Fija" : "Tasa Variable"}`);

    mostrarGraficoCuotas(cuotas, totalPagar);
}

// Función para mostrar el gráfico de pagos mensuales
function mostrarGraficoCuotas(cuotas, totalPagar) {
    document.getElementById("chartContainer").style.display = "block";

    const ctx = document.getElementById("chart").getContext("2d");

    const pagoMensual = totalPagar / cuotas;
    let pagos = [];
    let labels = [];

    for (let i = 1; i <= cuotas; i++) {
        pagos.push(pagoMensual);
        labels.push(`Cuota ${i}`);
    }

    //  Destruir gráfico previo si existe
    if (window.miGrafico) {
        window.miGrafico.destroy();
    }

    // `Chart.js`
    window.miGrafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Pago por Cuota ($)",
                data: pagos,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            }
        }
    });
}

// Función para reiniciar el simulador
function reiniciarSimulador() {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esto eliminará todos los datos guardados del simulador.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            document.getElementById("loanForm").reset();
            document.getElementById("tasa").value = "";
            document.getElementById("chartContainer").style.display = "none";
            mostrarNotificacion('success', "Simulador reiniciado con éxito.");
        }
    });
}

// Cargar datos guardados y obtener la tasa automáticamente al iniciar
document.addEventListener("DOMContentLoaded", async () => {
    await actualizarTasaInteres();

    const datosGuardados = obtenerDatosDeStorage();
    if (datosGuardados) {
        document.getElementById("tipoTasa").value = datosGuardados.tipoTasa || "fija";
        document.getElementById("tasa").value = datosGuardados.tasaInteres.toFixed(2);
        mostrarNotificacion('info', `Último préstamo: Monto $${datosGuardados.monto}, Total $${datosGuardados.totalPagar.toFixed(2)}, Tasa: ${datosGuardados.tipoTasa}`);
    }
});

// Asignar eventos a los botones
document.getElementById("boton-simular").addEventListener("click", calcularPrestamo);
document.getElementById("reiniciar").addEventListener("click", reiniciarSimulador);

