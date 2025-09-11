import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');

    if (!token || !role) return false;

    try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return exp > currentTime;
    } catch (e) {
        return false;
    }
};

const getUserRole = () => {
    return localStorage.getItem('user_role') || 'capturista';
};

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('@/views/pages/Login.vue'),
            beforeEnter: (to, from, next) => {
                if (isAuthenticated()) {
                    next('/empezar');
                } else {
                    next();
                }
            }
        },
        {
            path: '/empezar',
            name: 'empezar_view',
            component: () => import('@/views/Empezar.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/dashboard',
            component: AppLayout,
            children: [
                //DASHBOARD
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true }
                },
                //_______________________________
                //MISIONES
                {
                    path: '/mision/1',
                    name: 'mision_1',
                    component: () => import('@/views/uikit/misiones/mision_1.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/2',
                    name: 'mision_2',
                    component: () => import('@/views/uikit/misiones/mision_2.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/3',
                    name: 'mision_3',
                    component: () => import('@/views/uikit/misiones/mision_3.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/4',
                    name: 'mision_4',
                    component: () => import('@/views/uikit/misiones/mision_4.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/5',
                    name: 'mision_5',
                    component: () => import('@/views/uikit/misiones/mision_5.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/6',
                    name: 'mision_6',
                    component: () => import('@/views/uikit/misiones/mision_6.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/7',
                    name: 'mision_7',
                    component: () => import('@/views/uikit/misiones/mision_7.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/8',
                    name: 'mision_8',
                    component: () => import('@/views/uikit/misiones/mision_8.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/9',
                    name: 'mision_9',
                    component: () => import('@/views/uikit/misiones/mision_9.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/10',
                    name: 'mision_10',
                    component: () => import('@/views/uikit/misiones/mision_10.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/11',
                    name: 'mision_11',
                    component: () => import('@/views/uikit/misiones/mision_11.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/12',
                    name: 'mision_12',
                    component: () => import('@/views/uikit/misiones/mision_12.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/13',
                    name: 'mision_13',
                    component: () => import('@/views/uikit/misiones/mision_13.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/14',
                    name: 'mision_14',
                    component: () => import('@/views/uikit/misiones/mision_14.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/15',
                    name: 'mision_15',
                    component: () => import('@/views/uikit/misiones/mision_15.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/mision/16',
                    name: 'mision_16',
                    component: () => import('@/views/uikit/misiones/mision_16.vue'),
                    meta: { requiresAuth: true }
                },

                //_______________________________
                //MANUAL
                {
                    path: '/manual/ayuda',
                    name: 'verayuda',
                    component: () => import('@/views/uikit/manual/manual.vue'),
                    meta: { requiresAuth: true, requiresAdmin: true }
                },
                //_______________________________
                //LOGROS
                {
                    path: '/logros/todos',
                    name: 'verlogros',
                    component: () => import('@/views/uikit/logros/ListarLogros.vue'),
                    meta: { requiresAuth: true, requiresAdmin: true }
                },
                //_______________________________
                //REPORTES
                {
                    path: '/uikit/accionesultima',
                    name: 'accionesultima',
                    component: () => import('@/views/uikit/reportes/verLogrosUser.vue'),
                    meta: { requiresAuth: true, requiresAdmin: true }
                }
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
});

// **Protección de rutas con `beforeEach`**
router.beforeEach(async (to, from, next) => {
    const isAuth = isAuthenticated();
    const userRole = getUserRole();

    // 🔹 Permitir siempre acceder a login y no redirigir automáticamente
    if (to.name === 'login') {
        return next();
    }

    // 🔹 Si la ruta requiere autenticación y el usuario NO está autenticado
    if (to.meta.requiresAuth && !isAuth) {
        return next('/');
    }

    // 🔹 Si la ruta requiere ser admin y el usuario no es admin
    if (to.meta.requiresAdmin && userRole !== 'admin') {
        return next('/dashboard');
    }

    next();
});

export default router;
