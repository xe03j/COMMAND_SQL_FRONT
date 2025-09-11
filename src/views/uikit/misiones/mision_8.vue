<script setup>
import { ref, onMounted } from 'vue';
import '@fontsource/press-start-2p';

const comando = ref('');
const output = ref([]);
const feedback = ref([]);
const intentos = ref(0);

const misionActual = ref('');
const consultaCorrecta = ref('');
const completada = ref(false);
const mostrarPopup = ref(false); // popup felicitación
const usuarioId = ref(null); // se obtiene con /me

const normalizar = (str) => str.trim().replace(/\s+/g, ' ').toLowerCase();

const pistas = ['💡 Pista: Revisa las mayúsculas.', '💡 Pista: Cuidado con los espacios extras.', '💡 Pista: Verifica las palabras clave en tu manual.', '💡 Pista: Checa los símbolos como `;` al final.'];

const ejecutarComando = async () => {
    if (completada.value) {
        feedback.value.push({ tipo: 'warning', msg: '⚠️ Ya completaste esta misión, pasa a la siguiente.' });
        comando.value = '';
        return;
    }

    intentos.value++;
    output.value.push(`> ${comando.value}`);

    if (normalizar(comando.value) === normalizar(consultaCorrecta.value)) {
        // Consola estilo SQL engine
        output.value.push('Consulta aceptada...');
        output.value.push('Creando base de datos...');
        output.value.push('Operación completada ✔');
        output.value.push("Database 'nave_estrella' created successfully.");

        feedback.value.push({ tipo: 'success', msg: '🎉 Éxito: Comando ejecutado correctamente 🚀' });
        completada.value = true;
        mostrarPopup.value = true; // activa modal

        try {
            const token = localStorage.getItem('access_token');

            // 1️⃣ Guardar progreso (suma XP en el backend si es la primera vez)
            await fetch('http://localhost:8000/progreso/saveprogres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_usuario: usuarioId.value,
                    id_mision: 8, // 👈 misión actual
                    estado: 'completada',
                    intentos: intentos.value
                })
            });
        } catch (err) {
            console.error('❌ Error al guardar progreso/logro/xp:', err);
        }
    } else {
        // Mostrar pistas cada intento en orden
        const pistaIndex = (intentos.value - 1) % pistas.length;
        feedback.value.push({ tipo: 'error', msg: '❌ Comando incorrecto, intenta de nuevo.' });
        feedback.value.push({ tipo: 'warning', msg: pistas[pistaIndex] });
    }

    comando.value = '';
};

