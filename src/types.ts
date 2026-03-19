export interface BloodTestRecord {
  id?: string;
  patientName: string;
  patientId: string;
  eps?: string;
  age?: string;
  gender?: string;
  zone?: string;
  affiliationNo?: string;
  authorizationNo?: string;
  admissionNo?: string;
  
  bloodGroup: 'A' | 'B' | 'AB' | 'O' | '';
  rh: '+' | '-' | '';
  testDate: string;
  result: 'Compatible' | 'Incompatible' | '';
  
  unitId?: string;
  unitGroup?: 'A' | 'B' | 'AB' | 'O' | '';
  unitRh?: '+' | '-' | '';
  unitExpirationDate?: string;
  
  irregularAntibodies?: string;
  cellsI?: string;
  cellsII?: string;
  
  additionalInterpretation?: string;
  bacteriologist?: string;
  registryNumber?: string;
  userEmail?: string;
  
  // Legacy fields
  qualitySeal?: string;
  responsiblePerson?: string;
  hemoderivativeUnit?: string;
  observations?: string;
  
  createdAt: string;
  uid?: string;
}
