import { createRouter, createWebHistory } from 'vue-router';
import ConteudoDetalhe from '@/components/ConteudoDetalhe.vue';

const routes = [
  {
    path: '/conteudo/:id',
    name: 'ConteudoDetalhe',
    component: ConteudoDetalhe,
    props: true,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
