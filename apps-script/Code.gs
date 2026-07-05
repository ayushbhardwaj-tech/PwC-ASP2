/**
 * ResOps — Google Apps Script Web App
 * Deploy this in your Google Sheet for near real-time data (no 5-min cache).
 *
 * SETUP:
 * 1. Open your Google Sheet → Extensions → Apps Script
 * 2. Paste this entire file
 * 3. Deploy → New deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL
 * 5. In index.html, update the fetch URL to your Web App URL
 *
 * USAGE in index.html:
 *   const resp = await fetch('YOUR_WEB_APP_URL');
 *   const json = await resp.json();
 *   DATA.resources = json.data;
 */

const SHEET_NAME = 'data'; // Change to your tab name

function doGet(e) {
  try {
    const ss     = SpreadsheetApp.getActiveSpreadsheet();
    const sheet  = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonResponse({ error: `Sheet "${SHEET_NAME}" not found` }, 404);
    }

    const range   = sheet.getDataRange();
    const values  = range.getValues();

    if (values.length < 2) {
      return jsonResponse({ data: [], updated: new Date().toISOString(), count: 0 });
    }

    const headers = values[0].map(h => String(h).trim());
    const rows    = values.slice(1)
      .filter(row => row.some(cell => cell !== '')) // skip blank rows
      .map(row => {
        const obj = {};
        headers.forEach((h, i) => {
          let val = row[i];
          // Format dates consistently
          if (val instanceof Date) {
            val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
          }
          obj[h] = val === null || val === undefined ? '' : String(val).trim();
        });
        return obj;
      });

    return jsonResponse({
      data:    rows,
      updated: new Date().toISOString(),
      count:   rows.length,
      sheet:   SHEET_NAME,
    });

  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function jsonResponse(payload, statusCode) {
  const output = ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Test function — run this in the Apps Script editor to verify
 */
function testDoGet() {
  const result = doGet({});
  const json   = JSON.parse(result.getContent());
  Logger.log('Rows returned: ' + json.count);
  Logger.log('First row: ' + JSON.stringify(json.data[0]));
}
