// Entorno de PRODUCCIÓN.
// cmsUrl vacío → las peticiones a /api se resuelven RELATIVAS y las atiende el
// reverse-proxy de Caddy en el servidor (mismo-origen, sin CORS, sin exponer la
// API cross-origin). apiUrl = backend de negocio (Render) para contacto/visitas.
export const environment = {
  production: true,
  cmsUrl: '',
  previewOrigins: ['https://cms.residencialasdalias.pe'],
  apiUrl: 'https://backend-dalias.onrender.com',
  // Cuenta de Cloudinary de la organización (fuente única del cloud name).
  cloudinaryCloudName: 'depdqybjp',
};
