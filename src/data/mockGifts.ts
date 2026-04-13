import type { Gift } from '../types/gift'

export const mockGifts: Gift[] = [
  {
    id: '1',
    name: 'Cuna convertible',
    description: 'Se transforma en cama de niño grande cuando Alisha crezca',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop',
    type: 'single',
    category: 'essential',
    contributors: []
  },
  {
    id: '2',
    name: 'Silla de auto',
    description: 'Silla segura para viajes desde el nacimiento hasta los 4 años',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop',
    type: 'single',
    category: 'essential',
    contributors: []
  },
  {
    id: '3',
    name: 'Mecedora',
    description: 'Para arrullar a Alisha y darle la mayor comodidad',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop',
    type: 'single',
    category: 'essential',
    contributors: []
  },
  {
    id: '4',
    name: 'Kit de baño',
    description: 'Todo lo necesario para el momento del baño de Alisha',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
    type: 'group',
    maxContributors: 3,
    category: 'optional',
    contributors: [
      { name: 'Maria', lastname: 'López', email: 'maria@example.com' },
      { name: 'Carlos', lastname: 'Rodríguez', email: 'carlos@example.com' }
    ]
  },
  {
    id: '5',
    name: 'Monitor de bebé',
    description: 'Para estar tranquilo sabiendo que Alisha está bien',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop',
    type: 'single',
    category: 'optional',
    contributors: []
  },
  {
    id: '6',
    name: 'Set de ropa inicial',
    description: 'Body, ranitas y enteritos para los primeros meses',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop',
    type: 'group',
    maxContributors: 2,
    category: 'detail',
    contributors: []
  },
  {
    id: '7',
    name: 'Colchón de bebé',
    description: 'Firme y seguro para un buen descanso de Alisha',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&h=300&fit=crop',
    type: 'single',
    category: 'optional',
    contributors: []
  },
  {
    id: '8',
    name: 'Sterilizer y Calienta-biberones',
    description: 'Práctico para esterilizar y calentar rápido',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop',
    type: 'group',
    maxContributors: 4,
    category: 'detail',
    contributors: [
      { name: 'Ana', lastname: 'Martínez', email: 'ana@example.com' }
    ]
  }
]
