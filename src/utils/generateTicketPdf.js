import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import qrcode from 'qrcode';
import fs from "fs";

const generateTicketPDF = async (eventDetails, qrCodeData) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 300]);
  const { width, height } = page.getSize();

  // const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const normalFont = await pdfDoc.embedFont(StandardFonts.Courier);
  const fontSize = 10;
  const titleSize = 15;


  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.9, 0.9, 0.9),
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    // width: width - 20,
    // height: height - 20,
    width,
    height,
    borderColor: rgb(0.5, 0, 1),
    borderWidth: 1.5,
    borderLineCap: "Round",
  });

  page.drawText(`TicketDorm Group Inc`, {
    x: 50,
    y: height - 50,
    size: 11.5,
    font: normalFont,
    color: rgb(0, 0, 0),
    opacity: 0.91,
  });
  page.drawText(`${eventDetails.event}`, {
    x: 50,
    y: height - 75,
    size: 15,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`${eventDetails.location}`, {
    x: 50,
    y: 190,
    size: fontSize,
    font: normalFont,
    color: rgb(0, 0, 0),
    opacity: 0.91,
  });
  page.drawText(`${eventDetails.date}(WAT)`, {
    x: 50,
    y: 170,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  // const infoStartY = height - titleSize - 160;
  // const infoLineHeight = 20;

  page.drawText(`ISSUED TO`, {
    x: 50,
    y: 120,
    size: titleSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(` ${eventDetails.buyer}`, {
    x: 45,
    y: 100,
    size: fontSize,
    font: normalFont,
    color: rgb(0, 0, 0),
    opacity: 0.91,
  });
  page.drawText(`TICKET`, {
    x: 180,
    y: 120,
    size: titleSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`${eventDetails.ticketType}`, {
    x: 180,
    y: 100,
    size: fontSize,
    font: normalFont,
    color: rgb(0, 0, 0),
    opacity: 0.91,
  });
  page.drawText(`ORDER NUMBER`, {
    x: 300,
    y: 120,
    size: titleSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`${eventDetails.orderNumber}`, {
    x: 300,
    y: 100,
    size: fontSize,
    font: normalFont,
    color: rgb(0, 0, 0),
    opacity: 0.91,
  });

  const qrCodeImage = await pdfDoc.embedPng(qrCodeData);
  page.drawImage(qrCodeImage, {
    x: width - 150,
    y: height - 150,
    width: 100,
    height: 100,
  });

  const pdfBytes = await pdfDoc.save();

  fs.writeFileSync("ticket.pdf", pdfBytes);

  return pdfBytes;
};

export default generateTicketPDF;
