<template>
    <NavBarVue></NavBarVue>
    <div class="content-admin">
        <div class="container-crud">
            <div class="d-flex w-100 justify-content-between align-items-center" style="padding: 0 20px;">
                <h1 class="m-4">Lista de Usuarios</h1>
                <button class="btn btn-warning btn-sm" style="margin:auto 0; height: 40px;">
                    <router-link to="/adminRegister" style="text-decoration:none; color:black;">Crear Usuario/Admin</router-link>
                </button>
            </div>
            <div>
                <table class="table table-dark table-striped mt-4">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Numero de Documento</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in paginatedUsers" :key="user.uid">
                            <th scope="row">{{ index + 1 + currentPage * usersPerPage }}</th>
                            <td>{{ user.email }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.role }}</td>
                            <td>{{ user.isActive ? 'Activo' : 'Inhabilitado' }}</td>
                            <td>
                                <router-link :to="{ path: '/visualizarUsuarios', query: { uid: user.uid } }" class="btn btn-warning btn-sm">Ver Detalles</router-link>
                                <router-link :to="{ path: '/miPerfil', query: { uid: user.uid } }" class="btn btn-warning btn-sm">Editar</router-link>
                                <button class="btn" :class="user.isActive ? 'btn-danger' : 'btn-success'" 
                                        @click="user.isActive ? inhabilitarUsuario(user.uid) : habilitarUsuario(user.uid)">
                                    {{ user.isActive ? 'Inhabilitar' : 'Habilitar' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 0 }">
                        <a class="page-link" @click="changePage(currentPage - 1)">Anterior</a>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage + 1 }">
                        <a class="page-link" @click="changePage(page - 1)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
                        <a class="page-link" @click="changePage(currentPage + 1)">Siguiente</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
import NavBarVue from '../Layouts/NavBar.vue';
import { ref, get, child, update } from 'firebase/database';
import { database } from '../../firebase'; // Asegúrate de que auth esté importado

export default {
    components: {
        NavBarVue,
    },
    data() {
        return {
            users: [],
            currentPage: 0,
            usersPerPage: 14,
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.users.length / this.usersPerPage);
        },
        paginatedUsers() {
            const start = this.currentPage * this.usersPerPage;
            return this.users.slice(start, start + this.usersPerPage);
        },
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            try {
                const dbRef = ref(database);
                const snapshot = await get(child(dbRef, 'users'));
                if (snapshot.exists()) {
                    this.users = Object.keys(snapshot.val()).map(key => ({
                        uid: key,
                        ...snapshot.val()[key]
                    }));
                } else {
                    this.users = [];
                    console.log('No hay datos disponibles');
                }
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        },

        async inhabilitarUsuario(uid) {
            if (confirm('¿Estás seguro de que deseas inhabilitar este usuario?')) {
                try {
                    const dbRef = ref(database, `users/${uid}`);
                    await update(dbRef, { isActive: false }); // Actualiza el estado del usuario
                    this.fetchUsers();
                    alert('Usuario inhabilitado correctamente');
                } catch (error) {
                    console.error('Error al inhabilitar el usuario:', error);
                }
            }
        },

        async habilitarUsuario(uid) {
            if (confirm('¿Estás seguro de que deseas habilitar este usuario?')) {
                try {
                    const dbRef = ref(database, `users/${uid}`);
                    await update(dbRef, { isActive: true }); // Actualiza el estado del usuario
                    this.fetchUsers();
                    alert('Usuario habilitado correctamente');
                } catch (error) {
                    console.error('Error al habilitar el usuario:', error);
                }
            }
        },

        changePage(page) {
            if (page >= 0 && page < this.totalPages) {
                this.currentPage = page;
            }
        },
    }
}
</script>

<style>
.content-admin {
    display: flex;
    width: 100%;
    justify-content: center;
    color: white;
    height: 100%;
    padding-top: 100px;
    background-image: url('../../assets/images/fondo.jpg'); /* Cambia esto a la ruta de tu imagen */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.container-crud {
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 6px 12px rgb(255, 255, 255);
    text-align: center;
    position: relative;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.3);
    max-width: 800px;
    max-height: 900px;
    width: 100%;
    margin: 0 auto;
}
</style>
