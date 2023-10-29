export function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}
