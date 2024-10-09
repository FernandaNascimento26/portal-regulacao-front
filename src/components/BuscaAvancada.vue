<template>
  <div class="busca-avancada">
    <h1>Busca avançada</h1>
    
    <!-- Input para palavra-chave -->
    <label for="keyword">Palavras-chave</label>
    <input id="keyword" type="text" v-model="filtro.palavraChave" placeholder="Digite palavras-chave">

    <!-- Select para tags -->
    <label for="tags">Tags</label>
    <select id="tags" v-model="filtro.tag">
      <option value="" disabled>Selecione uma tag</option>
      <option v-for="tag in opcoesTags" :key="tag.id" :value="tag.id">
        {{ tag.name }}
      </option>
    </select>

    <!-- Select para tipo de conteúdo -->
    <label for="tipo-conteudo">Tipo de Conteúdo</label>
    <select id="tipo-conteudo" v-model="filtro.tipoConteudo">
      <option value="" disabled>Selecione um tipo de conteúdo</option>
      <option v-for="tipo in opcoesTipoConteudo" :key="tipo.id" :value="tipo.id">
        {{ tipo.nome }}
      </option>
    </select>

    <!-- Select para etapa do ciclo -->
    <label for="etapa-ciclo">Etapa do Ciclo</label>
    <select id="etapa-ciclo" v-model="filtro.etapaCiclo">
      <option value="" disabled>Selecione uma etapa</option>
      <option v-for="etapa in etapasCiclo" :key="etapa.value" :value="etapa.value">
        {{ etapa.label }}
      </option>
    </select>

    <!-- Filtro de data de publicação -->
    <label for="data-inicio">Data de Publicação (Intervalo)</label>
    <input id="data-inicio" type="date" v-model="filtro.dataInicio">
    <input id="data-fim" type="date" v-model="filtro.dataFim">

    <!-- Botão de busca -->
    <button @click="buscarConteudos">Busca avançada</button>
    <button type="button" @click="limparCampos">Limpar Campos</button>

    <!-- Resultados -->
    <h2>Resultados</h2>
    <ul v-if="conteudos.length > 0">
      <li v-for="conteudo in conteudos" :key="conteudo.id">
        <a :href="`/conteudo/${conteudo.id}`" target="_blank">{{ conteudo.attributes.titulo }}</a>
      </li>
    </ul>
    <p v-else>Nenhum resultado encontrado.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      filtro: {
        palavraChave: '',
        tag: null,
        tipoConteudo: null,
        etapaCiclo: null,
        dataInicio: null,
        dataFim: null,
      },
      opcoesTags: [],
      opcoesTipoConteudo: [],
      etapasCiclo: [
        { value: 'planejamento', label: 'Planejamento Regulatário' },
        { value: 'intervencao', label: 'Intervenção Regulatória' },
        { value: 'implementacao', label: 'Implementação' },
        { value: 'fiscalizacao', label: 'Fiscalização e Monitoramento' },
        { value: 'avaliacao', label: 'Avaliação Regulatória' },
        { value: 'gestao', label: 'Gestão de Estoque' },
      ],
      conteudos: [],
    };
  },
  methods: {
    limparCampos() {
      this.filtro = {
        palavraChave: '',
        tag: null,
        tipoConteudo: null,
        etapaCiclo: null,
        dataInicio: null,
        dataFim: null,
      };
      this.resultados = [];
    },
    async carregarOpcoesTags() {
      try {
        const response = await axios.get('http://localhost:1337/api/tags');
        if (response.data && response.data.data) {
          this.opcoesTags = response.data.data.map(tag => ({
            id: tag.id,
            name: tag.attributes.name,
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar tags:', error);
        this.opcoesTags = [];
      }
    },
    async carregarOpcoesTipoConteudo() {
      try {
        const response = await axios.get('http://localhost:1337/api/categorias'); 
        if (response.data && response.data.data) {
          this.opcoesTipoConteudo = response.data.data.map(tipo => ({
            id: tipo.id,
            nome: tipo.attributes.Categoria,
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar tipos de conteúdo:', error);
        this.opcoesTipoConteudo = [];
      }
    },
    async buscarConteudos() {
      try {
        const query = this.montarQuery();
        const response = await axios.get(`http://localhost:1337/api/conteudos?${query}`);
        if (response.data && response.data.data) {
          this.conteudos = response.data.data;
        } else {
          this.conteudos = [];
        }
      } catch (error) {
        console.error('Erro ao buscar conteúdos:', error);
        this.conteudos = [];
      }
    },
    montarQuery() {
      const filters = [];

      if (this.filtro.palavraChave) {
        filters.push(`filters[titulo][$contains]=${this.filtro.palavraChave}`);
      }
      if (this.filtro.tag) {
        filters.push(`filters[tags][id]=${this.filtro.tag}`);
      }
      if (this.filtro.tipoConteudo) {
        filters.push(`filters[TipoConteudo][id]=${this.filtro.tipoConteudo}`);
      }
      if (this.filtro.etapaCiclo) {
        filters.push(`filters[etapa_ciclo]=${this.filtro.etapaCiclo}`);
      }

  if (this.filtro.dataInicio && this.filtro.dataFim) {
    const dataInicioFormatada = new Date(this.filtro.dataInicio).toISOString();
    const dataFimFormatada = new Date(this.filtro.dataFim).toISOString();
    filters.push(`filters[createdAt][$between]=${encodeURIComponent(dataInicioFormatada)}&filters[createdAt][$between]=${encodeURIComponent(dataFimFormatada)}`);
  }
      return filters.join('&');
    },
  },
  mounted() {
    this.carregarOpcoesTags();
    this.carregarOpcoesTipoConteudo();
  },
};
</script>

<style scoped>
.busca-avancada {
  max-width: 600px;
  margin: 0 auto;
}

h1, h2 {
  text-align: center;
}

label {
  display: block;
  margin-top: 10px;
}

input, select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
