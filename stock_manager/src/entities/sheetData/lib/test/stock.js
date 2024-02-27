export const fetchedStockData = {
  rawData: [
    [
      'id ',
      'Categoría',
      'Tipo',
      'Nombre',
      'Stock',
      'PRECIO COSTO',
      'Porcentaje recargo',
      'Precio público',
      'Ganancia',
      'Proveedor',
      'Descripción',
      'Imagen',
      'Destilería',
      'Alcohol %',
    ],
    [
      '#001',
      'Fernet',
      'Fernet',
      'Fernet branca 1L',
      395,
      8800,
      33,
      11704,
      2904,
      'mariano o fabrica ',
      'Elaborada a base de hierbas (mirra, ruibarbo, manzanilla, cardamomo y azafrán, entre otras)',
      'https://drive.google.com/uc?export=view&id=1ToG5gKlwY8nKk8uXgHGqNFk_qDIYMpQM',
      '',
      39,
    ],
    [
      '#002',
      'Fernet',
      'Fernet',
      'Fernet branca 750',
      528,
      6700,
      33,
      8911,
      2211,
      'mariano o fabrica ',
      'Elaborada a base de hierbas (mirra, ruibarbo, manzanilla, cardamomo y azafrán, entre otras)',
      'testing-no-image-url',
      '',
      39,
    ],
    ['#003', '', '', '', '', '', ''],
    ['#004', '', '', '', 528, 6700, 33, 8911, 2211],
    ['*005', '', 'testing-not-category', 4756, '', '', ''],
    ['#006', 1888],
    [
      '#007',
      'Vodka',
      'Vodka',
      'Absolut mango 750',
      35,
      15060,
      30,
      19578,
      4518,
      'aristos y exquisitos ',
      'Notas de mango maduros junto con un sabor a piña y maracuyá',
      'https://drive.google.com/uc?export=view&id=1FYuyLCcIwBe6mra6rG-Ual5VZ_59yYx9',
      '',
      40,
    ],
    [
      '#008',
      'Vodka',
      'Vodka',
      'Absolut mandarina 750',
      3,
      15060,
      30,
      19578,
      4518,
      'aristos y exquisitos ',
      'Sabor a mandarina mezclados con un toque de la cáscara de naranja.',
      'https://drive.google.com/uc?export=view&id=1xuCe_se5t6WLgCqpaFDdKvd6vxxCefpg',
      '',
      40,
    ],
    [
      '#009',
      'Vodka',
      'Vodka',
      'Absolut Lime 750',
      3,
      15060,
      30,
      19578,
      4518,
      'aristos y exquisitos ',
      'Notas citricas de limon y lima.',
      'https://drive.google.com/uc?export=view&id=1OeQUqUg0Avj-WAkANc9jgMgA7266YB1x',
      '',
      40,
    ],
    [
      '#010',
      'Vodka',
      'Vodka',
      'Absolut vainilla 750',
      0,
      0,
      0,
      0,
      0,
      'aristos y exquisitos ',
      'Combina el carácter de la vainilla, el tofe y sabores de caramelo',
      'https://drive.google.com/uc?export=view&id=1r7-Hsbi1G6vcdP53v3SGeBxnKHMIXXsJ',
      '',
      40,
    ],
  ],
  headerIndexes: [0, 1, 2, 3, 10, 11, 12, 13, 4, 7],
};

export const buildedStockData = [
  {
    id: '#001',
    category: 'Fernet',
    type: 'Fernet',
    name: 'Fernet branca 1L',
    description: 'Elaborada a base de hierbas (mirra, ruibarbo, manzanilla, cardamomo y azafrán, entre otras)',
    imageID: '1ToG5gKlwY8nKk8uXgHGqNFk_qDIYMpQM',
    imageURL: 'https://drive.google.com/uc?export=view&id=1ToG5gKlwY8nKk8uXgHGqNFk_qDIYMpQM',
    destillery: '',
    alcohol: 39,
    stock: true,
    price: 11704,
    isCombo: false,
  },
  {
    id: '#002',
    category: 'Fernet',
    type: 'Fernet',
    name: 'Fernet branca 750',
    description: 'Elaborada a base de hierbas (mirra, ruibarbo, manzanilla, cardamomo y azafrán, entre otras)',
    imageID: 'testing-no-image-url',
    imageURL: 'testing-no-image-url',
    destillery: '',
    alcohol: 39,
    stock: true,
    price: 8911,
    isCombo: false,
  },
  {
    id: '#006',
    category: 1888,
    type: undefined,
    name: undefined,
    description: undefined,
    imageID: undefined,
    imageURL: undefined,
    destillery: undefined,
    alcohol: undefined,
    stock: false,
    price: undefined,
    isCombo: false,
  },
  {
    id: '#007',
    category: 'Vodka',
    type: 'Vodka',
    name: 'Absolut mango 750',
    description: 'Notas de mango maduros junto con un sabor a piña y maracuyá',
    imageID: '1FYuyLCcIwBe6mra6rG-Ual5VZ_59yYx9',
    imageURL: 'https://drive.google.com/uc?export=view&id=1FYuyLCcIwBe6mra6rG-Ual5VZ_59yYx9',
    destillery: '',
    alcohol: 40,
    stock: true,
    price: 19578,
    isCombo: false,
  },
  {
    id: '#008',
    category: 'Vodka',
    type: 'Vodka',
    name: 'Absolut mandarina 750',
    description: 'Sabor a mandarina mezclados con un toque de la cáscara de naranja.',
    imageID: '1xuCe_se5t6WLgCqpaFDdKvd6vxxCefpg',
    imageURL: 'https://drive.google.com/uc?export=view&id=1xuCe_se5t6WLgCqpaFDdKvd6vxxCefpg',
    destillery: '',
    alcohol: 40,
    stock: true,
    price: 19578,
    isCombo: false,
  },
  {
    id: '#009',
    category: 'Vodka',
    type: 'Vodka',
    name: 'Absolut Lime 750',
    description: 'Notas citricas de limon y lima.',
    imageID: '1OeQUqUg0Avj-WAkANc9jgMgA7266YB1x',
    imageURL: 'https://drive.google.com/uc?export=view&id=1OeQUqUg0Avj-WAkANc9jgMgA7266YB1x',
    destillery: '',
    alcohol: 40,
    stock: true,
    price: 19578,
    isCombo: false,
  },
  {
    id: '#010',
    category: 'Vodka',
    type: 'Vodka',
    name: 'Absolut vainilla 750',
    description: 'Combina el carácter de la vainilla, el tofe y sabores de caramelo',
    imageID: '1r7-Hsbi1G6vcdP53v3SGeBxnKHMIXXsJ',
    imageURL: 'https://drive.google.com/uc?export=view&id=1r7-Hsbi1G6vcdP53v3SGeBxnKHMIXXsJ',
    destillery: '',
    alcohol: 40,
    stock: false,
    price: 0,
    isCombo: false,
  },
];

