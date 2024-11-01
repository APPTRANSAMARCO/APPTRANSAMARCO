import { createRouter, createWebHistory } from 'vue-router';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from './firebase';

import GeneralLogin from './components/GeneralLogin.vue';
import AdminRegister from './components/Admin/AdminRegister.vue';
import Inicio from './components/UserInicio.vue';
import PanelAdmin from './components/Admin/AdminPanel.vue';
import EditUser from './components/User/EditUser.vue';
import MiPerfil from './components/MiPerfil.vue';
import VisualizarUsuarios from './components/VisualizarUsuario.vue';


const routes = [
    { path: '/', redirect: '/login' },
    {
        path: '/login',
        name: 'GeneralLogin',
        component: GeneralLogin
    },
    {
        path: '/adminRegister',
        name: 'AdminRegister',
        component: AdminRegister,
        beforeEnter: (to, from, next) => {
            const user = auth.currentUser;
            if (user) {
                const db = getDatabase();
                const userRef = ref(db, 'users/' + user.uid);

                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        if (userData.role === 'admin') {
                            next(); // Permitir acceso si es admin
                        } else {
                            alert('Acceso denegado. Solo administradores pueden acceder a esta página.');
                            next('/login'); // Redirigir a login
                        }
                    } else {
                        next('/login');
                    }
                });
            } else {
                next('/login'); // Redirigir a login si no hay usuario autenticado
            }
        }
    },
    {
        path: '/inicio',
        name: 'Inicio',
        component: Inicio,
        beforeEnter: (to, from, next) => {
            const user = auth.currentUser;
            if (user) {
                const db = getDatabase();
                const userRef = ref(db, 'users/' + user.uid);

                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        if (userData.isActive === 'false') {
                            next(); // Permitir si esta habilitado
                        } else {
                            alert('Acceso denegado. tu cuenta no esta habilitada.');
                            next('/login'); // Redirigir a login
                        }
                    } else {
                        next('/login');
                    }
                });
            } else {
                next('/login'); // Redirigir a login si no hay usuario autenticado
            }
        }
    },

    {
        path: '/panelAdmin',
        name: 'PanelAdmin',
        component: PanelAdmin,
        beforeEnter: (to, from, next) => {
            const user = auth.currentUser;
            if (user) {
                const db = getDatabase();
                const userRef = ref(db, 'users/' + user.uid);

                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        if (userData.role === 'admin') {
                            next(); // Permitir acceso si es admin
                        } else {
                            alert('Acceso denegado. Solo administradores pueden acceder a esta página.');
                            next('/login'); // Redirigir a login
                        }
                    } else {
                        next('/login');
                    }
                });
            } else {
                next('/login'); // Redirigir a login si no hay usuario autenticado
            }
        }
    },
    {
        path: '/editUser',
        name: 'EditUser',
        component: EditUser,
    },
    {
        path: '/miPerfil',
        name: 'MiPerfil',
        component: MiPerfil,
    },
    {
        path: '/visualizarUsuarios',
        name: 'VisualizarUsuarios',
        component: VisualizarUsuarios,
        meta: { requiresAuth: true }
    }


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
