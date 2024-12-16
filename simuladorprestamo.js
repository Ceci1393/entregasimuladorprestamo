alert("¡Bienvenido al simulador de préstamos bancarios!");

// Base de datos simulada para préstamos previos
const prestamosPrevios = [
    { id: 1, monto: 50000, tasaInteres: 45, plazo: 12, tipoTasa: "fija" },
    { id: 2, monto: 100000, tasaInteres: 47, plazo: 24, tipoTasa: "variable" },
    { id: 3, monto: 75000, tasaInteres: 45, plazo: 18, tipoTasa: "fija" }
];

// Historial de simulaciones realizadas
const historialSimulaciones = [];

// Ofertas de préstamos disponibles
const ofertasPrestamos = [
    { id: 1, nombre: "Préstamo Personal", montoMax: 50000, tasaInteres: 45, plazoMax: 12, tipoTasa: "fija" },
    { id: 2, nombre: "Préstamo Hipotecario", montoMax: 200000, tasaInteres: 47, plazoMax: 120, tipoTasa: "variable" },
    { id: 3, nombre: "Préstamo Automotriz", montoMax: 100000, tasaInteres: 45, plazoMax: 60, tipoTasa: "fija" }
];

// Función para solicitar datos al usuario
const solicitarDatos = () => {
    const monto = parseFloat(prompt("Elija el monto del préstamo:\n1. $50,000\n2. $75,000\n3. $100,000\n4. $150,000"));
    const tipoTasa = prompt("Seleccione el tipo de tasa (fija/variable):").toLowerCase();
    const tasaInteres = tipoTasa === "fija" ? 45 : tipoTasa === "variable" ? 47 : null;
    const plazo = parseInt(prompt("Ingrese el plazo en meses (ejemplo: 12, 24, 36):"));

    return { monto, tipoTasa, tasaInteres, plazo };
};

// Función para validar entradas
function validarEntradas({ monto, tipoTasa, tasaInteres, plazo }) {
    const tiposValidos = ["fija", "variable"];
    return !(isNaN(monto) || monto <= 0 || !tiposValidos.includes(tipoTasa) || tasaInteres === null || isNaN(plazo) || plazo <= 0);
}

// Función para calcular los pagos
function calcularPagos(monto, tasaInteres, plazo, tipoTasa) {
    const tasaMensual = tasaInteres / 100 / 12;
    const pagoMensual = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
    const totalPago = pagoMensual * plazo;
    const totalInteres = totalPago - monto;
    return { pagoMensual, totalPago, totalInteres, tasaMensual, tipoTasa };
}

// Función para mostrar resultados
const mostrarResultados = ({ monto, tipoTasa, tasaInteres, plazo }, { pagoMensual, totalPago, totalInteres }) => {
    alert(
        `Resultados del Préstamo:\n` +
        `Monto solicitado: $${monto.toFixed(2)}\n` +
        `Tipo de tasa: ${tipoTasa}\n` +
        `Tasa de interés: ${tasaInteres.toFixed(2)}%\n` +
        `Plazo: ${plazo} meses\n` +
        `Pago mensual: $${pagoMensual.toFixed(2)}\n` +
        `Total a pagar: $${totalPago.toFixed(2)}\n` +
        `Intereses totales: $${totalInteres.toFixed(2)}`
    );
};

// Función para generar el desglose mensual
const generarDesgloseMensual = (monto, plazo, tasaMensual, pagoMensual, tipoTasa) => {
    let saldoRestante = monto;
    console.log("Desglose Mensual:");
    console.log("Mes | Interés | Amortización | Saldo Restante | Tipo de Tasa");
    for (let mes = 1; mes <= plazo; mes++) {
        const interesMensual = saldoRestante * tasaMensual;
        const amortizacion = pagoMensual - interesMensual;
        saldoRestante -= amortizacion;
        console.log(
            `${mes} | $${interesMensual.toFixed(2)} | $${amortizacion.toFixed(2)} | $${saldoRestante.toFixed(2)} | ${tipoTasa}`
        );
    }
};

// Función para guardar simulación en el historial
const guardarSimulacion = (datos, resultados) => {
    historialSimulaciones.push({ ...datos, ...resultados });
};

// Mostrar tasas de interés y ofertas basadas en el monto solicitado y tipo de tasa
const mostrarTasasYOfertas = (monto, tipoTasa) => {
    // Filtrar ofertas disponibles basadas en el monto y tipo de tasa
    const ofertasDisponibles = ofertasPrestamos.filter(oferta => monto <= oferta.montoMax && oferta.tipoTasa === tipoTasa);
    
    if (ofertasDisponibles.length > 0) {
        console.log("Ofertas disponibles para su monto y tipo de tasa:");
        ofertasDisponibles.forEach(oferta => {
            console.log(`- ${oferta.nombre}: Monto máximo $${oferta.montoMax}, Tasa ${oferta.tasaInteres}%, Plazo máximo ${oferta.plazoMax} meses, Tasa ${oferta.tipoTasa}.`);
        });
    } else {
        console.log("No hay ofertas disponibles para el monto y tipo de tasa seleccionados.");
    }
};

// Ciclo principal
let continuar;
do {
    const datos = solicitarDatos();

    if (!validarEntradas(datos)) {
        alert("Por favor, ingrese valores válidos para monto, tipo de tasa y plazo.");
        continue;
    }

    // Mostrar las ofertas y tasas antes de proceder con la simulación
    mostrarTasasYOfertas(datos.monto, datos.tipoTasa);

    const calculos = calcularPagos(datos.monto, datos.tasaInteres, datos.plazo, datos.tipoTasa);
    mostrarResultados(datos, calculos);
    generarDesgloseMensual(datos.monto, datos.plazo, calculos.tasaMensual, calculos.pagoMensual, datos.tipoTasa);

    // Guardar la simulación en el historial
    guardarSimulacion(datos, calculos);

    continuar = confirm("¿Desea realizar otra simulación?");
} while (continuar);

alert("Gracias por usar el simulador de préstamos. ¡Hasta pronto!");
