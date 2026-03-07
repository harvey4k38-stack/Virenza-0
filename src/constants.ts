import { Product, Review, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Virenza Classic Tennis Chain',
    price: 39.95,
    description: 'Our signature tennis chain featuring hand-set stones. A timeless statement piece that exudes luxury and class.',
    category: 'chains',
    images: [
      'input_file_1.png'
    ],
    thickness: ['3mm', '4mm', '5mm'],
    lengths: ['18"', '20"', '22"'],
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 124
  },
  {
    id: '2',
    name: 'Elite Iced Tennis Chain',
    price: 44.95,
    description: 'An elite version of our tennis chain with larger stones and a more secure clasp for maximum brilliance.',
    category: 'chains',
    images: [
      'input_file_3.png'
    ],
    thickness: ['4mm', '5mm'],
    lengths: ['18"', '20"'],
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 86
  },
  {
    id: '3',
    name: 'Grand Master Tennis Chain',
    price: 49.95,
    description: 'The pinnacle of our tennis collection. Unmatched brilliance and craftsmanship for those who demand the best.',
    category: 'chains',
    images: [
      'input_file_4.png'
    ],
    thickness: ['5mm', '6mm'],
    lengths: ['20"', '22"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 42
  },
  {
    id: '4',
    name: 'Signature Tennis Bracelet',
    price: 31.95,
    description: 'A classic tennis bracelet with hand-set stones. A timeless piece that adds a touch of elegance to any outfit.',
    category: 'bracelets',
    images: [
      'input_file_5.png',
      'input_file_6.png'
    ],
    thickness: ['3mm', '4mm'],
    lengths: ['7"', '8"'],
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 94
  },
  {
    id: '5',
    name: 'Royal Iced Bracelet',
    price: 34.95,
    description: 'A royal statement piece featuring high-clarity stones set in a premium polished finish.',
    category: 'bracelets',
    images: [
      'input_file_7.png'
    ],
    thickness: ['4mm', '5mm'],
    lengths: ['7"', '8"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 56
  },
  {
    id: '6',
    name: 'Executive Tennis Bracelet',
    price: 37.95,
    description: 'The executive choice. A bold yet sophisticated bracelet designed for the modern gentleman.',
    category: 'bracelets',
    images: [
      'input_file_8.png'
    ],
    thickness: ['5mm'],
    lengths: ['7.5"', '8.5"'],
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 38
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'James W.',
    rating: 5,
    comment: 'Good weight and looks clean with most outfits.'
  },
  {
    id: 'r2',
    author: 'Michael R.',
    rating: 5,
    comment: 'Exactly what I wanted. Simple and well made.'
  },
  {
    id: 'r3',
    author: 'David L.',
    rating: 5,
    comment: 'Minimal chain, feels durable.'
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'chains',
    name: 'Chains',
    image: 'input_file_0.png'
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    image: 'input_file_5.png'
  }
];
