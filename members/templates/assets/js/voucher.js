const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChars(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

function generateCode(format) {
  return format.map(part =>
    typeof part === "number" ? randomChars(part) : part
  ).join("");
}


document.addEventListener("DOMContentLoaded", () => {
  const securityCode = generateCode([10]);
  const voucherCode = generateCode(["VS-", 4, "-", 4, "-", 4, "-", 4]);

  document.getElementById("securityCode").textContent = securityCode;
  document.getElementById("voucherCode").textContent = voucherCode;

  const qrData = JSON.stringify({
    voucher: voucherCode,
    security: securityCode
  });

  new QRCode(document.getElementById("qrcode"), {
    text: qrData,
    width: 140,
    height: 140
  });
});
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  
  // Gradient-like background effect (using rectangles)
  pdf.setFillColor(35, 61, 0);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Decorative top border
  pdf.setFillColor(200, 100, 50);
  pdf.rect(0, 0, pageWidth, 8, 'F');
  
  // Decorative bottom border
  pdf.setFillColor(200, 100, 50);
  pdf.rect(0, pageHeight - 8, pageWidth, 8, 'F');
  
  let y = 35;
  
  // Main decorative frame
  pdf.setDrawColor(200, 100, 50);
  pdf.setLineWidth(0.8);
  pdf.roundedRect(margin, 15, contentWidth, pageHeight - 30, 3, 3);
  
  // Inner decorative frame
  pdf.setDrawColor(220, 150, 100);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(margin + 5, 20, contentWidth - 10, pageHeight - 40, 2, 2);
  
  // Title with decorative elements
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.setTextColor(200, 100, 50);
  pdf.text("Voucher na Masaź", pageWidth / 2, y, { align: "center" });
  
  y += 10;
  pdf.setFontSize(18);
  pdf.text("dla dwojga", pageWidth / 2, y, { align: "center" });
  
  // Decorative line under title
  y += 8;
  pdf.setDrawColor(200, 100, 50);
  pdf.setLineWidth(0.5);
  const lineLength = 60;
  pdf.line(pageWidth / 2 - lineLength / 2, y, pageWidth / 2 + lineLength / 2, y);
  
  // Small decorative circles
  pdf.setFillColor(200, 100, 50);
  pdf.circle(pageWidth / 2 - lineLength / 2, y, 1.5, 'F');
  pdf.circle(pageWidth / 2 + lineLength / 2, y, 1.5, 'F');
  
  y += 15;
  
  // Description box
  pdf.setDrawColor(220, 180, 150);
  pdf.setFillColor(255, 250, 245);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(margin + 15, y, contentWidth - 30, 20, 2, 2, 'FD');
  
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text("Masaź dla dwóch osób", pageWidth / 2, y + 8, { align: "center" });
  pdf.text("w tym samym czasie i pokoju", pageWidth / 2, y + 14, { align: "center" });
  
  y += 35;
  
  // Security code section
  const securityCode = document.getElementById("securityCode").textContent;
  const voucherCode = document.getElementById("voucherCode").textContent;
  
  pdf.setDrawColor(200, 150, 100);
  pdf.setFillColor(255, 248, 240);
  pdf.roundedRect(margin + 20, y, contentWidth - 40, 25, 2, 2, 'FD');
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(100, 100, 100);
  pdf.text("Kod zabezpieczający:", pageWidth / 2, y + 8, { align: "center" });
  
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(200, 100, 50);
  pdf.text(securityCode, pageWidth / 2, y + 15, { align: "center" });
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(120, 120, 120);
  pdf.text("Kod vouchera:", pageWidth / 2, y + 20, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(200, 100, 50);
  pdf.text(voucherCode, pageWidth / 2, y + 30, { align: "center" });
  
  y += 40;
  
  // QR Code section
  const qrCanvas = document.querySelector("#qrcode canvas");
  if (qrCanvas) {
    const imgData = qrCanvas.toDataURL("image/png");
    const qrSize = 55;
    
    // QR code background
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(pageWidth / 2 - qrSize / 2 - 3, y - 3, qrSize + 6, qrSize + 6, 2, 2, 'F');
    
    pdf.addImage(imgData, "PNG", pageWidth / 2 - qrSize / 2, y, qrSize, qrSize);
    y += qrSize + 5;
  }
  
  y += 15;
  
  // Price section with decorative box
  pdf.setDrawColor(200, 100, 50);
  pdf.setFillColor(255, 245, 235);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(margin + 25, y, contentWidth - 50, 28, 2, 2, 'FD');
  
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(200, 100, 50);
  pdf.text("Cena: 150 zł", pageWidth / 2, y + 10, { align: "center" });
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(50, 150, 50);
  pdf.text("Zniżka: 21,51 zł", pageWidth / 2, y + 20, { align: "center" });
  
  y += 40;
  
  // Footer decorative line
  pdf.setDrawColor(220, 180, 150);
  pdf.setLineWidth(0.3);
  pdf.line(margin + 30, y, pageWidth - margin - 30, y);
  
  // Footer text
  y += 8;
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);
  pdf.text("Voucher ważny przez 4 miesięcy od daty zakupu", pageWidth / 2, y, { align: "center" });
  
  // Corner decorations
  const cornerSize = 10;
  pdf.setDrawColor(200, 100, 50);
  pdf.setLineWidth(1);
  
  // Top left corner
  pdf.line(margin, 15 + cornerSize, margin, 15);
  pdf.line(margin, 15, margin + cornerSize, 15);
  
  // Top right corner
  pdf.line(pageWidth - margin - cornerSize, 15, pageWidth - margin, 15);
  pdf.line(pageWidth - margin, 15, pageWidth - margin, 15 + cornerSize);
  
  // Bottom left corner
  pdf.line(margin, pageHeight - 15 - cornerSize, margin, pageHeight - 15);
  pdf.line(margin, pageHeight - 15, margin + cornerSize, pageHeight - 15);
  
  // Bottom right corner
  pdf.line(pageWidth - margin - cornerSize, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  pdf.line(pageWidth - margin, pageHeight - 15, pageWidth - margin, pageHeight - 15 - cornerSize);
  
  pdf.save(`voucher_${voucherCode}.pdf`);
}