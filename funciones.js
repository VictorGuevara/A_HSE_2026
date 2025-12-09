let mesActual = 1;
let añoActual = 2026;

function obtenerMesAnterior(mes, año) {
    if (mes === 1) {
        return { mes: 12, año: año - 1 };
    }
    return { mes: mes - 1, año };
}

function obtenerMesSiguiente(mes, año) {
    if (mes === 12) {
        return { mes: 1, año: año + 1 };
    }
    return { mes: mes + 1, año };
}

async function cargarCalendario() {
    const response = await fetch("actividades.json");
    const tareas = await response.json();

    const calendar = document.getElementById("calendar_grid");
    calendar.innerHTML = "";

    // Insertar texto del mes
    const nombreMesActual = nombreMes(mesActual).toLowerCase();
    const textoMes = tareas.info_meses[nombreMesActual] || "";
    document.getElementById("texto_mes").textContent = textoMes;

    // Datos del mes actual
    const fechaInicio = new Date(añoActual, mesActual - 1, 1);
    const diaSemanaInicio = fechaInicio.getDay(); // 0 = domingo
    const diasEnMes = new Date(añoActual, mesActual, 0).getDate();

    // Obtener mes anterior y siguiente correctamente
    const { mes: mesPrev, año: añoPrev } = obtenerMesAnterior(
        mesActual,
        añoActual,
    );
    const { mes: mesNext, año: añoNext } = obtenerMesSiguiente(
        mesActual,
        añoActual,
    );

    // Días del mes anterior
    const diasMesAnterior = new Date(añoPrev, mesPrev, 0).getDate();

    // 1. Pintar días del mes anterior
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
        const dia = diasMesAnterior - i;

        const dayTag = document.createElement("div");
        dayTag.classList.add("day_tag", "prev_month");

        const fechaPrev = `${añoPrev}-${String(mesPrev).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        dayTag.dataset.date = fechaPrev;

        dayTag.innerHTML = `
            <h1 class="date_label">${String(dia).padStart(2, "0")}</h1>
        `;

        if (tareas[fechaPrev]) {
            tareas[fechaPrev].forEach((t) => {
                const actividad = document.createElement("div");
                actividad.classList.add("actividad");

                actividad.innerHTML = `
                    <h4>${t.titulo}</h4>
                    <h4 class="hora">${t.hora}</h4>
                    <p>${t.descripcion}</p>
                `;

                dayTag.appendChild(actividad);
            });
        }

        calendar.appendChild(dayTag);
    }

    // 2. Pintar días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = `${añoActual}-${String(mesActual).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        const dayTag = document.createElement("div");
        dayTag.classList.add("day_tag");
        dayTag.dataset.date = fecha;

        dayTag.innerHTML = `
            <h1 class="date_label">${String(dia).padStart(2, "0")}</h1>
        `;

        if (tareas[fecha]) {
            tareas[fecha].forEach((t) => {
                const actividad = document.createElement("div");
                actividad.classList.add("actividad");

                actividad.innerHTML = `
                    <h4>${t.titulo}</h4>
                    <h4 class="hora">${t.hora}</h4>
                    <p>${t.descripcion}</p>
                `;

                dayTag.appendChild(actividad);
            });
        }

        calendar.appendChild(dayTag);
    }

    // 3. Pintar días del mes siguiente
    const totalCeldas = calendar.children.length;
    const faltantes = 35 - totalCeldas;

    for (let dia = 1; dia <= faltantes; dia++) {
        const dayTag = document.createElement("div");
        dayTag.classList.add("day_tag", "next_month");

        const fechaNext = `${añoNext}-${String(mesNext).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        dayTag.dataset.date = fechaNext;

        dayTag.innerHTML = `
            <h1 class="date_label">${String(dia).padStart(2, "0")}</h1>
        `;

        if (tareas[fechaNext]) {
            tareas[fechaNext].forEach((t) => {
                const actividad = document.createElement("div");
                actividad.classList.add("actividad");

                actividad.innerHTML = `
                    <h4>${t.titulo}</h4>
                    <h4 class="hora">${t.hora}</h4>
                    <p>${t.descripcion}</p>
                `;

                dayTag.appendChild(actividad);
            });
        }

        calendar.appendChild(dayTag);
    }

    // Actualizar título del mes
    document.querySelector(".mes_info h1").textContent =
        `${nombreMes(mesActual)} - ${añoActual}`;
}

function marcarDiaActual() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    const fechaHoy = `${año}-${mes}-${dia}`;

    const dias = document.querySelectorAll(".day_tag");

    dias.forEach((diaTag) => {
        if (diaTag.dataset.date === fechaHoy) {
            diaTag.classList.add("hoy");
        }
    });
}

function nombreMes(m) {
    const nombres = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
    return nombres[m - 1];
}

function esModoMovil() {
    return window.innerWidth <= 768;
}

function agregarContadores() {
    // Solo agregar contadores en modo móvil
    if (!esModoMovil()) return;

    const dias = document.querySelectorAll(".day_tag");

    dias.forEach((dia) => {
        const actividades = dia.querySelectorAll(".actividad");
        const cantidad = actividades.length;

        if (cantidad === 0) return;

        // Evitar duplicados
        if (dia.querySelector(".activity_count")) return;

        const badge = document.createElement("span");
        badge.classList.add("activity_count");
        badge.textContent = cantidad;

        dia.appendChild(badge);
    });
}

function configurarModal() {
    const dias = document.querySelectorAll(".day_tag");
    const modal = document.getElementById("modal");
    const modalDate = document.getElementById("modalDate");
    const modalActivities = document.getElementById("modalActivities");
    const closeModal = document.getElementById("closeModal");

    const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    dias.forEach((dia) => {
        dia.addEventListener("click", () => {
            if (!esModoMovil()) return; // solo abrir en móvil

            const fechaStr = dia.dataset.date;
            if (!fechaStr) return;

            const [anio, mes, diaReal] = fechaStr.split("-").map(Number);
            const fecha = new Date(anio, mes - 1, diaReal);

            const diaNum = String(fecha.getDate()).padStart(2, "0");
            const mesNombre = meses[fecha.getMonth()];
            const anioFinal = fecha.getFullYear();

            modalDate.textContent = `${diaNum} de ${mesNombre} - ${anioFinal}`;

            const actividades = dia.querySelectorAll(".actividad");

            if (actividades.length === 0) {
                modalActivities.innerHTML = `<p>No hay actividades para este día.</p>`;
            } else {
                modalActivities.innerHTML = "";
                actividades.forEach((act) => {
                    const titulo = act.querySelector("h4")?.textContent || "";
                    const hora = act.querySelector(".hora")?.textContent || "";
                    const desc = act.querySelector("p")?.textContent || "";

                    const item = document.createElement("div");
                    item.classList.add("activity-item");
                    item.innerHTML = `
          <h3>${titulo}</h3>
          <p><strong>Hora:</strong> ${hora}</p>
          <p>${desc}</p>
          <hr>
        `;
                    modalActivities.appendChild(item);
                });
            }

            modal.style.display = "flex";
        });
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
}

function activarSwipeCalendario() {
    const calendar = document.getElementById("calendar_grid");

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isSwiping = false;

    calendar.addEventListener("touchstart", (e) => {
        const t = e.changedTouches[0];
        startX = t.clientX;
        startY = t.clientY;
        isSwiping = false;
    });

    calendar.addEventListener(
        "touchmove",
        (e) => {
            const t = e.changedTouches[0];
            const distX = t.clientX - startX;
            const distY = t.clientY - startY;

            // ✅ Si el movimiento es más horizontal que vertical → activar swipe
            if (Math.abs(distX) > Math.abs(distY)) {
                isSwiping = true;
                e.preventDefault(); // ✅ BLOQUEA el scroll vertical
            }
        },
        { passive: false },
    );

    calendar.addEventListener("touchend", (e) => {
        if (!isSwiping) return; // ✅ Si no fue swipe horizontal, no hacer nada

        const t = e.changedTouches[0];
        endX = t.clientX;

        const distX = endX - startX;

        // ✅ Ignorar movimientos pequeños
        if (Math.abs(distX) < 60) return;

        if (distX < 0) {
            // 👉 Swipe izquierda → mes siguiente
            if (mesActual < 12) mesActual++;
            else {
                mesActual = 1;
                añoActual++;
            }
        } else {
            // 👈 Swipe derecha → mes anterior
            if (mesActual > 1) mesActual--;
            else {
                mesActual = 12;
                añoActual--;
            }
        }

        cargar_funciones();
    });
}

// Función que carga las funciones...
const cargar_funciones = async () => {
    await cargarCalendario();
    await agregarContadores();
    await configurarModal();
    await marcarDiaActual();
};

// Función que descarga el pdf.
let permitirDescarga = false;

window.addEventListener("message", (event) => {
    if (permitirDescarga && event.data?.tipo === "PDF_LISTO") {
        console.log("✅ PDF listo, generando…");

        const iframe = document.getElementById("visorPDF");
        const doc = iframe.contentDocument;
        const contenido = doc.getElementById("contenedor_pdf");

        const opciones = {
            margin: 0,
            filename: "programacion_2026.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "pt", format: "letter", orientation: "portrait" },
        };

        html2pdf().set(opciones).from(contenido).save();

        permitirDescarga = false; // ✅ evitar descargas automáticas
    }
});

function descargarPDF() {
    permitirDescarga = true; // ✅ permitir descarga
    const iframe = document.getElementById("visorPDF");
    iframe.src = iframe.src; // ✅ recargar iframe
}

// Cargamos...
document.addEventListener("DOMContentLoaded", () => {
    activarSwipeCalendario();
    cargar_funciones();
});
document.getElementById("prevWeek").addEventListener("click", () => {
    if (mesActual > 1) {
        mesActual--;
        cargar_funciones();
    }
});

document.getElementById("nextWeek").addEventListener("click", () => {
    if (mesActual < 12) {
        mesActual++;
        cargar_funciones();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        if (mesActual > 1) {
            mesActual--;
        } else {
            mesActual = 12;
            añoActual--;
        }
        cargar_funciones();
    }

    if (e.key === "ArrowRight") {
        if (mesActual < 12) {
            mesActual++;
        } else {
            mesActual = 1;
            añoActual++;
        }
        cargar_funciones();
    }
});

document
    .getElementById("btnDescargarPDF")
    .addEventListener("click", async () => {
        // await descargarPDF();
        const link = document.createElement("a");
        link.href = "Programacion_HSE_2026"; // ruta del PDF subido
        link.download = "Programacion_HSE_2026"; // nombre del archivo al descargar
        link.click();
    });
