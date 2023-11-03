export function selectPicture(id) {
  /**
   *  Both uc?id=<imageid>  or  uc?export=view&id=<imageid>
   *  are initialy valid as public URL paths with the baselink
   *  https://drive.google.com/
   *  I've chosen the longer one because althought I could't find exahustive
   *  docs, I think is the newer variation.
   */
  const baseLink = 'https://drive.google.com/uc?export=view&id=';
  const selectedPictureLink = `${baseLink}${id}`;

  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const selectedCell = spreadSheet.getActiveCell();

  selectedCell.setFontColor('blue');
  selectedCell.setValue(selectedPictureLink);
  spreadSheet.toast('Imagen agregada 👍', '📲 APP', 4);
}
