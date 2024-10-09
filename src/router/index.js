import { createRouter, createWebHistory } from 'vue-router';
import ConteudoDetalhe from '@/components/ConteudoDetalhe.vue';
import BuscaAvancada from '@/components/BuscaAvancada.vue';
import CarouselDestaque from '@/components/CarouselDestaque.vue';

const routes = [
  {
    path: '/conteudo/:id',
    name: 'ConteudoDetalhe',
    component: ConteudoDetalhe,
    props: true,
  }, {
    path: '/busca-avancada',
    name: 'BuscaAvancada',
    component: BuscaAvancada, 
  },

  {
    path: '/carousel-destaque',
    name: 'CarouselDestque',
    component: CarouselDestaque, 
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
