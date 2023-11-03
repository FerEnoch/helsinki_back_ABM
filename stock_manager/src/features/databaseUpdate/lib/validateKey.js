export function validateKey(validatingHeader, model) {
  if (model?.image?.test(validatingHeader)) return 'imageID';

  return Object.keys(model).find((key) => model[key]?.test(validatingHeader));
}
