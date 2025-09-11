<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const user = ref(null);
const router = useRouter();
const token = localStorage.getItem('access_token');

// 🔹 Cargar datos del usuario autenticado desde tu API
onMounted(async () => {
    try {
        const response = await axios.get('https://command-sql-back.onrender.com:8000/usuarios/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Ajusta según lo que devuelve tu endpoint
        const { email, nombre, apellido_paterno, apellido_materno, rol } = response.data;
        user.value = { email, nombre, apellido_paterno, apellido_materno, rol };
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
    }
});

// 🔹 Función para cerrar sesión
const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
};
</script>

<template>
    <div class="user-card">
        <div class="card-header">
            <div class="profile-icon">
                <i class="pi pi-user"></i>
            </div>
        </div>
        <div class="card-body">
            <h2 v-if="user">{{ user.nombre }} {{ user.apellido_paterno }} {{ user.apellido_materno }}</h2>
            <div v-if="user">
                <p class="info"><strong>Email:</strong> {{ user.email }}</p>
            </div>
            <div v-else>
                <p>Cargando información del usuario...</p>
            </div>
            <button class="logout-btn" @click="logout"><i class="pi pi-power-off"></i> Cerrar sesión</button>
        </div>
    </div>
</template>

<style scoped>
.user-card {
    width: 320px;
    background: #000; /* 🔹 Fondo negro */
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 255, 0, 0.2); /* Verde sutil */
    overflow: hidden;
    font-family: 'Arial', sans-serif;
    text-align: center;
    margin: 20px auto;
    transition: transform 0.3s ease-in-out;
    border: 1px solid #0f0; /* 🔹 Borde verde */
}

.user-card:hover {
    transform: translateY(-5px);
}

/* Encabezado con degradado negro-verde */
.card-header {
    background: linear-gradient(135deg, #000, #004400);
    padding: 20px 0;
}

.profile-icon {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: black;
    color: #0f0; /* Verde */
    font-size: 4rem;
    border: 4px solid #0f0;
}

.card-body {
    padding: 15px;
}

.card-body h2 {
    margin: 10px 0;
    font-size: 1.5em;
    font-weight: bold;
    color: white; /* 🔹 Nombre en blanco */
}

.card-body .info {
    margin: 5px 0;
    font-size: 1em;
    color: #bbb; /* Gris claro */
}

.card-body strong {
    color: #0f0; /* Verde para etiquetas */
}

/* Botón en verde */
.logout-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 10px 20px;
    background-color: #0f0;
    color: black;
    font-size: 1em;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 15px;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

.logout-btn i {
    font-size: 1.2em;
}

/* Hover más brillante */
.logout-btn:hover {
    background-color: #00ff66;
    color: black;
}
</style>
