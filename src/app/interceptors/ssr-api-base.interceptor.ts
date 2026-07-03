import { HttpInterceptorFn } from '@angular/common/http';

/**
 * En el navegador las llamadas al CMS son relativas (`/api/...`) y las
 * resuelve el proxy (Caddy en prod, proxy.conf.json en dev). En el render de
 * servidor no existe ese contexto: Node necesita una URL absoluta.
 *
 * Este interceptor solo se registra en app.config.server.ts (no viaja al
 * bundle del navegador) y prefija CMS_INTERNAL_URL a las rutas relativas.
 * En producción apunta al CMS de la misma máquina (http://127.0.0.1:4000);
 * en dev, al CMS local (http://localhost:3000).
 */
export const ssrApiBaseInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/')) {
    const base =
      (typeof process !== 'undefined' && process.env?.['CMS_INTERNAL_URL']) ||
      'http://localhost:3000';
    return next(req.clone({ url: `${base}${req.url}` }));
  }
  return next(req);
};
