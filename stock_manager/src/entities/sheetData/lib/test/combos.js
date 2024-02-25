export const fetchedCombosData = {
  rawData: [
    ['Id', 'Categoría', 'Tipo', 'Productos', 'Precio', 'Info. destacada', 'Imagen'],
    [
      '*001',
      'Promos del finde',
      'Promo verano',
      '#003-2//\n#055-2//\n#157-1// ',
      10500,
      'Solo por febrero!',
      'https://drive.google.com/uc?export=view&id=18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF',
    ],
    [
      '*002',
      'Promos del finde',
      'Promo invierno',
      '#003-2 // #055-2 // #157-1',
      15060,
      'Solo por mayo',
      'https://drive.google.com/uc?export=view&id=18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF',
    ],
    ['*003', 'test-category', '', '233-4//012-1', '', '', ''],
    ['*004', 'test-category', '', '', 528, 6700, 33, 8911, 2211],
    ['*005', '', 'testing-not-category', 4756, '', '', ''],
    ['*006', 1888, '', '233'],
  ],
  headerIndexes: [0, 1, 2, 5, 3, 4, 6],
};

export const buildedCombosData = [
  {
    id: '*001',
    category: 'Promos del finde',
    type: 'Promo verano',
    featInfo: 'Solo por febrero!',
    products: [
      ['#003', '2'],
      ['#055', '2'],
      ['#157', '1'],
    ],
    price: 10500,
    isCombo: true,
    imageID: '18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF',
    imageURL: 'https://drive.google.com/uc?export=view&id=18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF',
  },
  {
    id: '*002',
    category: 'Promos del finde',
    type: 'Promo invierno',
    featInfo: 'Solo por mayo',
    products: [
      ['#003', '2'],
      ['#055', '2'],
      ['#157', '1'],
    ],
    price: 15060,
    isCombo: true,
    imageID: '18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF',
    imageURL: 'https://drive.google.com/uc?export=view&id=18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF',
  },
];

export const testCombosMapBuilding = {
  'Promos del finde': [
    {
      id: '*001',
      category: 'Promos del finde',
      type: 'Promo verano',
      featInfo: 'Solo por febrero!',
      products: [
        ['#003', '2'],
        ['#055', '2'],
        ['#157', '1'],
      ],
      price: 10500,
      isCombo: true,
      imageID: '18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF',
      imageURL: 'https://drive.google.com/uc?export=view&id=18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF',
    },
    {
      id: '*002',
      category: 'Promos del finde',
      type: 'Promo invierno',
      featInfo: 'Solo por mayo',
      products: [
        ['#003', '2'],
        ['#055', '2'],
        ['#157', '1'],
      ],
      price: 15060,
      isCombo: true,
      imageID: '18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF',
      imageURL: 'https://drive.google.com/uc?export=view&id=18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF',
    },
  ],
};

export const testCombosCache = [
  {
    category: 'Promos del finde',
    'firestoreName-ID': 'WdKdPfYyQAk2DlbNJHCy',
    firestoreName: 'projects/stock-backend-392114/databases/(default)/documents/combos-test/WdKdPfYyQAk2DlbNJHCy',
    data: '[{"id":"*001","isCombo":true,"category":"Promos del finde","type":"Promo verano","featInfo":"Solo por febrero!","products":[["#003","2"],["#055","2"],["#157","1"]],"price":10500,"imageID":"18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF","imageURL":"https://drive.google.com/uc?export=view&id=18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF"},{"id":"*002","isCombo":true,"category":"Promos del finde","type":"Promo invierno","featInfo":"Solo por mayo","products":[["#003","2"],["#055","2"],["#157","1"]],"price":15060,"imageID":"18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF","imageURL":"https://drive.google.com/uc?export=view&id=18m_BDX4spR9F2ZL8gBEujmEBRKP2fywF"}]',
  },
];
