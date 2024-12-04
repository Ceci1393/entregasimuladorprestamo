// Simulador de Préstamos Bancarios
alert("¡Bienvenido al simulador de préstamos bancarios!");

// Función para solicitar datos al usuario
const solicitarDatos = () => {
    const monto = parseFloat(prompt("Ingrese el monto del préstamo ($):"));
    const tasaInteres = parseFloat(prompt("Ingrese la tasa de interés anual (%):"));
    const plazo = parseInt(prompt("Ingrese el plazo en meses:"));
    return { monto, tasaInteres, plazo };
};

// Función para validar entradas
function validarEntradas({ monto, tasaInteres, plazo }) {
    return !(isNaN(monto) || monto <= 0 || isNaN(tasaInteres) || tasaInteres <= 0 || isNaN(plazo) || plazo <= 0);
}

// Función para calcular los pagos
function calcularPagos(monto, tasaInteres, plazo) {
    const tasaMensual = tasaInteres / 100 / 12;
    const pagoMensual = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
    const totalPago = pagoMensual * plazo;
    const totalInteres = totalPago - monto;
    return { pagoMensual, totalPago, totalInteres, tasaMensual };
}

// Función para mostrar resultados
const mostrarResultados = ({ monto, tasaInteres, plazo }, { pagoMensual, totalPago, totalInteres }) => {
    alert(
        `Resultados del Préstamo:\n` +
        `Monto solicitado: $${monto.toFixed(2)}\n` +
        `Tasa de interés anual: ${tasaInteres.toFixed(2)}%\n` +
        `Plazo: ${plazo} meses\n` +
        `Pago mensual: $${pagoMensual.toFixed(2)}\n` +
        `Total a pagar: $${totalPago.toFixed(2)}\n` +
        `Intereses totales: $${totalInteres.toFixed(2)}`
    );
};

// Función para generar el desglose mensual
const generarDesgloseMensual = (monto, plazo, tasaMensual, pagoMensual) => {
    let saldoRestante = monto;
    console.log("Desglose Mensual:");
    console.log("Mes | Interés | Amortización | Saldo Restante");
    for (let mes = 1; mes <= plazo; mes++) {
        const interesMensual = saldoRestante * tasaMensual;
        const amortizacion = pagoMensual - interesMensual;
        saldoRestante -= amortizacion;
        console.log(
            `${mes} | $${interesMensual.toFixed(2)} | $${amortizacion.toFixed(2)} | $${saldoRestante.toFixed(2)}`
        );
    }
};

// Ciclo principal
let continuar;
do {
    const datos = solicitarDatos();

    if (!validarEntradas(datos)) {
        alert("Por favor, ingrese valores válidos para monto, interés y plazo.");
        continue;
    }

    const calculos = calcularPagos(datos.monto, datos.tasaInteres, datos.plazo);
    mostrarResultados(datos, calculos);
    generarDesgloseMensual(datos.monto, datos.plazo, calculos.tasaMensual, calculos.pagoMensual);

    continuar = confirm("¿Desea realizar otra simulación?");
} while (continuar);

alert("Gracias por usar el simulador de préstamos. ¡Hasta pronto!");
