import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Asegúrate de que esta línea esté presente
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';



const app = createApp(App);
app.use(router); // Asegúrate de usar el router
app.mount('#app');
