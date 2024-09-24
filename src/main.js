import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Certifique-se de importar o arquivo de rotas
import { createPinia } from 'pinia';  // Se estiver usando Pinia

const app = createApp(App);

app.use(router);  // Utilize o Vue Router na aplicação
app.use(createPinia());  // Utilize Pinia, se aplicável

app.mount('#app');  // Monte a aplicação na div com id 'app'
