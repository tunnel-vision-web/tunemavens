import { useEffect } from 'react';

export default function SEO({ title, description, schema, favicon }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | TuneMavens`;
    }
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || 'TuneMavens - The unified music-business ecosystem.';
    
    let ldJsonScript = document.getElementById('json-ld-schema');
    if (ldJsonScript) {
      ldJsonScript.remove();
    }
    
    if (schema) {
      ldJsonScript = document.createElement('script');
      ldJsonScript.id = 'json-ld-schema';
      ldJsonScript.type = 'application/ld+json';
      ldJsonScript.text = JSON.stringify(schema);
      document.head.appendChild(ldJsonScript);
    }

    // Dynamic Favicon Management for Persona Landings
    const originalFavicons = [];
    if (favicon) {
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach((el) => {
        originalFavicons.push({ el, href: el.getAttribute('href') });
        el.setAttribute('href', favicon);
      });

      if (existingFavicons.length === 0) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.href = favicon;
        document.head.appendChild(link);
      }
    }
    
    return () => {
      if (ldJsonScript) {
        ldJsonScript.remove();
      }
      if (favicon && originalFavicons.length > 0) {
        originalFavicons.forEach(({ el, href }) => {
          if (href) el.setAttribute('href', href);
        });
      }
    };
  }, [title, description, schema, favicon]);

  return null;
}
