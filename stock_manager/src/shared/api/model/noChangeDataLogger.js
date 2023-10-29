/**
 *
 * @param {String[]} productsToLeaveUntouched Products that would not be updated in database because it
 *                                  was found no changes
 * @return {{...Products}[]}
 */
export function noChangeDataLogger(productsToLeaveUntouched) {
  Logger.log(`Returning ${productsToLeaveUntouched.length} products without changes`);
  return productsToLeaveUntouched.map((product) => product);
}
