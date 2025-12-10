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

// Cargamos...
document.addEventListener("DOMContentLoaded", () => {
    activarSwipeCalendario();
    cargar_funciones();
    cargarJSON();
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

// PDF

/* ------------------ UTILIDADES ------------------ */

function formatearFecha(fechaISO) {
    const [año, mes, dia] = fechaISO.split("-");
    return `${dia}-${mes}-${año}`;
}

function obtenerNombreMes(mes) {
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
    return nombres[parseInt(mes) - 1];
}

function obtenerNumeroMes(nombreMes) {
    const nombres = {
        Enero: 1,
        Febrero: 2,
        Marzo: 3,
        Abril: 4,
        Mayo: 5,
        Junio: 6,
        Julio: 7,
        Agosto: 8,
        Septiembre: 9,
        Octubre: 10,
        Noviembre: 11,
        Diciembre: 12,
    };
    return nombres[nombreMes];
}

function obtenerNombreDia(fecha) {
    const dias = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];
    return dias[new Date(fecha).getDay()];
}

function obtenerDiasDelMes(año, mesNumero) {
    const dias = [];
    const total = new Date(año, mesNumero, 0).getDate();
    for (let d = 1; d <= total; d++) {
        dias.push(
            `${año}-${String(mesNumero).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        );
    }
    return dias;
}

function agruparPorMes(json) {
    const meses = {};
    Object.keys(json).forEach((key) => {
        if (key === "info_meses") return;
        const [año, mes] = key.split("-");
        const nombreMes = obtenerNombreMes(mes);
        if (!meses[nombreMes]) meses[nombreMes] = {};
        meses[nombreMes][key] = json[key];
    });
    return meses;
}

/* ------------------ GENERADORES ------------------ */

function generarPortada() {
    const pagina = document.createElement("section");
    pagina.classList.add("pagina");

    pagina.innerHTML = `
                <div class="portada">
                    <div class="logo">
                        <img src="logo_50_aniversario.jpg" />
                    </div>
                    <h2 class="titulo_portada">
                        Programación de actividades para el año 2026 de la Hermandad Del Santo Entierro De Cristo, Usulután.
                    </h2>
                </div>
            `;

    return pagina;
}

function generarFilaDia(fecha, nombreDia, actividades) {
    if (actividades.length === 0) {
        actividades = [{ titulo: "-", hora: "", descripcion: "-" }];
    }

    let actividadesHTML = actividades
        .map(
            (act) => `
                <div class="desglose_actividades_fecha">
                    <h5>${act.titulo} ${act.hora ? `(${act.hora})` : ""}</h5>
                    <p class="detalle_actividad">${act.descripcion}</p>
                </div>
            `,
        )
        .join("");

    return `
                <div class="dias_mes_actividades">
                    <div class="fecha_nombre_dia">
                        <h5>${formatearFecha(fecha)} - ${nombreDia}</h5>
                    </div>
                    ${actividadesHTML}
                </div>
            `;
}

function crearPaginaMes(nombreMes, año, incluirTitulo = true) {
    const pagina = document.createElement("section");
    pagina.classList.add("pagina");

    let html = "";

    if (incluirTitulo) {
        html += `
                    <div class="nombre_mes">
                        <h1>${nombreMes} - ${año}</h1>
                        <p>Programación de actividades para el mes de ${nombreMes}</p>
                    </div>
                `;
    }

    html += `<div class="filas"></div>`;
    pagina.innerHTML = html;

    return pagina;
}

/* ------------------ ALGORITMO INTELIGENTE POR ALTURA ------------------ */

function generarPaginasPorAltura(nombreMes, año, datosMes) {
    const contenedor = document.getElementById("contenedor_pdf");
    const mesNumero = obtenerNumeroMes(nombreMes);
    const dias = obtenerDiasDelMes(año, mesNumero);

    // Primera página con título
    let pagina = crearPaginaMes(nombreMes, año, true);
    let filasContainer = pagina.querySelector(".filas");
    contenedor.appendChild(pagina);

    // Medir altura del título
    const titulo = pagina.querySelector(".nombre_mes");
    const alturaTitulo = titulo ? titulo.offsetHeight : 0;

    // Altura útil para filas
    const ALTURA_MAX_FILAS = 1056 - alturaTitulo - 120;

    dias.forEach((fecha) => {
        const actividades = datosMes[fecha] || [];
        const nombreDia = obtenerNombreDia(fecha);

        const filaHTML = generarFilaDia(fecha, nombreDia, actividades);
        const temp = document.createElement("div");
        temp.innerHTML = filaHTML;
        const filaNodo = temp.firstElementChild;

        filasContainer.appendChild(filaNodo);

        const alturaFilas = filasContainer.offsetHeight;

        if (alturaFilas > ALTURA_MAX_FILAS) {
            filasContainer.removeChild(filaNodo);

            const nuevaPagina = crearPaginaMes(nombreMes, año, false);
            nuevaPagina.style.pageBreakBefore = "always";

            contenedor.appendChild(nuevaPagina);

            filasContainer = nuevaPagina.querySelector(".filas");
            filasContainer.appendChild(filaNodo);

            pagina = nuevaPagina;
        }
    });
}

/* ------------------ CONTROLADOR PRINCIPAL ------------------ */

function generarPDFCompleto(json) {
    const contenedor = document.getElementById("contenedor_pdf");

    // ✅ Limpiar antes de generar
    contenedor.innerHTML = "";

    contenedor.appendChild(generarPortada());

    const meses = agruparPorMes(json);

    Object.keys(meses).forEach((nombreMes) => {
        generarPaginasPorAltura(nombreMes, 2026, meses[nombreMes]);
    });
}

async function cargarJSON() {
    const response = await fetch("actividades.json");
    const json = await response.json();
    generarPDFCompleto(json);
}

document.getElementById("btnDescargarPDF").addEventListener("click", () => {
    window.print();
});
