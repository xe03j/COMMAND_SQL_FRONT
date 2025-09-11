<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import logoImage from '@/assets/logo22.png';
import UserProfile from '@/layout/UserProfile.vue'; // Importa el componente

const { layoutConfig, onMenuToggle } = useLayout();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const userMenuActive = ref(false);
const router = useRouter();
import '@fontsource/press-start-2p';

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    7;
    unbindOutsideClickListener();
});

const logoUrl = computed(() => logoImage);

const toggleUserMenu = () => {
    userMenuActive.value = !userMenuActive.value;
};

const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
};

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                userMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};

const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
};

const isOutsideClicked = (event) => {
    if (!userMenuActive.value) return;

    const userMenuEl = document.querySelector('.user-menu');
    const userButtonEl = document.querySelector('.user-menu-button');

    return !((userMenuEl && (userMenuEl.isSameNode(event.target) || userMenuEl.contains(event.target))) || (userButtonEl && (userButtonEl.isSameNode(event.target) || userButtonEl.contains(event.target))));
};
</script>

<template>
    <div class="layout-topbar">
        <!-- Sección izquierda: Logo + Menú -->
        <div class="left-section">
            <router-link to="/" class="layout-topbar-logo">
                <img :src="logoUrl" alt="logo" />
                <span class="texto-blanco font-['Press_Start_2P']" >Command SQL</span>
            </router-link>
            <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()" style="color: white">
                <i class="pi pi-bars"></i>
            </button>
        </div>

        <!-- Sección derecha: Usuario + Cerrar sesión -->
        <div class="right-section">
            <button class="p-link layout-topbar-button user-menu-button" @click="toggleUserMenu" style="color: white">
                <i class="pi pi-user"></i>
            </button>
            <div class="user-menu" v-if="userMenuActive">
                <UserProfile />
                <!-- Carga el perfil del usuario dentro del menú -->
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout-topbar {
    background-color: #000000; /* Azul UNACH */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
}

.texto-blanco {
    color: white;
}

.left-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.right-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
}

.user-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 1rem;
    z-index: 100;
}

.logout-button {
    width: 100%;
    padding: 0.5rem;
    background-color: #c9a227; /* Dorado UNACH */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    margin-top: 1rem;
}

.logout-button:hover {
    background-color: #b8961e; /* Dorado más oscuro */
}
</style>
