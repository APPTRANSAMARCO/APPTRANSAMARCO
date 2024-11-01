<template>
    <NavBarVue></NavBarVue>
    <div class="content">
        <div class="container">
            <h2>Editar Perfil</h2>
            <form @submit.prevent="updateProfile">
                <div class="mb-3">
                    <p><strong>Numero de Documento:</strong> {{ user.email }}</p>
                </div>
                <div class="mb-3">
                    <label for="name" class="form-label">Nombre</label>
                    <input type="text" id="name" class="form-control" v-model="user.name" required />
                </div>
                <div class="mb-3">
                    <label for="surname" class="form-label">Apellido</label>
                    <input type="text" id="surname" class="form-control" v-model="user.surname" required />
                </div>
                <div class="mb-3">
                    <label for="address" class="form-label">Dirección</label>
                    <input type="text" id="address" class="form-control" v-model="user.address" required />
                </div>
                <div class="mb-3">
                    <label for="phone" class="form-label">Teléfono</label>
                    <input type="text" id="phone" class="form-control" v-model="user.phone" required />
                </div>
                <div class="mb-3">
                    <label for="role" class="form-label">Rol</label>
                    <select id="role" class="form-select" v-model="user.role" required>
                        <option v-if="isAdmin" value="admin">Administrador</option>
                        <option value="user">Usuario</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="photo_licence" class="form-label">Foto de la Licencia</label>
                    <img v-if="user.preview_photo_licence" :src="user.preview_photo_licence" alt="Licencia" class="img-preview" />
                    <input type="file" @change="handleFileChange('photo_licence', $event)" accept="image/png, image/jpeg" class="form-control" required/>
                </div>
                <div class="mb-3">
                    <label for="photo_document" class="form-label">Foto del Documento</label>
                    <img v-if="user.preview_photo_document" :src="user.preview_photo_document" alt="Documento" class="img-preview" />
                    <input type="file" @change="handleFileChange('photo_document', $event)" accept="image/png, image/jpeg" class="form-control" required/>
                </div>
                <div class="mb-3">
                    <label for="photo_conductor" class="form-label">Foto del Conductor</label>
                    <img v-if="user.preview_photo_conductor" :src="user.preview_photo_conductor" alt="Conductor" class="img-preview" />
                    <input type="file" @change="handleFileChange('photo_conductor', $event)" accept="image/png, image/jpeg" class="form-control" required/>
                </div>
                <div class="mb-3">
                    <label for="photo_tarjeton" class="form-label">Foto del Tarjeton</label>
                    <img v-if="user.preview_photo_tarjeton" :src="user.preview_photo_tarjeton" alt="Tarjeton" class="img-preview" />
                    <input type="file" @change="handleFileChange('photo_tarjeton', $event)" accept="image/png, image/jpeg" class="form-control" required/>
                </div>
                <div class="d-flex justify-content-between">
                    <button type="submit" class="btn guardar">Guardar Cambios</button>
                    <button type="button" class="btn cancel" @click="cancel">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { ref, get, update, getDatabase } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { database } from '../firebase';
import NavBarVue from './Layouts/NavBar.vue';