export const testStockMapBuilding = {
  1888: [
    {
      id: '#006',
      category: 1888,
      type: undefined,
      name: undefined,
      description: undefined,
      imageID: undefined,
      imageURL: undefined,
      destillery: undefined,
      alcohol: undefined,
      stock: false,
      price: undefined,
      isCombo: false,
    },
  ],
  Fernet: [
    {
      id: '#001',
      category: 'Fernet',
      type: 'Fernet',
      name: 'Fernet branca 1L',
      description: 'Elaborada a base de hierbas (mirra, ruibarbo, manzanilla, cardamomo y azafrán, entre otras)',
      imageID: '1ToG5gKlwY8nKk8uXgHGqNFk_qDIYMpQM',
      imageURL: 'https://drive.google.com/uc?export=view&id=1ToG5gKlwY8nKk8uXgHGqNFk_qDIYMpQM',
      destillery: '',
      alcohol: 39,
      stock: true,
      price: 11704,
      isCombo: false,
    },
    {
      id: '#002',
      category: 'Fernet',
      type: 'Fernet',
      name: 'Fernet branca 750',
      description: 'Elaborada a base de hierbas (mirra, ruibarbo, manzanilla, cardamomo y azafrán, entre otras)',
      imageID: 'testing-no-image-url',
      imageURL: 'testing-no-image-url',
      destillery: '',
      alcohol: 39,
      stock: true,
      price: 8911,
      isCombo: false,
    },
  ],
  Vodka: [
    {
      id: '#007',
      category: 'Vodka',
      type: 'Vodka',
      name: 'Absolut mango 750',
      description: 'Notas de mango maduros junto con un sabor a piña y maracuyá',
      imageID: '1FYuyLCcIwBe6mra6rG-Ual5VZ_59yYx9',
      imageURL: 'https://drive.google.com/uc?export=view&id=1FYuyLCcIwBe6mra6rG-Ual5VZ_59yYx9',
      destillery: '',
      alcohol: 40,
      stock: true,
      price: 19578,
      isCombo: false,
    },
    {
      id: '#008',
      category: 'Vodka',
      type: 'Vodka',
      name: 'Absolut mandarina 750',
      description: 'Sabor a mandarina mezclados con un toque de la cáscara de naranja.',
      imageID: '1xuCe_se5t6WLgCqpaFDdKvd6vxxCefpg',
      imageURL: 'https://drive.google.com/uc?export=view&id=1xuCe_se5t6WLgCqpaFDdKvd6vxxCefpg',
      destillery: '',
      alcohol: 40,
      stock: true,
      price: 19578,
      isCombo: false,
    },
    {
      id: '#009',
      category: 'Vodka',
      type: 'Vodka',
      name: 'Absolut Lime 750',
      description: 'Notas citricas de limon y lima.',
      imageID: '1OeQUqUg0Avj-WAkANc9jgMgA7266YB1x',
      imageURL: 'https://drive.google.com/uc?export=view&id=1OeQUqUg0Avj-WAkANc9jgMgA7266YB1x',
      destillery: '',
      alcohol: 40,
      stock: true,
      price: 19578,
      isCombo: false,
    },
    {
      id: '#010',
      category: 'Vodka',
      type: 'Vodka',
      name: 'Absolut vainilla 750',
      description: 'Combina el carácter de la vainilla, el tofe y sabores de caramelo',
      imageID: '1r7-Hsbi1G6vcdP53v3SGeBxnKHMIXXsJ',
      imageURL: 'https://drive.google.com/uc?export=view&id=1r7-Hsbi1G6vcdP53v3SGeBxnKHMIXXsJ',
      destillery: '',
      alcohol: 40,
      stock: false,
      price: 0,
      isCombo: false,
    },
  ],
};