// Cargar misión actual y usuario al montar
onMounted(async () => {
    try {
        const token = localStorage.getItem('access_token');

        // 🔑 Obtener usuario
        const resUser = await fetch('http://localhost:8000/usuarios/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!resUser.ok) throw new Error('Error al obtener usuario');
        const userData = await resUser.json();
        usuarioId.value = userData.id_usuario;

        // 📘 Obtener misión
        const resMision = await fetch('http://localhost:8000/misiones/8', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!resMision.ok) throw new Error('Error al obtener misión');
        const data = await resMision.json();

        misionActual.value = data.enunciado;
        consultaCorrecta.value = data.consulta_correcta;
    } catch (err) {
        console.error(err);
        feedback.value.push({ tipo: 'error', msg: '❌ No se pudo cargar misión o usuario.' });
    }
});
</script>

<template>
    <div :class="$style.mainscreen">
        <!-- Fondo -->
        <div :class="$style.background">
            <img src="@/assets/image6.png" alt="Fondo" />
            <div :class="$style.overlay"></div>
        </div>

        <!-- Planeta lateral -->
        <img :class="$style.pngwing2Icon" alt="Planeta" src="@/assets/pngwing2.png" />

        <!-- Contenedor principal -->
        <div :class="$style.cardParent">
            <div :class="$style.card">
                <div :class="$style.commandSql">MISION 8</div>
            </div>

            <!-- Misiones -->
            <div :class="$style.overlayborder3">
                <div :class="$style.mainscreenHeading3margin">
                    <div :class="$style.heading3">
                        <div :class="$style.margin">
                            <div :class="$style.terminal">assignment</div>
                        </div>
                        <div :class="$style.consolaDeComandos">Misiones y Objetivos</div>
                    </div>
                </div>
                <div :class="$style.container7">
                    <div :class="$style.overlayborder4">
                        <div :class="$style.container">
                            <b :class="$style.misinActualNavegacin">{{ misionActual }}</b>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Terminal de entrada -->
            <div :class="$style.overlayborder">
                <div :class="$style.heading3margin">
                    <div :class="$style.heading3">
                        <div :class="$style.margin">
                            <div :class="$style.terminal">terminal</div>
                        </div>
                        <div :class="$style.consolaDeComandos">Consola de Comandos</div>
                    </div>
                </div>
                <div :class="$style.mainscreenMargin">
                    <div :class="$style.mainscreenContainer">
                        <div :class="$style.input">
                            <input v-model="comando" type="text" placeholder="Escribe tu comando SQL aquí..." :class="$style.escribeTuComando" @keyup.enter="ejecutarComando" />
                        </div>
                        <div :class="$style.button" @click="ejecutarComando">
                            <b :class="$style.terminal">Ejecutar</b>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Output del sistema -->
            <div :class="$style.mainscreenOverlayborder">
                <div :class="$style.mainscreenHeading3margin">
                    <div :class="$style.heading3">
                        <div :class="$style.margin">
                            <div :class="$style.terminal">dns</div>
                        </div>
                        <div :class="$style.consolaDeComandos">Output del Sistema</div>
                    </div>
                </div>
                <div :class="$style.background2">
                    <div :class="$style.scrollContainer">
                        <div class="selectFrom">Ejecutando consulta...</div>
                        <div v-for="line in output" :key="line" class="mainscreenP">{{ line }}</div>
                    </div>
                </div>
            </div>

            <!-- Feedback -->
            <div :class="$style.overlayborder2">
                <div :class="$style.mainscreenHeading3margin">
                    <div :class="$style.heading3">
                        <div :class="$style.margin">
                            <div :class="$style.terminal">feedback</div>
                        </div>
                        <div :class="$style.consolaDeComandos">Feedback y Alertas</div>
                    </div>
                </div>
                <div :class="$style.scrollContainer">
                    <div v-for="(alerta, i) in feedback" :key="i" :class="[alerta.tipo === 'success' ? $style.overlayverticalborder : alerta.tipo === 'warning' ? $style.mainscreenOverlayverticalborder : $style.overlayverticalborder2]">
                        <div :class="$style.container">
                            <div :class="$style.xitoComandoEjecutadoContainer">{{ alerta.msg }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- POPUP FELICITACIÓN -->
    <div v-if="mostrarPopup" :class="$style.popupOverlay">
        <div :class="$style.popup">
            <h2>🎉 ¡Misión completada!</h2>
            <p>Has creado la base de datos correctamente.</p>
            <button :class="$style.closeButton" @click="mostrarPopup = false">Cerrar</button>
        </div>
    </div>
</template>

<style module>
/* --------------------------
   Layout general / fix grid
   -------------------------- */
.mainscreen {
    position: relative;
    width: 100%;
    height: 100vh;
    font-family: 'Press Start 2P', cursive;
    color: #15ff73;
    overflow: hidden;
}

.background {
    position: fixed;
    inset: 0;
    z-index: -3;
}

.background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    z-index: -2;
}

/* Planeta: lo redimensioné para que no rompa layout visualmente */
.pngwing2Icon {
    position: fixed;
    right: -300px; /* meterlo por la derecha fuera del flujo visual */
    top: 50%;
    transform: translateY(-50%);
    width: 1400px; /* razonable, ya no 10000px */
    opacity: 0.95;
    z-index: -1;
    pointer-events: none;
}

/* Grid padre: no forzar altura completa, filas a medida del contenido */
.cardParent {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content; /* filas ajustadas al contenido */
    grid-auto-flow: dense;
    gap: 20px;
    padding: 24px;
    align-items: start; /* que los items no se estiren verticalmente */
    align-content: start; /* evita repartir espacio sobrante entre filas */
    min-height: calc(100vh - 24px); /* ocupa viewport pero sin forzar estirado */
}

/* Cabecera (tarjeta "MISION 1") — altura mínima, centrado y flexible */
.card {
    grid-column: 1 / -1; /* ocupa las dos columnas */
    background: rgba(0, 0, 0, 0.4);
    border: 2px solid #15ff73;
    border-radius: 12px;
    padding: 8px 12px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 64px; /* la tarjeta no quedará gigante */
    height: auto;
}

/* Títulos y estilo */
.heading3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.commandSql {
    font-size: 2.2rem; /* reducido un poco para evitar obligar mucha altura */
    color: #15ff73;
    text-shadow: 0 0 12px #15ff73, 0 0 24px #15ff73;
    letter-spacing: 4px;
    text-align: center;
    margin: 0;
}

.consolaDeComandos {
    font-weight: bold;
    font-size: 1rem;
    color: white;
    text-shadow: 0 0 6px white;
}

/* Tarjetas (contenedores) — ahora permiten contenido a demanda */
.overlayborder,
.mainscreenOverlayborder,
.overlayborder2,
.overlayborder3,
.overlayborder4 {
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid #15ff73;
    border-radius: 10px;
    padding: 12px;
    /* IMPORTANT: no overflow:hidden aquí (que cortaba scroll en algunos navegadores) */
    box-shadow: 0 0 15px rgba(21, 255, 115, 0.4);
    min-height: 80px; /* tamaño base, pero crecerá según el contenido hasta el max-height de sus hijos */
}

/* Scroll interno (Output / Feedback) */
.scrollContainer {
    max-height: 260px; /* Ajusta según prefieras */
    overflow-y: auto;
    word-break: break-word;
    padding-right: 8px;
}

/* Estilo del scrollbar (neón) */
.scrollContainer::-webkit-scrollbar {
    width: 12px;
}

.scrollContainer::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.25);
    border-radius: 8px;
}