export default {
    components: {
        NavBarVue
    },
    data() {
        return {
            user: {
                name: '',
                surname: '',
                address: '',
                phone: '',
                role: '',
                email: '',
                photo_licence: '',
                photo_document: '',
                photo_conductor: '',
                photo_tarjeton: ''
            },
            file: null,
        };
    },
    async created() {
        const userId = this.$route.query.uid; // Obtiene el uid del query de la ruta
        if (!userId) {
            console.error('Error: No se proporcionó un ID de usuario en la ruta.');
            alert('Error: No se proporcionó un ID de usuario.');
            return;
        }

        const db = getDatabase();
        const userRef = ref(db, 'users/' + userId);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            this.isAdmin = userData.role === 'admin';
            this.user = snapshot.val(); // Guarda la información del usuario en la variable local
            this.user.uid = userId; // Agrega el uid al objeto user para usarlo al eliminar o subir imágenes
            console.log('Usuario encontrado:', this.user);
        } else {
            console.error('No se encontró el usuario');
            alert('No se encontró el usuario.');
        }
    },

    methods: {
        handleFileChange(key, event) {
            const file = event.target.files[0];
            if (file) {
                this.user[key] = file; // Guardar el archivo en la propiedad correspondiente
                const objectUrl = URL.createObjectURL(file); // Crear una URL para el archivo
                this.user[`preview_${key}`] = objectUrl; // Guardar la URL en otra propiedad para la vista previa
            }
        },
        async deleteImage(key) {
            const storage = getStorage();
            const imageRef = storageRef(storage, `images/${this.user.uid}/${key}_${this.user[key]?.name}`);
            if (!this.user[key]) {
                console.warn(`No hay archivo para eliminar en la clave ${key}.`);
                return; // Salir si no hay archivo
            }
            try {
                await deleteObject(imageRef);
                console.log(`Imagen ${key} eliminada correctamente.`);
            } catch (error) {
                console.error(`Error al eliminar la imagen ${key}:`, error);
            }
        },

        async uploadImage(key) {
            const file = this.user[key];
            if (file) {
                const storage = getStorage();
                const storageReference = storageRef(storage, `images/${this.user.uid}/${key}`);
                try {
                    await uploadBytes(storageReference, file);
                    const downloadURL = await getDownloadURL(storageReference);
                    return downloadURL; // Retorna la URL de la imagen
                } catch (error) {
                    console.error(`Error al subir la imagen ${key}:`, error);
                    alert(`Error al subir la imagen ${key}. Intenta de nuevo.`);
                }
            }
            return this.user[key]; // Retorna la URL existente si no hay nueva imagen
        },
        async updateProfile() {
            try {
                if (!this.user.uid) {
                    alert('Error: No se puede actualizar el perfil sin un ID de usuario.');
                    return;
                }

                // Eliminar imágenes antiguas antes de subir las nuevas
                await this.deleteImage('photo_licence');
                await this.deleteImage('photo_document');
                await this.deleteImage('photo_conductor');
                await this.deleteImage('photo_tarjeton');

                const userRef = ref(database, 'users/' + this.user.uid);
                const newPhotoLicenceURL = await this.uploadImage('photo_licence');
                const newPhotoDocumentURL = await this.uploadImage('photo_document');
                const newPhotoConductorURL = await this.uploadImage('photo_conductor');
                const newPhotoTarjetonURL = await this.uploadImage('photo_tarjeton');

                await update(userRef, {
                    name: this.user.name,
                    surname: this.user.surname,
                    address: this.user.address,
                    phone: this.user.phone,
                    role: this.user.role,
                    photo_licence: newPhotoLicenceURL,
                    photo_document: newPhotoDocumentURL,
                    photo_conductor: newPhotoConductorURL,
                    photo_tarjeton: newPhotoTarjetonURL
                });
                alert('Perfil actualizado correctamente');
                this.$router.push('/miPerfil');
            } catch (error) {
                console.error('Error al actualizar el perfil:', error);
                alert('Error al actualizar el perfil. Intenta de nuevo.');
            }
        },

        cancel() {
            this.$router.push('/miPerfil'); // Cambia a la ruta correspondiente
        }
    },
};
</script>

<style scoped>
.content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-weight: 600;
    padding: 20px;
    background-image: url('../assets/images/fondo.jpg'); /* Cambia esto a la ruta de tu imagen */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.container {
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
    width: 100%;
    max-width: 600px;
    min-width: 300px;
    background-color: rgba(255, 255, 255, 0.6); /* Aumentar opacidad para mayor contraste */
}

.mb-3 {
    margin-bottom: 15px;
}

.form-control, .form-select {
    width: 100%;
    box-sizing: border-box;
}

.btn {
    margin-top: 10px;
}

.guardar {
    color: white;
    background-color: rgba(248, 207, 7, 0.5);
}

.guardar:hover {
    background-color: rgb(248, 207, 7);
    transition: 1s;
}

.cancel {
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
}

.cancel:hover {
    background-color: rgb(0, 0, 0);
    transition: 1s;
}

.img-preview {
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
}


/* Media Query para móviles */
@media (max-width: 768px) {
    .login-box {
        padding: 20px;
    }

    .form-label {
        font-size: 14px; 
    }

    .form-control, .form-select {
        font-size: 14px; 
    }
}

@media (max-width: 576px) {
    .login-box {
        padding: 15px;
        width: 90%;
    }

    .form-label {
        font-size: 12px; 
    }

    .form-control, .form-select {
        font-size: 12px; 
    }
}
</style>
