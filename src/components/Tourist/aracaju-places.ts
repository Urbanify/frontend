import type { LucideIcon } from 'lucide-react';
import { Landmark, Trees, Utensils, Waves } from 'lucide-react';

// Approximate positions (about 300 m), from OpenStreetMap. Descriptions written for Urbanify.
// Public places only. The demo city is Aracaju (SE).

export type PlaceCategory = 'orla' | 'cultura' | 'comer' | 'lazer';

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  position: { lat: number; lng: number };
};

export const ARACAJU_PLACES: Place[] = [
  { id: 'arcos-da-orla', name: 'Orla de Atalaia e Arcos da Orla', category: 'orla', description: 'Calçadão da praia de Atalaia, onde ficam os arcos que se tornaram um cartão-postal de Aracaju.', position: { lat: -10.98888, lng: -37.04821 } },
  { id: 'oceanario-de-aracaju', name: 'Oceanário de Aracaju', category: 'lazer', description: 'Aquário na orla de Atalaia, dedicado à vida marinha e à conservação ambiental.', position: { lat: -10.97894, lng: -37.04096 } },
  { id: 'passarela-do-caranguejo', name: 'Passarela do Caranguejo', category: 'comer', description: 'Rua de bares e restaurantes em Atalaia, conhecida pelos pratos com caranguejo e frutos do mar.', position: { lat: -10.99429, lng: -37.0533 } },
  { id: 'praia-do-refugio', name: 'Praia do Refúgio', category: 'orla', description: 'Praia no litoral sul de Aracaju, mais tranquila e afastada do movimento da orla de Atalaia.', position: { lat: -11.0505, lng: -37.0992 } },
  { id: 'catedral-metropolitana', name: 'Catedral Metropolitana', category: 'cultura', description: 'Igreja-sede da arquidiocese de Aracaju, em uma praça do Centro histórico.', position: { lat: -10.91329, lng: -37.05169 } },
  { id: 'praca-fausto-cardoso', name: 'Praça Fausto Cardoso', category: 'cultura', description: 'Praça do Centro histórico voltada para o Rio Sergipe, ponto de encontro e de eventos.', position: { lat: -10.91331, lng: -37.04912 } },
  { id: 'museu-da-gente-sergipana', name: 'Museu da Gente Sergipana', category: 'cultura', description: 'Museu interativo no Centro que apresenta a cultura, a história e as pessoas de Sergipe.', position: { lat: -10.91742, lng: -37.04761 } },
  { id: 'centro-de-turismo', name: 'Centro de Turismo', category: 'comer', description: 'Espaço no Centro dedicado ao turismo, com artesanato e comidas típicas.', position: { lat: -10.9126, lng: -37.05092 } },
  { id: 'mercado-antonio-franco', name: 'Mercado Antônio Franco', category: 'comer', description: 'Mercado de artesanato no Centro, com peças e lembranças feitas em Sergipe.', position: { lat: -10.90737, lng: -37.04882 } },
  { id: 'parque-da-sementeira', name: 'Parque da Sementeira', category: 'lazer', description: 'Parque urbano nos Jardins, com áreas verdes para caminhar, passear e se exercitar.', position: { lat: -10.9445, lng: -37.0545 } },
  { id: 'ponte-joao-alves', name: 'Ponte Construtor João Alves', category: 'lazer', description: 'Ponte sobre o Rio Sergipe que liga Aracaju à Barra dos Coqueiros, com vista para o rio.', position: { lat: -10.89497, lng: -37.04405 } },
  { id: 'estadio-batistao', name: 'Estádio Batistão', category: 'lazer', description: 'Principal estádio de futebol de Sergipe, onde jogam os grandes clubes do estado.', position: { lat: -10.92706, lng: -37.04911 } },
];

// Key: city name without accents, in lowercase
export const PLACES_BY_CITY: Record<string, Place[]> = { aracaju: ARACAJU_PLACES };

export const CATEGORY_META: Record<PlaceCategory, { label: string; icon: LucideIcon }> = {
  orla: { label: 'Orla e praias', icon: Waves },
  cultura: { label: 'Cultura e história', icon: Landmark },
  comer: { label: 'Comer e comprar', icon: Utensils },
  lazer: { label: 'Parques e lazer', icon: Trees },
};

export const citySlug = (name: string) =>
  name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
