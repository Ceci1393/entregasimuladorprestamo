   // Simulador de Préstamos Bancarios
alert("¡Bienvenido al simulador de préstamos bancarios!");

do {
    // Solicitar datos al usuario
    let monto = parseFloat(prompt("Ingrese el monto del préstamo ($):"));
    let tasaInteres = parseFloat(prompt("Ingrese la tasa de interés anual (%):"));
    let plazo = parseInt(prompt("Ingrese el plazo en meses:"));

    // Validar entradas
    if (isNaN(monto) || monto <= 0 || isNaN(tasaInteres) || tasaInteres <= 0 || isNaN(plazo) || plazo <= 0) {
        alert("Por favor, ingrese valores válidos para monto, interés y plazo.");
        continue;
    }

    // Calcular el pago mensual y el costo total
    let tasaMensual = tasaInteres / 100 / 12;
    let pagoMensual = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
    let totalPago = pagoMensual * plazo;
    let totalInteres = totalPago - monto;

    // Mostrar resultados
    alert(
        `Resultados del Préstamo:\n` +
        `Monto solicitado: $${monto.toFixed(2)}\n` +
        `Tasa de interés anual: ${tasaInteres.toFixed(2)}%\n` +
        `Plazo: ${plazo} meses\n` +
        `Pago mensual: $${pagoMensual.toFixed(2)}\n` +
        `Total a pagar: $${totalPago.toFixed(2)}\n` +
        `Intereses totales: $${totalInteres.toFixed(2)}`
    );

    // Generar desglose mensual
    let saldoRestante = monto;
    console.log("Desglose Mensual:");
    console.log("Mes | Interés | Amortización | Saldo Restante");
    for (let mes = 1; mes <= plazo; mes++) {
        let interesMensual = saldoRestante * tasaMensual;
        let amortizacion = pagoMensual - interesMensual;
        saldoRestante -= amortizacion;
        console.log(
            `${mes} | $${interesMensual.toFixed(2)} | $${amortizacion.toFixed(2)} | $${saldoRestante.toFixed(2)}`
        );
    }

    // Preguntar si desea realizar otra simulación
} while (confirm("¿Desea realizar otra simulación?"));

alert("Gracias por usar el simulador de préstamos. ¡Hasta pronto!");
