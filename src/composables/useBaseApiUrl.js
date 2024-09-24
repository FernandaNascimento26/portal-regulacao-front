export default function useBaseApiUrl() {
  const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:1337';

  return baseUrl;
}
