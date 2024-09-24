import { defineStore } from 'pinia';
import axios from 'axios';

export const useConteudosStore = defineStore('conteudos', {
  state: () => ({
    conteudos: [], // Armazena todos os conteúdos
  }),
  actions: {
    async fetchConteudos() {
      try {
        const response = await axios.get(
          'http://localhost:1337/api/conteudos?populate=tags,categorias,MidiasExternas,MidiasInternas,conteudosRelevantes'
        );
        this.conteudos = response.data.data; // Armazena a lista de conteúdos
      } catch (error) {
        console.error('Erro ao buscar conteúdos:', error);
      }
    },
    getConteudoByID(id) {
      return this.conteudos.find((conteudo) => conteudo.id == id);
    },
  },
});
