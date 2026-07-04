import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

/**
 * Servidor SSR del landing. En producción corre como servicio systemd
 * (deploy/dalias-ssr.service) detrás de Caddy: Caddy sirve los estáticos y
 * proxya /api al CMS; aquí solo llegan las peticiones de páginas (HTML).
 *
 * Variables de entorno:
 * - PORT              puerto de escucha (default 4101; el 4000 es del CMS)
 * - CMS_INTERNAL_URL  base absoluta del API para los fetch del render en
 *                     servidor (ver ssr-api-base.interceptor.ts)
 */

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
// allowedHosts: el render usa siempre localhost como host (ver abajo), sin
// importar el header Host externo — Caddy es quien atiende el dominio público.
const commonEngine = new CommonEngine({ allowedHosts: ['localhost', '127.0.0.1'] });

/**
 * Estáticos del build browser (fallback local: en producción Caddy los sirve
 * antes de llegar aquí). `index: false` para que la raíz no se sirva estática
 * y pase siempre por el render SSR.
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }),
);

/**
 * El resto de peticiones se renderiza con Angular en el servidor.
 */
app.get('**', (req, res, next) => {
  const { originalUrl, baseUrl } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      // Host fijo: al router de Angular solo le importa el path, y así el
      // header Host entrante (que controla el cliente) no entra al render.
      url: `http://localhost${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Arranque directo (node server.mjs). PORT default 4101 para no chocar con el
 * CMS (:4000) ni con Caddy (:4001).
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4101;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