.scrollContainer::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(21, 255, 115, 0.9), rgba(21, 255, 115, 0.6));
    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.4);
}

/* Feedback OK */
.overlayverticalborder {
    border-left: 4px solid #15ff73;
    padding-left: 10px;
    margin: 6px 0;
    color: #15ff73;
}

/* Feedback WARNING */
.mainscreenOverlayverticalborder {
    border-left: 4px solid #ffe600;
    padding-left: 10px;
    margin: 6px 0;
    color: #ffe600;
    text-shadow: 0 0 6px #ffe600;
}

/* Feedback ERROR */
.overlayverticalborder2 {
    border-left: 4px solid #ff3030;
    padding-left: 10px;
    margin: 6px 0;
    color: #ff3030;
    text-shadow: 0 0 8px #ff3030;
}

/* Input */
.input {
    display: flex;
    align-items: center;
}

.escribeTuComando {
    background: black;
    border: 2px solid white;
    color: #15ff73;
    padding: 12px 14px;
    font-family: 'Press Start 2P', monospace;
    font-size: 1rem;
    width: 500px;
    border-radius: 6px;
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
    outline: none;
}

/* Botón */
.button {
    background: #444;
    color: white;
    padding: 10px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.9rem;
    transition: 0.25s;
    border: none;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.button:hover {
    background: #15ff73;
    color: black;
    box-shadow: 0 0 18px rgba(21, 255, 115, 0.9);
}

.misinActualNavegacin {
    font-size: 1.1rem;
    color: white;
    text-shadow: 0 0 6px white;
}

.terminal {
    font-size: 0.9rem;
    text-transform: uppercase;
    color: #15ff73;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.selectFrom {
    font-family: monospace;
    font-size: 0.95rem;
}

.mainscreenMargin {
    margin-top: 10px;
}

.mainscreenContainer {
    display: flex;
    gap: 10px;
    align-items: center;
}

.mainscreenP {
    font-family: monospace;
    font-size: 0.9rem;
    color: #ccc;
}

/* utilidad: evitar que tarjetas hijas crezcan más de lo que deben en flex/grid */
.overlayborder,
.overlayborder2,
.mainscreenOverlayborder,
.overlayborder3,
.overlayborder4 {
    min-width: 0;
    min-height: 0;
}

/* Popup felicitación */
.popupOverlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.popup {
    background: black;
    border: 3px solid #15ff73;
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    color: #15ff73;
    text-shadow: 0 0 10px #15ff73;
    box-shadow: 0 0 20px rgba(21, 255, 115, 0.7);
    animation: popupIn 0.5s ease-out;
}

.popup h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
}

.closeButton {
    margin-top: 20px;
    background: #15ff73;
    border: none;
    padding: 10px 20px;
    font-family: 'Press Start 2P';
    font-size: 0.9rem;
    border-radius: 6px;
    cursor: pointer;
    color: black;
    box-shadow: 0 0 10px #15ff73;
}

.closeButton:hover {
    background: white;
    color: black;
    box-shadow: 0 0 15px white;
}

@keyframes popupIn {
    from {
        transform: scale(0.6);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
