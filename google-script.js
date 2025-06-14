// Google Apps Script to handle form submissions
function doPost(e) {
  try {
    // Get the active spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();

    // Get form data
    const formData = e.parameter;

    // Get form fields
    const name = formData.name;
    const email = formData.email;
    const countryCode = formData.countryCode;
    const phone = formData.phone;
    const service = formData.service;
    const subject = formData.subject;
    const message = formData.message;
    const timestamp = new Date();

    // Add the data to the spreadsheet
    sheet.appendRow([
      timestamp,
      name,
      email,
      countryCode + phone,
      service,
      subject,
      message,
    ]);

    // Return success response
    return HtmlService.createHtmlOutput(
      '<script>window.top.location.href = "' +
        ScriptApp.getService().getUrl() +
        '?success=true";</script>'
    );
  } catch (error) {
    // Return error response
    return HtmlService.createHtmlOutput(
      '<script>window.top.location.href = "' +
        ScriptApp.getService().getUrl() +
        "?error=" +
        encodeURIComponent(error.toString()) +
        '";</script>'
    );
  }
}

// Handle GET requests (for redirects)
function doGet(e) {
  return HtmlService.createHtmlOutput(
    '<script>window.top.location.href = "' +
      ScriptApp.getService().getUrl() +
      '";</script>'
  );
}

// Handle OPTIONS request for CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type")
    .setHeader("Access-Control-Max-Age", "86400");
}
