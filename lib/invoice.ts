import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type InvoiceItem = {
  title: string;
  price: number;
  quantity: number;
};

export const generateInvoicePDF = ({
  orderId,
  items,
  totalAmount,
  userId,
}: {
  orderId: string;
  items: InvoiceItem[];
  totalAmount: number;
  userId: string;
}) => {
  const doc = new jsPDF("p", "mm", "a4");

  /* ================= HEADER ================= */
  doc.setFontSize(20);
  doc.text("INVOICE", 14, 20);

  doc.setFontSize(11);
  doc.text(`Order ID: ${orderId}`, 14, 32);
  doc.text(`User ID: ${userId}`, 14, 38);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 44);

  /* ================= TABLE ================= */
  autoTable(doc, {
    startY: 55,
    head: [["Item", "Price (INR)", "Qty", "Line Total (INR)"]],
    body: items.map((item) => [
      item.title,
      item.price.toFixed(2),
      item.quantity,
      (item.price * item.quantity).toFixed(2),
    ]),
    styles: {
      fontSize: 11,
      halign: "right",
    },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "right" },
      2: { halign: "center" },
      3: { halign: "right" },
    },
    headStyles: {
      fillColor: [20, 184, 166],
      textColor: 255,
      halign: "center",
    },
  });

  /* ================= TOTAL BOX ================= */
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setDrawColor(20, 184, 166);
  doc.setLineWidth(0.5);
  doc.rect(120, finalY, 70, 12);

  doc.setFontSize(12);
  doc.text("Grand Total (INR)", 124, finalY + 8);
  doc.text(
    totalAmount.toFixed(2),
    185,
    finalY + 8,
    { align: "right" }
  );

  /* ================= FOOTER ================= */
  doc.setFontSize(10);
  doc.text(
    "Thank you for your purchase!",
    14,
    finalY + 30
  );

  /* ================= SAVE ================= */
  doc.save(`invoice-${orderId}.pdf`);
};
