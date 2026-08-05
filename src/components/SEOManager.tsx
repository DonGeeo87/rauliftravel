/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { SEOConfig } from '../types';

interface SEOProps {
  config: SEOConfig;
  pageType: string;
}

export default function SEOManager({ config, pageType }: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = config.title;

    // 2. Helper to manage meta tag
    const updateMetaTag = (nameAttr: string, valueAttr: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${valueAttr}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, valueAttr);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update standard SEO Meta Tags
    updateMetaTag('name', 'description', config.description);
    updateMetaTag('name', 'keywords', config.keywords);

    // Update Open Graph (Social Sharing) Tags
    updateMetaTag('property', 'og:title', config.title);
    updateMetaTag('property', 'og:description', config.description);
    updateMetaTag('property', 'og:image', config.ogImage);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:url', window.location.href);

    // Update Twitter Cards Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', config.title);
    updateMetaTag('name', 'twitter:description', config.description);
    updateMetaTag('name', 'twitter:image', config.ogImage);

    // 3. Dynamic Structured Data (Schema.org JSON-LD)
    let schemaScript = document.getElementById('json-ld-schema') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'json-ld-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'NGO',
      'name': 'RAULIF',
      'url': window.location.origin,
      'logo': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=200&auto=format&fit=crop',
      'description': 'Comunidad europea para conocer y proteger la naturaleza silvestre de Chile.',
      'sameAs': [
        'https://instagram.com/rauliftravel',
        'https://youtube.com/rauliftravel'
      ]
    };

    const travelSchema = pageType === 'bosqueValdiviano' ? {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      'name': 'Expedición Bosque Valdiviano',
      'description': config.description,
      'touristType': 'Ecoturismo, Senderismo Científico, Voluntariado Ambiental',
      'offers': {
        '@type': 'Offer',
        'price': '1450',
        'priceCurrency': 'EUR',
        'eligibleRegion': 'Europe'
      },
      'provider': organizationSchema
    } : organizationSchema;

    schemaScript.textContent = JSON.stringify(travelSchema);

    // Clean up when unmounting (optional, keeps tags but ensures fresh ones load)
  }, [config, pageType]);

  return null; // This component operates strictly as a side-effect manager for HTML head
}
