// Shared PDF helper (session 23). The site has no build step and no PDF library, so invoices and
// profile printouts are written as plain text-only PDF 1.4 files (Helvetica) and saved with a Blob.
// Used by billing-modal.js (Download invoice) and profile-modal.js (Print profile).
// rows: [[text, fontSize, lineHeight], ...] - an empty text draws a blank line.
(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/\u20b1/g, 'PHP ').replace(/[\u2013\u2014]/g, '-').replace(/\u00b7/g, '-')
      .replace(/[^\x20-\x7e]/g, '').replace(/([\\()])/g, '\\$1');
  }
  function blob(rows) {
    var y = 780, stream = '';
    rows.forEach(function (r) {
      if (r[0]) stream += 'BT /F1 ' + (r[1] || 10) + ' Tf 40 ' + y + ' Td (' + esc(r[0]) + ') Tj ET\n';
      y -= (r[2] || 15);
    });
    var objs = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
      '<< /Length ' + stream.length + ' >>\nstream\n' + stream + 'endstream',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
    ];
    var pdf = '%PDF-1.4\n', offs = [];
    objs.forEach(function (o, i) { offs.push(pdf.length); pdf += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
    var xref = pdf.length;
    pdf += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n';
    offs.forEach(function (o) { pdf += ('0000000000' + o).slice(-10) + ' 00000 n \n'; });
    pdf += 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
    return new Blob([pdf], { type: 'application/pdf' });
  }
  function save(rows, filename) {
    var url = URL.createObjectURL(blob(rows));
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  window.HIS = window.HIS || {};
  HIS.pdf = { blob: blob, save: save };
})();