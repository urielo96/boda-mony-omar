// Google Apps Script — pegar en Extensions > Apps Script del Google Sheet
// Hoja debe tener estos encabezados en fila 1:
// Fecha | Nombre | Asistencia | Pases | Signo | Signo Invitado | Mensaje

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data  = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
      data.nombre        || '',
      data.asistencia    || '',
      data.pases         || '',
      data.signo         || '',
      data.signoInvitado || '',
      data.mensaje       || '',
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
