<template>
    <div>
      <h1>Conteúdos em Destaque</h1>
      <!-- Verifica se há conteúdos destacados -->
      <div v-if="conteudos && conteudos.length">
        <div v-for="conteudo in conteudos" :key="conteudo.id" class="content-item">
          <!-- Exibe a mídia apenas se MidiasInternas existir e tiver ao menos um item -->
          <img v-if="conteudo.attributes.MidiasInternas?.data && conteudo.attributes.MidiasInternas.data.length" 
               :src="getMediaUrl(conteudo.attributes.MidiasInternas.data[0])" 
               :alt="conteudo.attributes.MidiasInternas.data[0]?.attributes?.alternativeText || conteudo.attributes.titulo" 
               class="content-media" />
          <h3>{{ conteudo.attributes.titulo }}</h3>
        </div>
      </div>
      <p v-else>Nenhum conteúdo em destaque disponível.</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        conteudos: [],
      };
    },
    async mounted() {
      await this.fetchConteudos();
    },
    methods: {
      async fetchConteudos() {
        try {
          const response = await fetch('http://localhost:1337/api/conteudos?filters[destaque][$eq]=true&sort=createdAt:desc&populate=MidiasInternas');
          if (!response.ok) {
            throw new Error('Erro ao buscar dados: ' + response.statusText);
          }
          const { data } = await response.json();
          this.conteudos = data;
        } catch (error) {
          console.error('Erro ao buscar conteúdos em destaque:', error);
        }
      },
      getMediaUrl(media) {
        const baseUrl = 'http://localhost:1337'; 
        return baseUrl + media.attributes.url;
      },
    },
  };
  </script>
  
  <style scoped>
  .content-item {
    margin-bottom: 20px;
  }
  .content-media {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }
  </style>
  