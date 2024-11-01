<template>
    <nav class="contenedor navbar navbar-expand-lg navbar-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#" style=" color: #fff;">APPTRANSAMARCO</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <router-link to="/inicio" class="nav-link" style=" color: #fff;">Inicio</router-link>
                    </li>
                    
                </ul>
                <div class="dropdown">
                    <button class="btn dropdown-toggle" type="button" style=" color: #fff;" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        {{ user ? user.name : 'Usuario' }} <!-- Muestra el nombre del usuario -->
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li>
                            <router-link class="dropdown-item" v-if="user" :to="{ path: '/miPerfil', query: { uid: user.uid } }">Mi Perfil</router-link>
                        </li>
                        <li>
                            <router-link class="dropdown-item" v-if="user" :to="{ path: '/visualizarUsuarios', query: { uid: user.uid } }">Detalles Usuario</router-link>
                        </li>
                        <li>
                        </li>
                        <li v-if="isAdmin">
                            <router-link to="/panelAdmin" class="dropdown-item">Admin Panel</router-link>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" @click.prevent="logout">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { auth } from '../../firebase'; // Asegúrate de que esta ruta sea correcta
import { getDatabase, ref, get } from 'firebase/database';

export default {
    data() {
        return {
            user: null,
            isAdmin: false,
        };
    },
    created() {
        this.checkUser();
    },
    methods: {
        async checkUser() {
            const currentUser = auth.currentUser;
            if (currentUser) {
                this.user = currentUser;
                const db = getDatabase();
                const userRef = ref(db, 'users/' + currentUser.uid);
                
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    this.user = { ...currentUser, name: userData.name };
                    this.isAdmin = userData.role === 'admin';
                }
            }
        },
        async logout() {
            try {
                await auth.signOut();
                this.user = null;
                this.isAdmin = false;
                this.$router.push('/login'); // Redirigir a login después de cerrar sesión
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        }
    }
};
</script>

<style>
.navbar-expand-lg {
    background: rgba(199, 193, 164, 0.4);
    font-weight: 600;
}

.navbar-nav {
    display: flex;
    flex-direction: row;
}

.nav-link {
    padding: 10px 15px;
    color: white;
}

.dropdown-toggle {
    margin-left: auto; /* Para alinear a la derecha */
}

.dropdown-item {
    color: black; /* Cambia el color del texto de los ítems del dropdown */
}

.dropdown-item:hover {
    background-color: #e2e6ea; /* Color de fondo al pasar el mouse */
}
</style>
