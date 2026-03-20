import jsPDF from 'jspdf';
import { BloodTestRecord } from '../types';
import { format } from 'date-fns';

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};

const getRhText = (rh: string) => {
  if (rh === '+') return 'POSITIVO';
  if (rh === '-') return 'NEGATIVO';
  return rh;
};

export const generatePDF = async (record: BloodTestRecord) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // Header
  try {
    const logoImg = await loadImage('/logo.png');
    const maxWidth = 35;
    const maxHeight = 18;
    const ratio = Math.min(maxWidth / logoImg.width, maxHeight / logoImg.height);
    const imgWidth = logoImg.width * ratio;
    const imgHeight = logoImg.height * ratio;
    doc.addImage(logoImg, 'PNG', margin, 10, imgWidth, imgHeight);
  } catch (e) {
    console.warn('Logo not found, skipping...');
  }

  doc.setTextColor(0, 0, 0);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Medicna Intensiva del Tolima - UCI Honda', pageWidth / 2, 14, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(' AV Centenario Calle 9 # 22A - 193 - Honda, Tolima Tel: (098) 2517771', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RESULTADO LABORATORIO', pageWidth / 2, 24, { align: 'center' });

  // Line separator
  doc.setLineWidth(0.5);
  doc.line(margin, 29, pageWidth - margin, 29);

  // Patient Info
  let yPos = 33;
  doc.setFontSize(9);
  
  doc.setFont('helvetica', 'bold');
  doc.text('CC', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.patientId || '', margin + 8, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('USUARIO:', margin + 40, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.patientName || '', margin + 60, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('EPS:', margin + 130, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.eps || '', margin + 140, yPos);

  yPos += 5;

  doc.setFont('helvetica', 'bold');
  doc.text('Edad:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.age || '', margin + 10, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Sexo:', margin + 25, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.gender || '', margin + 35, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Zona:', margin + 45, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.zone || '', margin + 55, yPos);

  yPos += 3;
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // OTROS Section
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('OTROS', margin, yPos);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Fecha examen:', margin + 115, yPos);
  doc.text(format(new Date(record.testDate), 'dd/MM/yyyy HH:mm'), margin + 140, yPos);

  yPos += 2;
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // Examen Details
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Examen :', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text('PRUEBAS DE COMPATIBILIDAD', margin + 25, yPos);

  yPos += 8;
  const col1 = margin + 25;
  const col2 = margin + 65;
  const col3 = margin + 105;

  doc.setFont('helvetica', 'normal');
  doc.text('NUMERO DE UNIDAD', col1, yPos);
  doc.text('GRUPO DE UNIDAD', col2, yPos);
  doc.text('FECHA DE VENCIMIENTO', col3, yPos);

  yPos += 4;
  doc.text(record.unitId || record.hemoderivativeUnit || '', col1, yPos);
  doc.text(`${record.unitGroup || ''} ${getRhText(record.unitRh || '')}`, col2, yPos);
  doc.text(record.unitExpirationDate || '', col3, yPos);

  yPos += 8;
  doc.text('GRUPO DE PACIENTE', col1, yPos);
  yPos += 4;
  doc.text(`${record.bloodGroup || ''} ${getRhText(record.rh || '')}`, col1, yPos);

  yPos += 8;
  doc.text('RASTREO DE ANTICUERPOS IRREGULARES', col1, yPos);
  yPos += 4;
  doc.text(`CELULAS I: ${record.cellsI || 'NEGATIVO'}`, col1, yPos);
  yPos += 4;
  doc.text(`CELULAS II: ${record.cellsII || 'NEGATIVO'}`, col1, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text(`RESULTADO: ${record.result.toUpperCase()}`, col1, yPos);
  
  // Interpretation
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  const patientGroup = `${record.bloodGroup || ''} Rh${record.rh || ''}`;
  const unitGroup = `${record.unitGroup || ''} Rh${record.unitRh || ''}`;
  let predefinedText = '';
  if (record.result === 'Compatible') {
    predefinedText = `Se realizó prueba cruzada mayor manual entre el paciente ${record.patientName || '[Nombre]'} (Grupo ${patientGroup}) y la unidad ${record.unitId || '[Número]'} (Grupo ${unitGroup}). Tras las fases salina, albúmina y antiglobulina, no se observó aglutinación ni hemólisis. Resultado: Compatible para transfusión.`;
  } else {
    predefinedText = `Se realizó prueba cruzada mayor manual entre el paciente ${record.patientName || '[Nombre]'} (Grupo ${patientGroup}) y la unidad ${record.unitId || '[Número]'} (Grupo ${unitGroup}). Tras las fases salina, albúmina y antiglobulina, se observó aglutinación y/o hemólisis. Resultado: Incompatible para transfusión.`;
  }

  const splitPredefined = doc.splitTextToSize(predefinedText, pageWidth - col1 - margin);
  doc.text(splitPredefined, col1, yPos);
  yPos += (splitPredefined.length * 4) + 2;

  if (record.additionalInterpretation) {
    doc.setFont('helvetica', 'bold');
    doc.text('Interpretación Adicional:', col1, yPos);
    yPos += 4;
    doc.setFont('helvetica', 'normal');
    const splitAdditional = doc.splitTextToSize(record.additionalInterpretation, pageWidth - col1 - margin);
    doc.text(splitAdditional, col1, yPos);
    yPos += (splitAdditional.length * 4) + 2;
  }

  // Signature
  yPos += 15;
  let signatureHeight = 15;
  try {
    const firmaImg = await loadImage('/firma.png');
    const imgWidth = 40;
    signatureHeight = (firmaImg.height * imgWidth) / firmaImg.width;
    if (signatureHeight > 25) signatureHeight = 25;
    doc.addImage(firmaImg, 'PNG', col1, yPos - signatureHeight + 2, imgWidth, signatureHeight);
  } catch (e) {
    console.warn('Firma not found, skipping...');
  }
  
  doc.line(col1 - 10, yPos + 2, col1 + 60, yPos + 2); // Signature line

  yPos += 8;
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // Footer / Professional Info
  yPos += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Bacteriologo:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.bacteriologist || 'Dr. Luis Valeriano', margin + 25, yPos);

  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Registro:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.registryNumber || '111', margin + 25, yPos);

  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Usuario:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.userEmail?.split('@')[0].toUpperCase() || 'SISTEMA', margin + 15, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Impreso el:', margin + 80, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(format(new Date(), 'dd/MM/yyyy HH:mm'), margin + 100, yPos);

  doc.text('Página 1 de 1', pageWidth - margin - 20, yPos);

  doc.save(`PrueCru-${record.patientId || 'SIN_ID'}-${(record.patientName || 'SIN_NOMBRE').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').replace(/[^\w\-]/g, '')}-${format(new Date(record.testDate), 'yyMMdd')}.pdf`);
};
