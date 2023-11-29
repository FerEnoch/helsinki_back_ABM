export function getProdsFromCache(sheetData) {
  return sheetData.flatMap((firestoreDoc) => {
    return JSON.parse(firestoreDoc.data);
  });
}
