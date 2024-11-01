<template>
    <NavBarVue></NavBarVue>
    <div class="profile-container">
        <div class="profile-box">
            <h2>Perfil de Usuario</h2>
            <div v-if="user">
                <p><strong>Número de Documento:</strong> {{ user.email }}</p>
                <p><strong>Nombre:</strong> {{ user.name }}</p>
                <p><strong>Apellido:</strong> {{ user.surname }}</p>
                <p><strong>Dirección:</strong> {{ user.address }}</p>
                <p><strong>Número de Teléfono:</strong> {{ user.phone }}</p>
                <p><strong>Rol:</strong> {{ user.role }}</p>
                <p><strong>Estado:</strong> {{ user.isActive ? 'Activo' : 'Inactivo' }}</p>

                <!-- Galería de imágenes -->
                <div class="image-gallery" v-if="imageUrls.length > 0">
                    <h3>Imágenes Subidas:</h3>
                    <div v-for="(url, index) in imageUrls" :key="index" class="image-wrapper">
                        <img :src="url" alt="Imagen de usuario" class="profile-image" />
                    </div>
                </div>
                <div v-else>
                    <p>No hay imágenes subidas.</p>
                </div>
            </div>
            <div v-else>
                <p>Cargando información del usuario...</p>
            </div>
        </div>
    </div>
</template>

<script>
import { getDatabase, ref, get } from 'firebase/database';
import NavBarVue from './Layouts/NavBar.vue';

export default {
    name: 'UserProfile',
    components: {
        NavBarVue
    },
    data() {
        return {
            user: null,
            imageUrls: []
        };
    },
    async created() {
        try {
            const userId = this.$route.query.uid;
            if (!userId) {
                console.error('UID no proporcionado en la ruta');
                alert('No se encontró el usuario.');
                return;
            }

            const db = getDatabase();
            const userRef = ref(db, `users/${userId}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();
                this.user = userData;

                // Obtener URLs de las imágenes con claves específicas
                this.imageUrls = [
                    userData.photo_conductor,
                    userData.photo_document,
                    userData.photo_licence,
                    userData.photo_tarjeton
                ].filter(Boolean); // Filtrar valores nulos o indefinidos

                console.log('Usuario encontrado:', this.user);
            } else {
                console.error('No se encontró el usuario en la base de datos');
                alert('No se encontró el usuario.');
            }
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
            alert('Error al obtener los datos del usuario.');
        }
    }
};
</script>

<style scoped>
.profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-image: url('../assets/images/fondo.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.profile-box {
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    text-align: left;
    width: 100%;
    max-width: 600px;
    background-color: rgba(255, 255, 255, 0.6);
}

.image-gallery {
    margin-top: 20px;
}

.image-gallery h3 {
    margin-bottom: 15px;
}

.image-wrapper {
    display: inline-block;
    margin: 10px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
}

.image-wrapper:hover {
    transform: scale(1.05);
}

.profile-image {
    display: block;
    width: 100px;
    height: 100px;
    object-fit: cover;
}
</style>
