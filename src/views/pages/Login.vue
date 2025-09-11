<script setup>
import { useAuth } from '@/composables/useAuth';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import '@fontsource/press-start-2p'; // Importa toda la fuente
// Importa imágenes desde assets
import bg from '@/assets/background.png';
import overlay from '@/assets/pngwing2.png';

// Variables reactivas
const { setToken } = useAuth();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
    errorMessage.value = '';

    if (!email.value.trim() || !password.value.trim()) {
        errorMessage.value = 'Cadete, completa todos los campos.';
        return;
    }

    try {
        const formData = new URLSearchParams();
        formData.append('username', email.value.trim());
        formData.append('password', password.value.trim());

        const loginResponse = await axios.post('https://command-sql-back.onrender.com/auth/login', formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        console.log('loginResponse.data:', loginResponse.data);

        const { access_token } = loginResponse.data;
        console.log('access_token:', access_token);

        setToken(access_token);

        router.push('/empezar');
    } catch (error) {
        if (error.response) {
            errorMessage.value = error.response.data.detail || 'Houston, tenemos un error de autenticación.';
        } else {
            errorMessage.value = 'Ups, Houston hubo error en la conexión. Intenta más tarde.';
        }
    }
};
</script>

<template>
    <div class="relative w-full min-h-screen bg-black font-press flex items-center justify-center overflow-hidden">
        <!-- Fondo -->
        <img :src="bg" alt="background" class="absolute inset-0 w-full h-full object-cover" />
        <img :src="overlay" alt="overlay" class="absolute inset-0 w-full h-full object-contain opacity-80" />

        <!-- Contenedor principal -->
        <div class="relative z-10 flex flex-col items-center w-full max-w-3xl px-6">
            <!-- SELECT * FROM GUAYABAS -->
            <div class="mb-10 text-center">
                <h2 class="typing text-green-400 text-4xl md:text-6xl lg:text-8xl font-['Press_Start_2P'] drop-shadow-[0_0_20px_#15ff73]">SELECT * FROM SQL;</h2>
            </div>

            <!-- Recuadro de login -->
            <div class="backdrop-blur-xl rounded-2xl border-4 border-green-400 bg-black/70 shadow-lg shadow-green-500/40 w-full py-12 px-8 space-y-6">
                <!-- Título -->
                <h1 class="text-center text-3xl md:text-4xl font-['Press_Start_2P'] text-green-400 drop-shadow-[0_0_15px_#15ff73] mb-6">INICIO DE SESIÓN</h1>

                <!-- Inputs -->
                <div class="space-y-4">
                    <input v-model="email" type="text" placeholder="Email" class="w-full px-4 py-3 rounded-xl bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 font-['Press_Start_2P']" />

                    <input v-model="password" type="password" placeholder="Contraseña" class="w-full px-4 py-3 rounded-xl bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 font-['Press_Start_2P']" />
                </div>

                <!-- Botones -->
                <div class="flex flex-col sm:flex-row gap-4 mt-6">
                    <button
                        @click="handleLogin"
                        class="flex-1 flex items-center justify-center gap-2 h-14 px-6 bg-green-500 text-black text-lg font-['Press_Start_2P'] rounded-xl shadow-lg shadow-green-400/40 hover:bg-green-600 hover:scale-105 transition-all"
                    >
                        Iniciar sesión
                    </button>

                    <button class="flex-1 flex items-center justify-center gap-2 h-14 px-6 bg-gray-700 text-white text-lg font-['Press_Start_2P'] rounded-xl shadow-lg hover:bg-gray-600 hover:scale-105 transition-all">Registrarse</button>
                </div>

                <!-- Error -->
                <div v-if="errorMessage" class="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-center">
                    🚨
                    {{ errorMessage }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes typing {
    0% {
        width: 0ch;
    }
    50% {
        width: 21ch;
    }
    100% {
        width: 0ch;
    }
}

@keyframes blink {
    50% {
        border-color: transparent;
    }
}

.typing {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    border-right: 4px solid #15ff73;
    animation: typing 10s steps(25, end) infinite, blink 1s step-end infinite;
}
</style>
