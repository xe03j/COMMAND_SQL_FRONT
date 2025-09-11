<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import '@fontsource/press-start-2p';
import bg from '@/assets/background.png';
import overlay from '@/assets/pngwing2.png';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();

const handleRegister = async () => {
    errorMessage.value = '';
    successMessage.value = '';

    if (!email.value.trim() || !password.value.trim()) {
        errorMessage.value = 'Cadete, completa todos los campos.';
        return;
    }

    // Validación de correo con regex simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        errorMessage.value = 'Cadete, ingresa un correo válido.';
        return;
    }

    try {
        const response = await axios.post('https://command-sql-back.onrender.com/auth/register', {
            email: email.value.trim(),
            password: password.value.trim()
        });

        if (response.status === 200) {
            successMessage.value = '✅ Registro exitoso, inicia sesión ahora.';
            setTimeout(() => {
                router.push('/'); // vuelve al login
            }, 2000);
        }
    } catch (error) {
        if (error.response) {
            errorMessage.value = error.response.data.detail || 'Houston, no se pudo registrar.';
        } else {
            errorMessage.value = 'Ups, Houston hubo error en la conexión. Intenta más tarde.';
        }
    }
};
</script>

<template>
    <div class="relative w-full min-h-screen bg-black font-press flex items-center justify-center overflow-hidden">
        <img :src="bg" alt="background" class="absolute inset-0 w-full h-full object-cover" />
        <img :src="overlay" alt="overlay" class="absolute inset-0 w-full h-full object-contain opacity-80" />

        <div class="relative z-10 flex flex-col items-center w-full max-w-3xl px-6">
            <div class="mb-10 text-center">
                <h2 class="typing text-green-400 text-4xl md:text-6xl lg:text-8xl font-['Press_Start_2P'] drop-shadow-[0_0_20px_#15ff73]">CREATE USER;</h2>
            </div>

            <div class="backdrop-blur-xl rounded-2xl border-4 border-green-400 bg-black/70 shadow-lg shadow-green-500/40 w-full py-12 px-8 space-y-6">
                <h1 class="text-center text-3xl md:text-4xl font-['Press_Start_2P'] text-green-400 drop-shadow-[0_0_15px_#15ff73] mb-6">REGISTRO</h1>
                <p class="text-center text-sm md:text-base text-green-300 font-['Press_Start_2P'] mb-4">Cadete, ingresa un correo válido y una contraseña para unirte a la misión.</p>
                <!-- Inputs -->
                <div class="space-y-4">
                    <input v-model="email" type="text" placeholder="email@example.dominio" class="w-full px-4 py-3 rounded-xl bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 font-['Press_Start_2P']" />
                    <input v-model="password" type="password" placeholder="Contraseña" class="w-full px-4 py-3 rounded-xl bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 font-['Press_Start_2P']" />
                </div>

                <!-- Botón -->
                <div class="flex flex-col sm:flex-row gap-4 mt-6">
                    <button
                        @click="handleRegister"
                        class="flex-1 flex items-center justify-center gap-2 h-14 px-6 bg-green-500 text-black text-lg font-['Press_Start_2P'] rounded-xl shadow-lg shadow-green-400/40 hover:bg-green-600 hover:scale-105 transition-all"
                    >
                        Registrarse
                    </button>
                </div>

                <!-- Mensajes -->
                <div v-if="errorMessage" class="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-center">
                    🚨
                    {{ errorMessage }}
                </div>

                <div v-if="successMessage" class="mt-4 px-4 py-2 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-center">
                    🎉
                    {{ successMessage }}
                </div>
            </div>
        </div>
    </div>
</template>
