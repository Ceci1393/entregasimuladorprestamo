document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loanForm");
    const resultContainer = document.getElementById("results");
    const chartContainer = document.getElementById("chartContainer");
    const chartCanvas = document.getElementById("chart");

    let chartInstance = null;

    class Prestamo {
        constructor(monto, cuotas, tipo, tasa) {
            this.monto = monto;
            this.cuotas = cuotas;
            this.tipo = tipo;
            this.tasa = tasa;
            this.pagos = [];
        }

        calcularCuotas() {
            if (this.tipo === "fijo") {
                const tasaMensual = this.tasa / 100 / 12;
                const cuota = (this.monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -this.cuotas));
                this.pagos = Array(this.cuotas).fill(cuota.toFixed(2));
            } else {
                let saldo = this.monto;
                let cuotaBase = saldo / this.cuotas;
                this.pagos = Array.from({ length: this.cuotas }, (_, i) => {
                    let interes = saldo * (this.tasa / 100 / 12);
                    let cuota = cuotaBase + interes;
                    saldo -= cuotaBase;
                    return cuota.toFixed(2);
                });
            }
        }
    }

    async function cargarTasas() {
        try {
            const response = await fetch("tasas.json");
            if (!response.ok) throw new Error("Error al cargar tasas");
            return await response.json();
        } catch (error) {
            console.error(error);
            return { fijo: 10, variable: 15 }; // Valores por defecto
        }
    }

    async function simularPrestamo(event) {
        event.preventDefault();
        
        const monto = parseFloat(document.getElementById("monto").value);
        const cuotas = parseInt(document.getElementById("cuotas").value);
        const tipo = document.getElementById("tipo").value;

        if (isNaN(monto) || isNaN(cuotas) || cuotas <= 0 || monto <= 0) {
            alert("Ingrese valores válidos.");
            return;
        }

        const tasas = await cargarTasas();
        const tasa = tipo === "fijo" ? tasas.fijo : tasas.variable;
        
        const prestamo = new Prestamo(monto, cuotas, tipo, tasa);
        prestamo.calcularCuotas();

        mostrarResultados(prestamo);
        generarGrafico(prestamo);
    }

    function mostrarResultados(prestamo) {
        resultContainer.innerHTML = `
            <h3 class="text-primary">Resultados del Préstamo</h3>
            <p><strong>Monto:</strong> $${prestamo.monto}</p>
            <p><strong>Cuotas:</strong> ${prestamo.cuotas}</p>
            <p><strong>Tasa de interés:</strong> ${prestamo.tasa}%</p>
            <h4 class="mt-3">Detalle de Cuotas:</h4>
            <ul class="list-group">
                ${prestamo.pagos.map((pago, index) => `<li class="list-group-item">Mes ${index + 1}: $${pago}</li>`).join("")}
            </ul>
        `;

        resultContainer.style.display = "block";
    }

    function generarGrafico(prestamo) {
        if (chartInstance) chartInstance.destroy();

        const ctx = chartCanvas.getContext("2d");
        chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: prestamo.pagos.map((_, index) => `Mes ${index + 1}`),
                datasets: [{
                    label: "Cuota Mensual",
                    data: prestamo.pagos.map(p => parseFloat(p)),
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        chartContainer.style.display = "block";
    }

    form.addEventListener("submit", simularPrestamo);
});
