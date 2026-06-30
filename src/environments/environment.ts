// Entorno de DESARROLLO.
// cmsUrl vacío → las peticiones a /api se resuelven RELATIVAS y las redirige
// proxy.conf.json al CMS local (http://localhost:3000), evitando CORS.
// apiUrl = backend de negocio (NestJS) para contacto/visitas. En dev apunta al
// backend LOCAL (:3001); en prod, al backend desplegado (ver environment.prod.ts).
export const environment = {
  production: false,
  cmsUrl: '',
  apiUrl: 'http://localhost:3001',
  // Cuenta de Cloudinary de la organización (fuente única del cloud name).
  // Las imágenes estáticas usan este cloud en sus URLs; para construir URLs
  // dinámicas/nuevas, referenciar SIEMPRE esta constante en vez de hardcodear.
  cloudinaryCloudName: 'depdqybjp',
};
