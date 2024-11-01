<template>
    <div class="login-container">
        <div class="login-box">
            <h2>Login</h2>
            <form @submit.prevent="loginUser">
                <div class="mb-3">
                    <label for="email" class="form-label">Numero de documento</label>
                    <input v-model="email"  placeholder="Numero de documento" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input v-model="password" type="password" placeholder="Password" class="form-control" required />
                </div>
                <button type="submit" class="btn login" style="color:white;">Login</button>
            </form>
        </div>
    </div>
</template>

<script>
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

export default {
    name: 'GeneralLogin',
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        async loginUser() {
            try {
                await signInWithEmailAndPassword(auth, this.email + '@gmail.com', this.password);
                
                // Obtener el usuario actual
                const user = auth.currentUser;
                const db = getDatabase();
                const userRef = ref(db, 'users/' + user.uid);

                // Obtener los datos del usuario
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const role = userData.role; // Obtener el rol
                    const isActive = userData.isActive; // Obtener el estado de actividad

                    if (!isActive) {
                        alert('Tu cuenta está inhabilitada. Contacta al administrador.');
                        await auth.signOut(); // Cerrar sesión si la cuenta está inhabilitada
                        return;
                    }

                    if (role === 'admin') {
                        this.$router.push('/panelAdmin'); // Redirigir a la página de inicio para administradores
                    } else {
                        this.$router.push('/inicio'); // Redirigir a la página de inicio para usuarios regulares
                    }
                    alert('Usuario logueado exitosamente!');
                } else {
                    alert('No se encontró el usuario en la base de datos.');
                }
            } catch (error) {
                if (error.code === 'auth/invalid-credential') {
                    alert('Credenciales incorrectas');
                } else {
                    // Manejo genérico para otros errores
                    alert('Error al loguear el usuario: ' + error.message);
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
    height: 100vh; /* Ocupa toda la altura de la ventana */
    font-weight: 600;

}

.login-box {
    padding: 30px; /* Aumenta el padding para más espacio interno */
    border-radius: 20px; /* Esquinas redondeadas */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Sombra más pronunciada */
    text-align: center; /* Centra el texto */
    width: 600px; /* Ancho fijo */
    min-width: 300px;
    height: 400px; /* Alto fijo */
    position: relative; /* Para el borde degradado */
    overflow: hidden; /* Para evitar que el degradado se salga del borde redondeado */
    background-color: rgba(255, 255, 255, 0.3); /* Fondo blanco con 90% de opacidad */
}

.form-control {
    margin-bottom: 20px; /* Aumenta el espaciado entre campos */
    padding: 10px; /* Añade un poco de padding interno */
    border: 1px solid #ced4da; /* Borde de entrada estándar */
    border-radius: 5px; /* Bordes redondeados para las entradas */
}

.btn {
    margin-top: 10px; /* Espaciado superior para el botón */
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
</style>
