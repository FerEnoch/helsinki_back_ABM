export async function getProdsByCategories(buildedData) {
  const categories = new Set();

  buildedData.forEach((product) => {
    categories.add(product.category);
  });

  const prodsByCategories = new Map();

  [...categories].forEach((category) => {
    const filteredProd = buildedData.filter((prod) => prod.category === category);
    prodsByCategories.set(category, filteredProd);
  });

  return prodsByCategories.size > 0 ? prodsByCategories : null;
}
