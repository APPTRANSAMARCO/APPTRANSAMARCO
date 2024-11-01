<template>
    <NavBarVue></NavBarVue>
    <div class="contenedor-inicio">
        <h2>Inicio</h2>
        <p>User Role: {{ userRole }}</p>
    </div>
</template>

<script>
// import { ref } from 'vue';
// import { auth } from '../firebase';
// import { getDatabase, get, child, ref as dbRef } from 'firebase/database';
import NavBarVue from './Layouts/NavBar.vue';

export default {
    components: {
        NavBarVue,
    }

// setup() {
    //     const userRole = ref('');

    //     const fetchUserRole = async () => {
    //     const user = auth.currentUser;
    //     if (user) {
    //         const db = getDatabase();
    //         const snapshot = await get(child(dbRef(db), `users/${user.uid}`));
    //         if (snapshot.exists()) {
    //         userRole.value = snapshot.val().role;
    //         } else {
    //         console.log("No user data available");
    //         }
    //     }
    //     };

    //     fetchUserRole();

    //     return { userRole };
    // }
};
</script>

<style>
    .contenedor-inicio{
        color: white;
    }
    /* p:hover{
        color: black;
        transition: 2s;
    } */
</style>