import jsPDF from 'jspdf';
import { BloodTestRecord } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};

export const generatePDF = async (record: BloodTestRecord) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Try to load logo
  try {
    const logoImg = await loadImage('/logo.png');
    const maxWidth = 40;
    const maxHeight = 20;
    const ratio = Math.min(maxWidth / logoImg.width, maxHeight / logoImg.height);
    const imgWidth = logoImg.width * ratio;
    const imgHeight = logoImg.height * ratio;
    doc.addImage(logoImg, 'PNG', margin, 10, imgWidth, imgHeight);
  } catch (e) {
    console.warn('Logo not found, skipping...');
  }

  // Header
  doc.setFontSize(22);
  doc.setTextColor(220, 38, 38); // Red-600
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE DE PRUEBAS CRUZADAS', pageWidth / 2, 35, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(113, 113, 122); // Zinc-500
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha de emisión: ${format(new Date(), 'PPP', { locale: es })}`, pageWidth - margin, 45, { align: 'right' });

  // Patient Info Section
  let yPos = 55;
  doc.setFillColor(244, 244, 245); // Zinc-100
  doc.rect(margin, yPos, pageWidth - (margin * 2), 8, 'F');
  doc.setFontSize(12);
  doc.setTextColor(24, 24, 27); // Zinc-900
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN DEL PACIENTE', margin + 2, yPos + 6);
  
  yPos += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre:`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(record.patientName, margin + 20, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Identificación:`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(record.patientId, margin + 30, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Grupo Sanguíneo:`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text(`${record.bloodGroup} ${record.rh}`, margin + 35, yPos);

  // Test Details Section
  yPos += 15;
  doc.setFillColor(244, 244, 245);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 8, 'F');
  doc.setFontSize(12);
  doc.setTextColor(24, 24, 27);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLES DE LA PRUEBA', margin + 2, yPos + 6);

  yPos += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha de prueba:`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(format(new Date(record.testDate), 'PPP', { locale: es }), margin + 35, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Unidad de Hemoderivado:`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(record.hemoderivativeUnit || 'N/A', margin + 45, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Sello de Calidad:`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(record.qualitySeal, margin + 35, yPos);

  yPos += 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`RESULTADO:`, margin, yPos);
  
  if (record.result === 'Compatible') {
    doc.setTextColor(21, 128, 61); // Green-700
  } else {
    doc.setTextColor(220, 38, 38); // Red-600
  }
  doc.text(record.result.toUpperCase(), margin + 35, yPos);

  // Responsible Section
  yPos += 20;
  doc.setFillColor(244, 244, 245);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 8, 'F');
  doc.setFontSize(12);
  doc.setTextColor(24, 24, 27);
  doc.setFont('helvetica', 'bold');
  doc.text('RESPONSABLE', margin + 2, yPos + 6);

  yPos += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Profesional a cargo:`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(record.responsiblePerson, margin + 35, yPos);

  yPos += 15;
  doc.setFont('helvetica', 'normal');
  doc.text('Firma:', margin, yPos);
  
  // Try to load static signature
  let signatureHeight = 15;
  try {
    const firmaImg = await loadImage('/firma.png');
    const imgWidth = 40; // Reduced width
    signatureHeight = (firmaImg.height * imgWidth) / firmaImg.width;
    if (signatureHeight > 25) signatureHeight = 25; // Cap height to prevent pushing content down too much
    doc.addImage(firmaImg, 'PNG', margin, yPos + 2, imgWidth, signatureHeight);
  } catch (e) {
    console.warn('Firma not found, skipping...');
    doc.setTextColor(161, 161, 170); // Zinc-400
    doc.setFont('helvetica', 'italic');
    doc.text('(Firma digital no disponible)', margin, yPos + 15);
  }

  // --- DIGITAL LABEL (RÓTULO) ---
  yPos += signatureHeight + 12; // Reduced spacing
  
  doc.setFontSize(9);
  doc.setTextColor(113, 113, 122);
  doc.setFont('helvetica', 'italic');
  doc.text('✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', pageWidth / 2, yPos - 4, { align: 'center' });
  
  const labelWidth = 120; // Made smaller (was 140)
  const startX = (pageWidth - labelWidth) / 2; // Centered
  const rowH = 5.5; // Smaller row height (was 6.5)
  const logoBoxW = 25;
  const headerTextW = labelWidth - logoBoxW;
  const col1W = 55;
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);
  doc.setTextColor(0, 0, 0);
  
  // Header Box
  doc.rect(startX, yPos, labelWidth, rowH * 3);
  // Logo Box
  doc.rect(startX, yPos, logoBoxW, rowH * 3);
  
  // Draw Logo in Label
  try {
    const logoImg = await loadImage('/logo.png');
    const maxWidth = logoBoxW - 4;
    const maxHeight = rowH * 3 - 4;
    const ratio = Math.min(maxWidth / logoImg.width, maxHeight / logoImg.height);
    const imgWidth = logoImg.width * ratio;
    const imgHeight = logoImg.height * ratio;
    doc.addImage(logoImg, 'PNG', startX + 2 + (maxWidth - imgWidth)/2, yPos + 2 + (maxHeight - imgHeight)/2, imgWidth, imgHeight);
  } catch (e) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('UCI\nHONDA', startX + logoBoxW/2, yPos + 8, { align: 'center' });
  }

  // Header Rows
  doc.line(startX + logoBoxW, yPos + rowH, startX + labelWidth, yPos + rowH);
  doc.line(startX + logoBoxW, yPos + rowH * 2, startX + labelWidth, yPos + rowH * 2);
  
  // Header Text
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICINA INTENSIVA DEL TOLIMA S.A', startX + logoBoxW + (headerTextW/2), yPos + 3.5, { align: 'center' });
  
  // Split Row 2
  const splitX = startX + logoBoxW + (headerTextW * 0.55);
  doc.line(splitX, yPos + rowH, splitX, yPos + rowH * 2);
  doc.setFontSize(7);
  doc.text('GESTION PRE TRANSFUSIONAL', startX + logoBoxW + ((splitX - (startX + logoBoxW))/2), yPos + rowH + 3.5, { align: 'center' });
  
  const codeLabelW = 15;
  doc.line(splitX + codeLabelW, yPos + rowH, splitX + codeLabelW, yPos + rowH * 2);
  doc.setFontSize(6);
  doc.text('CÓDIGO:', splitX + (codeLabelW/2), yPos + rowH + 3.5, { align: 'center' });
  doc.setFontSize(7);
  doc.text('ADT-GPT-FOR-011', splitX + codeLabelW + ((startX + labelWidth - (splitX + codeLabelW))/2), yPos + rowH + 3.5, { align: 'center' });
  
  // Row 3 Text
  doc.setFontSize(8);
  doc.text('ROTULO DE PRUEBA DE COMPATIBILIDAD', startX + logoBoxW + (headerTextW/2), yPos + rowH * 2 + 3.5, { align: 'center' });
  
  // Data Rows
  const dataStartY = yPos + rowH * 3;
  
  const formatLabelDate = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };
  
  const rows = [
    { label: 'Nombre del Paciente', value: record.patientName.toUpperCase() },
    { label: 'Numero de Identificación', value: record.patientId },
    { label: 'Grupo Sanguíneo y Rh Paciente', value: `${record.bloodGroup} ${record.rh}`, isLarge: true },
    { label: 'Fecha de Pruebas Cruzadas', value: formatLabelDate(record.testDate) },
    { label: 'Resultado', value: record.result.toUpperCase() },
    { label: 'Sello de Calidad', value: record.qualitySeal },
    { label: 'RESPONSABLE', value: record.responsiblePerson.toUpperCase(), isBoldLabel: true }
  ];
  
  rows.forEach((r, i) => {
    const currentY = dataStartY + (i * rowH);
    doc.rect(startX, currentY, labelWidth, rowH);
    doc.line(startX + col1W, currentY, startX + col1W, currentY + rowH);
    
    // Label
    doc.setFontSize(7);
    if (r.isBoldLabel) {
      doc.setFont('helvetica', 'bolditalic');
    } else {
      doc.setFont('helvetica', 'italic');
    }
    doc.text(r.label, startX + 2, currentY + 3.5);
    
    // Value
    if (r.isLarge) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
    }
    doc.text(r.value, startX + col1W + 2, currentY + 3.5);
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(161, 161, 170);
  doc.setFont('helvetica', 'normal');
  doc.text('Este documento es un reporte oficial de pruebas cruzadas generado por Pruebas Cruzadas UCI Honda.', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Prueba_Cruzada_${record.patientId}_${format(new Date(record.testDate), 'yyyyMMdd')}.pdf`);
};
