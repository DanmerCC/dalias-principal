// Entorno de DESARROLLO.
// cmsUrl vacío → las peticiones a /api se resuelven RELATIVAS y las redirige
// proxy.conf.json al CMS local (http://localhost:3010), evitando CORS.
// apiUrl = backend de negocio (NestJS) para contacto/visitas. En dev apunta al
// backend LOCAL (:3001); en prod, al backend desplegado (ver environment.prod.ts).
// previewOrigins = orígenes válidos del admin de Payload que pueden embeber el
// iframe de Live Preview. Debe coincidir con PAYLOAD_PUBLIC_SERVER_URL del .env
// del CMS (ver dalias-cms/.env); si no, los postMessage se descartan en
// header.component.ts (isAllowedPreviewOrigin) y el header nunca se refresca.
export const environment = {
  production: false,
  cmsUrl: '',
  previewOrigins: ['http://localhost:3010'],
  apiUrl: 'http://localhost:3001',
  // Cuenta de Cloudinary de la organización (fuente única del cloud name).
  // Las imágenes estáticas usan este cloud en sus URLs; para construir URLs
  // dinámicas/nuevas, referenciar SIEMPRE esta constante en vez de hardcodear.
  cloudinaryCloudName: 'depdqybjp',
};
