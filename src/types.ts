export interface BloodTestRecord {
  id?: string;
  patientName: string;
  patientId: string;
  bloodGroup: 'A' | 'B' | 'AB' | 'O';
  rh: '+' | '-';
  testDate: string;
  result: 'Compatible' | 'Incompatible' | '';
  qualitySeal: string;
  responsiblePerson: string;
  createdAt: string;
  unitId?: string; // ID of the blood unit
  hemoderivativeUnit?: string; // Unidad de Hemoderivado
  unitGroup?: 'A' | 'B' | 'AB' | 'O';
  unitRh?: '+' | '-';
  observations?: string;
}
