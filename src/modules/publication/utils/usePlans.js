// composables/usePlans.js: solo se encarga de cargar los datos y manejar el loading
import { ref, onMounted } from 'vue';

export function usePlans(url = '/data/publishPlansData.json') {
  const loading = ref(true);
  const pageData = ref({
    mainTitle: 'Cargando...',
    mainSubtitle: 'Preparando las mejores opciones para ti',
    topLink: { text: '', url: '#' },
    plans: []
  });

  const loadPlans = async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al cargar datos');
      const data = await res.json();

      Object.assign(pageData.value, {
        mainTitle: data.mainTitle || 'Planes de Publicación',
        mainSubtitle: data.mainSubtitle || 'Selecciona el plan que mejor se adapte a tus necesidades',
        topLink: data.topLink || { text: 'Ver comparativa completa', url: '#' },
        plans: data.plans || []
      });
    } catch (err) {
      console.error('Error loading publish plans data:', err);
      pageData.value.mainTitle = 'No pudimos cargar los planes';
      pageData.value.mainSubtitle = 'Por favor, intenta recargar la página en unos momentos.';
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadPlans);

  return { pageData, loading };
}
