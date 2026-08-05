/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export interface SEOSettings {
  home: SEOConfig;
  historia: SEOConfig;
  expediciones: SEOConfig;
  bosqueValdiviano: SEOConfig;
  embajadores: SEOConfig;
  impacto: SEOConfig;
  blog: SEOConfig;
  contacto: SEOConfig;
}

export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroVideoUrl: string;
  missionTitle: string;
  missionQuote: string;
  missionText: string;
  storyPreviewTitle: string;
  storyPreviewText: string;
  storyPreviewImage: string;
}

export interface HistoriaContent {
  title: string;
  subtitle: string;
  heroImage: string;
  originText1: string;
  originText2: string;
  symbolTitle: string;
  symbolText: string;
  symbolImage: string;
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  philosophyTitle: string;
  philosophyText: string;
}

export interface Expedition {
  id: string; // e.g. 'bosque-valdiviano' or 'patagonia-norte'
  slug: string;
  title: string;
  subtitle: string;
  status: 'active' | 'draft' | 'soon';
  duration: string;
  physicalLevel: 'Bajo' | 'Medio' | 'Alto' | 'Desafiante';
  dates: string[];
  price: string;
  maxGroupSize: number;
  featuredImage: string;
  gallery: string[];
  mapImage: string;
  responsibleGuideId: string;
  storySummary: string;
  chapters: {
    title: string;
    description: string;
    image: string;
  }[];
  itinerary: {
    day: string;
    title: string;
    description: string;
    accommodation?: string;
  }[];
  whatsIncluded: string[];
  whatsNotIncluded: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface Ambassador {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  specialty: string;
  languages: string[];
  certifications: string[];
  quote: string;
  gallery: string[];
  videoUrl?: string;
}

export interface ImpactProject {
  id: string;
  title: string;
  category: 'Reforestación' | 'Educación' | 'Conservación';
  description: string;
  metricValue: string;
  metricLabel: string;
  image: string;
  location: string;
  details: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown supported
  authorId: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  isPublished: boolean;
}

export interface LeadNewsletter {
  id: string;
  email: string;
  createdAt: string;
}

export interface LeadWaitlist {
  id: string;
  expeditionId: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  notes: string;
  createdAt: string;
}

export interface LeadContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface GlobalCMSState {
  home: HomeContent;
  historia: HistoriaContent;
  expediciones: Expedition[];
  embajadores: Ambassador[];
  impacto: {
    summary: string;
    reforestedCount: number;
    schoolsSupported: number;
    conservedHectares: number;
    projects: ImpactProject[];
  };
  blog: BlogPost[];
  seo: SEOSettings;
  newsletter: LeadNewsletter[];
  waitlist: LeadWaitlist[];
  contactoSubmissions: LeadContact[];
}
