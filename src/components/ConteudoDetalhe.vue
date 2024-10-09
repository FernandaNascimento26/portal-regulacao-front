<template>
  <div v-if="conteudo">
    <!-- Exibe o título -->
    <h1>{{ conteudo.attributes.titulo }}</h1>
    <h4>{{ conteudo.attributes.subtitulo }}</h4>

    <!-- Exibe o texto -->
    <div v-if="conteudo.attributes.texto && conteudo.attributes.texto.length">
      <div v-for="(paragraph, index) in conteudo.attributes.texto" :key="index">
        <p v-if="paragraph.children && paragraph.children.length">{{ paragraph.children[0].text }}</p>
      </div>
    </div>

    <!-- Mídias Internas -->
    <div v-if="conteudo.attributes.MidiasInternas && conteudo.attributes.MidiasInternas.data && conteudo.attributes.MidiasInternas.data.length">
      <h3>Mídias Internas:</h3>
      <div v-for="midia in conteudo.attributes.MidiasInternas.data" :key="midia.id">
        <div v-if="midia.attributes.mime.startsWith('image')">
          <img :src="`${baseApiUrl}${midia.attributes.url}`" alt="Mídia Interna" />
        </div>
        <div v-else-if="midia.attributes.mime.startsWith('video')">
          <video controls :src="`${baseApiUrl}${midia.attributes.url}`"></video>
        </div>
        <div v-else-if="midia.attributes.mime.startsWith('audio')">
          <audio controls :src="`${baseApiUrl}${midia.attributes.url}`"></audio>
        </div>
        <div v-else-if="midia.attributes.mime === 'application/pdf'">
          <a :href="`${baseApiUrl}${midia.attributes.url}`" target="_blank">Visualizar PDF</a>
        </div>
        <div v-else>
          <p>Formato de mídia não suportado</p>
        </div>
      </div>
    </div>

    <!-- Exibe as categorias -->
    <div v-if="conteudo.attributes.categorias && conteudo.attributes.categorias.data && conteudo.attributes.categorias.data.length">
      <h3>Tipos de Conteúdp:</h3>
      <ul>
        <li v-for="categoria in conteudo.attributes.categorias.data" :key="categoria.id">
          {{ categoria.attributes.Categoria }}
        </li>
      </ul>
    </div>

    <!-- Exibe as tags -->
    <div v-if="conteudo.attributes.tags && conteudo.attributes.tags.data && conteudo.attributes.tags.data.length">
      <h3>Tags:</h3>
      <ul>
        <li v-for="tag in conteudo.attributes.tags.data" :key="tag.id">
          {{ tag.attributes.name }}
        </li>
      </ul>
    </div>

    <!-- Exibe os conteúdos relacionados -->
    <div v-if="conteudosRelacionados.length">
      <h3>Conteúdos Relacionados:</h3>
      <ul>
        <li v-for="relacionado in conteudosRelacionados" :key="relacionado.id">
          <router-link :to="{ name: 'ConteudoDetalhe', params: { id: relacionado.id }}">{{ relacionado.attributes.titulo }}</router-link>
        </li>
      </ul>
    </div>

    <!-- Exibe os conteúdos relevantes -->
    <div v-if="conteudo.attributes.conteudosRelevantes && conteudo.attributes.conteudosRelevantes.data && conteudo.attributes.conteudosRelevantes.data.length">
      <h3>Conteúdos Relevantes:</h3>
      <ul>
        <li v-for="relevante in conteudo.attributes.conteudosRelevantes.data" :key="relevante.id">
          <router-link :to="{ name: 'ConteudoDetalhe', params: { id: relevante.id }}">{{ relevante.attributes.titulo }}</router-link>
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    <p>Conteúdo não encontrado</p>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useConteudosStore } from '@/stores/conteudosStore';
import useBaseApiUrl from '@/composables/useBaseApiUrl';

const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

export default {
  setup() {
    const store = useConteudosStore();
    const conteudo = ref(null);
    const conteudosRelacionados = ref([]);
    const baseApiUrl = useBaseApiUrl();
    const route = useRoute();

    const fetchConteudo = async (id) => {
      conteudo.value = store.getConteudoByID(id);
      if (!conteudo.value) {
        await store.fetchConteudos();
        conteudo.value = store.getConteudoByID(id);
      }

      if (conteudo.value) {
        const tagsDoConteudo = conteudo.value.attributes.tags.data.map(tag => tag.id);
        conteudosRelacionados.value = store.conteudos.filter(item => {
          const tagsDoItem = item.attributes.tags.data.map(tag => tag.id);
          return tagsDoItem.some(tag => tagsDoConteudo.includes(tag)) && item.id !== conteudo.value.id;
        }).slice(0, 5);
      }
    };

    onMounted(() => {
      fetchConteudo(route.params.id);
    });

    watch(() => route.params.id, (newId) => {
      fetchConteudo(newId);
    });

    return {
      conteudo,
      conteudosRelacionados,
      baseApiUrl,
      youtubeRegex
    };
  }
};
</script>
