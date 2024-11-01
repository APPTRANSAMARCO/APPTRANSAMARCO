
<template>
    <NavBarVue></NavBarVue>
    <div class="login-container">
        <div class="login-box">
            <h2>Register</h2>
            <form @submit.prevent="registerUser">
                <div class="mb-3">
                    <label for="email" class="form-label">Numero de Documento</label>
                    <input v-model="email"  placeholder="Numero de Documento" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="name" class="form-label">Nombre</label>
                    <input v-model="name" type="text" placeholder="Nombre" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="surname" class="form-label">Apellido</label>
                    <input v-model="surname" type="text" placeholder="Apellidos" class="form-control" required />
                </div>
                <!-- <div class="mb-3">
                    <label for="document_number" class="form-label">Numero de Documento</label>
                    <input v-model="document_number" type="text" placeholder="Numero de Documento" class="form-control" required />
                </div> -->
                <div class="mb-3">
                    <label for="address" class="form-label">Direccion</label>
                    <input v-model="address" type="text" placeholder="Direccion" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="phone" class="form-label">Numero de Telefono</label>
                    <input v-model="phone" type="text" placeholder="Numero de Telefono" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="photo_licence" class="form-label">Foto de la Licencia</label>
                    <input type="file" @change="handleFileChange('photo_licence', $event)" accept="image/png, image/jpeg" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="photo_document" class="form-label">Foto del Documento</label>
                    <input type="file" @change="handleFileChange('photo_document', $event)" accept="image/png, image/jpeg" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="photo_conductor" class="form-label">Foto del Conductor</label>
                    <input type="file" @change="handleFileChange('photo_conductor', $event)" accept="image/png, image/jpeg" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="photo_tarjeton" class="form-label">Foto del Tarjeton</label>
                    <input type="file" @change="handleFileChange('photo_tarjeton', $event)" accept="image/png, image/jpeg" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input v-model="password" type="password" placeholder="Password" class="form-control" required />
                </div>
                
                <div class="mb-3">
                    <select v-model="role" class="form-select mt-4" ria-label="Default select example" required>
                        <option value="" disabled>Selecciona un rol</option>
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                
                <router-link to="/login" class="btn login" >Login</router-link>
                <button type="submit"  class=" btn regis" style="color:white; margin-left:20px;">Register</button>
                
            </form> 
        </div>
    </div>
</template>

<script>
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get, child, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import NavBarVue from '../Layouts/NavBar.vue';
export default {
    name: 'AdminRegister',
    components: {
        NavBarVue
    },
    data() {
        return {
            email: '',
            name: '',
            surname: '',
            // document_number: '',
            address: '',
            phone: '',
            password: '',
            role: '',
            files: {
                photo_licence: null,
                photo_document: null,
                photo_conductor: null,
                photo_tarjeton: null
            }
        };
    },
    methods: {
        async checkEmailExists(email) {
            const db = getDatabase();
            const userRef = ref(db, 'users');
            const snapshot = await get(child(userRef, email.replace('.', ','))); // Reemplaza '.' en el correo

            return snapshot.exists(); // Devuelve true si existe
        },
        handleFileChange(key, event) {
            const file = event.target.files[0];
            if (file) {
                this.files[key] = file;
            }
        },
        async uploadFiles(userId) {
            const storage = getStorage();
            const fileUrls = {};

            for (const [key, file] of Object.entries(this.files)) {
                if (file) {
                    const storageReference = storageRef(storage, `images/${userId}/${key}`);
                    await uploadBytes(storageReference, file);
                    const downloadURL = await getDownloadURL(storageReference);
                    fileUrls[key] = downloadURL; // Guardar URL de cada archivo
                }
            }
            return fileUrls;
        },
        async registerUser() {
            try {
                const emailExists = await this.checkEmailExists(this.email);
                if (emailExists) {
                    alert('El correo electrónico ya está registrado. Por favor, utiliza otro.');
                    return;
                }

                const userCredential = await createUserWithEmailAndPassword(auth, this.email + '@gmail.com', this.password);
                const userId = userCredential.user.uid;
                const db = getDatabase();

                // Sube archivos y obtiene URLs
                const fileUrls = await this.uploadFiles(userId);

                // Guardamos el usuario en Realtime Database
                await set(ref(db, 'users/' + userId), {
                    email: this.email,
                    name: this.name,
                    surname: this.surname,
                    // document_number: this.document_number,
                    address: this.address,
                    phone: this.phone,
                    password: this.password,
                    role: this.role,
                    fileUrls: fileUrls // Guarda las URLs de las imágenes
                });

                alert('Usuario registrado exitosamente!');
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    alert('Numero de cuenta ya está registrado. Por favor, utiliza otro.');
                } else if (error.code === 'auth/invalid-email') {
                    alert(' Por favor, verifica e intenta de nuevo.');
                } else if (error.code === 'auth/weak-password') {
                    alert('La contraseña debe tener al menos 6 caracteres. Por favor, elige una contraseña más fuerte.');
                } else {
                    // Manejo genérico para otros errores
                    alert('Error al registrar el usuario: ' + error.message);
                }
            }
        }

    }
};
</script>


<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-weight: 600;
    padding: 20px;
    background-image: url('../../assets/images/fondo.jpg'); /* Cambia esto a la ruta de tu imagen */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.login-box {
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
    width: 100%;
    max-width: 600px;
    min-width: 300px;
    background-color: rgba(255, 255, 255, 0.6);
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

.regis {
    color: white;
    background-color: rgba(248, 207, 7, 0.5);
}

.regis:hover {
    background-color: rgb(248, 207, 7);
    transition: 1s;
}

.login {
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
}

.login:hover {
    background-color: rgb(0, 0, 0);
    transition: 1s;
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