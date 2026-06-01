// Google Apps Script — pegar en Extensions > Apps Script del Google Sheet
// Encabezados fila 1:
// Fecha | Versión | Nombre | Asistencia | Pases | Mesa | Signos (todos) | Mensaje

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data  = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
      data.version    || '',
      data.nombre     || '',
      data.asistencia || '',
      data.pases      || '',
      data.mesa       || '',
      data.signos     || '',
      data.mensaje    || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
