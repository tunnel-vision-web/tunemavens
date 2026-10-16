import { useEffect } from 'react';

export default function SEO({ title, description, schema }) {
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
    
    return () => {
      if (ldJsonScript) {
        ldJsonScript.remove();
      }
    };
  }, [title, description, schema]);

  return null;
}
