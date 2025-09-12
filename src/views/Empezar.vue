<script setup>
import { useRouter } from 'vue-router';
import image6 from '@/assets/image6.png';
import pngwing3 from '@/assets/pngwing3.png';
import startSound from '@/assets/iniciarSound.mp3';
import '@fontsource/press-start-2p';

const router = useRouter();

const playSoundAndGo = () => {
    const audio = new Audio(startSound);
    audio.volume = 1; // 👈 volumen (0.0 a 1.0)
    audio.play();
    // esperar que suene un poco antes de ir al dashboard
    setTimeout(() => {
        router.push('/dashboard');
    }, 500); // ajusta el delay a la duración del efecto
};
</script>

<template>
    <div class="relative w-full min-h-screen bg-black text-white font-['Press_Start_2P',monospace] overflow-hidden flex flex-col items-center justify-center">
        <!-- Fondo -->
        <img :src="image6" alt="Fondo" class="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-green-900/30"></div>

        <!-- Contenido principal -->
        <div class="relative z-10 text-center space-y-16">
            <!-- Título -->
            <h1 class="text-6xl md:text-8xl lg:text-9xl text-green-500 drop-shadow-[0_0_30px_#00ff66] tracking-widest animate-pulse font-['Press_Start_2P']">COMMAND SQL</h1>

            <!-- Subtítulo -->
            <p class="text-xl md:text-3xl text-gray-200 tracking-wider font-['Press_Start_2P']">
                Bienvenido a bordo:
                <span class="text-green-400"></span>
            </p>

            <!-- Botón -->
            <button
                @click="playSoundAndGo"
                class="px-24 py-6 bg-gradient-to-r from-green-400 to-green-600 text-black font-['Press_Start_2P'] text-2xl rounded-2xl shadow-lg shadow-green-500/30 border-4 border-green-300 tracking-[0.25em] hover:scale-110 hover:shadow-green-400/50 transition-all"
            >
                ▶ EMPEZAR ◀
            </button>
        </div>

        <!-- Imagen decorativa inferior -->
        <img :src="pngwing3" alt="Decoración" class="absolute bottom-0 left-0 w-full max-h-[50vh] object-contain opacity-80" />
    </div>
</template>
