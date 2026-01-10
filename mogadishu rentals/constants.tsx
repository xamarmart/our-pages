import { Product } from './types';

export const CATEGORIES = [
  { id: 'apartments', name: 'Apartments', icon: 'apartment' },
  { id: 'houses', name: 'Houses', icon: 'home' },
  { id: 'commercial', name: 'Commercial', icon: 'domain' },
  { id: 'hotel', name: 'Hotel', icon: 'hotel' },
  { id: 'rooms', name: 'Rooms', icon: 'meeting_room' },
];

export const MOGADISHU_DISTRICTS = [
  'Warta Nabada',
  'Hodan',
  'Howl-Wadag',
  'Hamar Weyne',
  'Hamar Jajab',
  'Abdiaziz',
  'Bondhere',
  'Shibis',
  'Shangani',
  'Waberi',
  'Wadajir',
  'Dharkenley',
  'Daynile',
  'Huriwa',
  'Karan',
  'Kaxda',
  'Yaqshid',
  'Darusalam',
  'Garasbaley',
  'Gubadley'
];

// Lightweight mocks used by some local views (POS, Messages) — replace with real data when integrating
export const MOCK_PRODUCTS: Partial<import('./types').Product>[] = [
  { id: 'p1', title: 'Studio Apartment', price: 300, image: 'https://picsum.photos/seed/p1/400/300', category: 'Apartments' },
  { id: 'p2', title: 'Two-Bedroom House', price: 800, image: 'https://picsum.photos/seed/p2/400/300', category: 'Houses' },
  { id: 'p3', title: 'Office Space', price: 1500, image: 'https://picsum.photos/seed/p3/400/300', category: 'Commercial' },
];

export const MOCK_MESSAGES = [
  {
    id: 'm1',
    sender: 'Amina',
    senderAvatar: 'https://picsum.photos/seed/sm1/100/100',
    time: '2h',
    productTitle: 'Studio Apartment',
    productImage: 'https://picsum.photos/seed/p1/100/100',
    lastMessage: 'Is this still available?',
    unreadCount: 1,
    type: 'Buying',
  },
  {
    id: 'm2',
    sender: 'Hassan',
    senderAvatar: 'https://picsum.photos/seed/sm2/100/100',
    time: '1d',
    productTitle: 'Two-Bedroom House',
    productImage: 'https://picsum.photos/seed/p2/100/100',
    lastMessage: 'When can I view it?',
    unreadCount: 0,
    type: 'Buying',
  },
];
