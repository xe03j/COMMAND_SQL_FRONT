<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';
import desplazarSound from '@/assets/desplazarSound.mp3';

const route = useRoute();

const { layoutConfig, layoutState, setActiveMenuItem, onMenuToggle } = useLayout();

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    },
    root: {
        type: Boolean,
        default: true
    },
    parentItemKey: {
        type: String,
        default: null
    }
});

let soundEffect = null;

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
    itemKey.value = props.parentItemKey ? props.parentItemKey + '-' + props.index : String(props.index);

    const activeItem = layoutState.activeMenuItem;

    isActiveMenu.value = activeItem === itemKey.value || activeItem ? activeItem.startsWith(itemKey.value + '-') : false;

    soundEffect = new Audio(desplazarSound);
    soundEffect.volume = 0.8;
});

watch(
    () => layoutConfig.activeMenuItem.value,
    (newVal) => {
        isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(itemKey.value + '-');
    }
);

const playSound = () => {
    if (soundEffect) {
        soundEffect.currentTime = 0; // Reinicia desde el inicio
        soundEffect.play().catch((err) => {
            console.warn('El navegador bloqueó autoplay:', err);
        });
    }
};

const itemClick = (event, item) => {
    playSound();
    if (item.disabled) {
        event.preventDefault();
        return;
    }

    const { overlayMenuActive, staticMenuMobileActive } = layoutState;

    if ((item.to || item.url) && (staticMenuMobileActive.value || overlayMenuActive.value)) {
        onMenuToggle();
    }

    if (item.command) {
        item.command({ originalEvent: event, item: item });
    }

    const foundItemKey = item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey) : itemKey.value;

    setActiveMenuItem(foundItemKey);
};

const checkActiveRoute = (item) => {
    return route.path === item.to;
};
</script>

<template>
    <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
        <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">{{ item.label }}</div>
        <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url" @click="itemClick($event, item, index)" :class="item.class" :target="item.target" tabindex="0">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </a>
        <router-link v-if="item.to && !item.items && item.visible !== false" @click="itemClick($event, item, index)" :class="[item.class, { 'active-route': checkActiveRoute(item) }]" tabindex="0" :to="item.to">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </router-link>
        <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
            <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
                <app-menu-item v-for="(child, i) in item.items" :key="child" :index="i" :item="child" :parentItemKey="itemKey" :root="false"></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped>
/* Contenedor principal de cada item */
li.layout-root-menuitem {
    background-color: transparent; // 🔹 Fondo transparente
    margin-bottom: 6px;
    border-radius: 6px;
    font-family: 'Press Start 2P', sans-serif; // 🔹 Fuente nueva
}

/* Texto normal */
.layout-menuitem-text {
    color: #ffffff; // Blanco por defecto
    font-size: 0.8rem;
    letter-spacing: 1px;
    transition: color 0.3s ease;
}

/* Íconos */
.layout-menuitem-icon {
    color: #15ff73; // Verde neón
    font-size: 1rem;
    transition: color 0.3s ease;
}

/* Hover → verde brillante */
a:hover .layout-menuitem-text,
a:hover .layout-menuitem-icon,
.router-link:hover .layout-menuitem-text,
.router-link:hover .layout-menuitem-icon {
    color: #15ff73;
    text-shadow: 0 0 8px #15ff73; // Glow verde
}

/* Activo → fondo verde transparente */
.active-menuitem > a,
.active-route {
    background: rgba(21, 255, 115, 0.15); // Verde translúcido
    border-radius: 6px;
    color: #15ff73 !important;
}

.active-menuitem .layout-menuitem-icon,
.active-route .layout-menuitem-icon {
    color: #15ff73;
}

li.layout-root-menuitem,
li.layout-root-menuitem > a,
li.layout-root-menuitem > router-link,
li.layout-root-menuitem ul.layout-submenu {
    background: transparent !important;
}
</style>
