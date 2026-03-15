// ═══════════════════════════════════════════════════════════════
// GOOGLE APPS SCRIPT — RSVP Mariage Antoine & Morgane
// ═══════════════════════════════════════════════════════════════
// Ce code reçoit les soumissions RSVP du site et les écrit
// dans le Google Sheet "RSVP Mariage Antoine & Morgane".
//
// À coller dans Extensions > Apps Script du Google Sheet.
// ═══════════════════════════════════════════════════════════════

// ─── CONFIGURATION ───
var SHEET_NAME = 'RÉPONSES';
var EMAIL_RECIPIENTS = ['ant.guesdon@gmail.com', 'morganechaigneau@hotmail.fr'];

// ─── POST HANDLER ───
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Serveur occupé, réessayez.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error('Onglet "' + SHEET_NAME + '" introuvable.');
    }

    // Horodatage format français JJ/MM/AAAA HH:MM
    var now = new Date();
    var dateStr = Utilities.formatDate(now, 'Europe/Paris', 'dd/MM/yyyy HH:mm');

    // ID de soumission unique
    var submissionId = 'RSVP-' + Utilities.formatDate(now, 'Europe/Paris', 'yyyyMMdd-HHmmss') + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Écrire la ligne dans le Google Sheet
    sheet.appendRow([
      dateStr,                          // A - Date/Heure
      data.nom || '',                   // B - Nom
      data.prenom || '',                // C - Prénom
      data.email || '',                 // D - Email
      data.mairie || '—',              // E - Mairie
      data.afterMairie || '—',         // F - After-Mairie
      data.houppa || '—',             // G - Houppa & Soirée
      data.shabbatVen || '—',         // H - Shabbat Vendredi
      data.shabbatSam || '—',         // I - Shabbat Samedi
      data.car || '—',                // J - Car
      data.allergies || '',             // K - Allergies
      submissionId                      // L - ID soumission
    ]);

    // ─── EMAIL DE NOTIFICATION ───
    var subject = 'Nouvelle réponse RSVP — ' + (data.prenom || '') + ' ' + (data.nom || '');

    var body = '📋 NOUVELLE RÉPONSE RSVP\n';
    body += '══════════════════════════\n\n';
    body += '👤 ' + (data.prenom || '') + ' ' + (data.nom || '') + '\n';
    body += '📧 ' + (data.email || 'Non renseigné') + '\n\n';
    body += '── Présence aux événements ──\n';
    body += '• Mairie : ' + (data.mairie || '—') + '\n';
    body += '• After-Mairie : ' + (data.afterMairie || '—') + '\n';
    body += '• Houppa & Soirée : ' + (data.houppa || '—') + '\n';
    body += '• Shabbat Vendredi : ' + (data.shabbatVen || '—') + '\n';
    body += '• Shabbat Samedi : ' + (data.shabbatSam || '—') + '\n';
    body += '• Car (navette) : ' + (data.car || '—') + '\n\n';

    if (data.allergies) {
      body += '🍽️ Allergies/Régime : ' + data.allergies + '\n\n';
    }

    body += '── Détails ──\n';
    body += 'ID soumission : ' + submissionId + '\n';
    body += 'Date : ' + dateStr + '\n\n';
    body += '📊 Voir le Google Sheet :\n';
    body += ss.getUrl() + '\n';

    for (var i = 0; i < EMAIL_RECIPIENTS.length; i++) {
      MailApp.sendEmail({
        to: EMAIL_RECIPIENTS[i],
        subject: subject,
        body: body
      });
    }

    lock.releaseLock();
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    lock.releaseLock();
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── GET HANDLER (pour tester que le script fonctionne) ───
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Le script RSVP est actif.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
