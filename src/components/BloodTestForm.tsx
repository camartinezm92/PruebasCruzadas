import React, { useState, useEffect } from 'react';
import { BloodTestRecord } from '../types';
import { Save, User, IdCard, Calendar, Droplets, ShieldCheck, UserCheck, FileText, Activity, AlertTriangle, MapPin, Hash, CheckCircle, XCircle } from 'lucide-react';

interface BloodTestFormProps {
  onSave: (record: BloodTestRecord) => void;
  userEmail?: string;
  existingRecords: BloodTestRecord[];
}

export const BloodTestForm: React.FC<BloodTestFormProps> = ({ onSave, userEmail, existingRecords }) => {
  const [formData, setFormData] = useState<Partial<BloodTestRecord>>({
    bloodGroup: 'O',
    rh: '+',
    testDate: new Date().toISOString().slice(0, 19), // YYYY-MM-DDTHH:mm:ss
    result: 'Compatible',
    patientName: '',
    patientId: '',
    eps: '',
    age: '',
    gender: 'M',
    zone: 'U',
    unitId: '',
    unitGroup: 'O',
    unitRh: '+',
    unitExpirationDate: '',
    irregularAntibodies: 'NEGATIVO',
    cellsI: 'NEGATIVO',
    cellsII: 'NEGATIVO',
    additionalInterpretation: '',
    bacteriologist: 'Dr. Luis Valeriano',
    registryNumber: '111',
  });

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{message: string, onConfirm: () => void} | null>(null);

  const generatePredefinedInterpretation = (data: Partial<BloodTestRecord>) => {
    const patientGroup = `${data.bloodGroup || ''} Rh${data.rh || ''}`;
    const unitGroup = `${data.unitGroup || ''} Rh${data.unitRh || ''}`;
    
    if (data.result === 'Compatible') {
      return `Se realizó prueba cruzada mayor manual entre el paciente ${data.patientName || '[Nombre]'} (Grupo ${patientGroup}) y la unidad ${data.unitId || '[Número]'} (Grupo ${unitGroup}). Tras las fases salina, albúmina y antiglobulina, no se observó aglutinación ni hemólisis. Resultado: Compatible para transfusión`;
    } else {
      return `Se realizó prueba cruzada mayor manual entre el paciente ${data.patientName || '[Nombre]'} (Grupo ${patientGroup}) y la unidad ${data.unitId || '[Número]'} (Grupo ${unitGroup}). Tras las fases salina, albúmina y antiglobulina, se observó aglutinación y/o hemólisis. Resultado: Incompatible para transfusión`;
    }
  };

  const proceedToSave = (finalPatientName: string) => {
    const newRecord: BloodTestRecord = {
      ...(formData as BloodTestRecord),
      patientName: finalPatientName,
      patientId: formData.patientId?.trim() || '',
      userEmail: userEmail || '',
      createdAt: new Date().toISOString(),
    };

    onSave(newRecord);
    // Reset form
    setFormData({
      bloodGroup: 'O',
      rh: '+',
      testDate: new Date().toISOString().slice(0, 19),
      result: 'Compatible',
      patientName: '',
      patientId: '',
      eps: '',
      age: '',
      gender: 'M',
      zone: 'U',
      unitId: '',
      unitGroup: 'O',
      unitRh: '+',
      unitExpirationDate: '',
      irregularAntibodies: 'NEGATIVO',
      cellsI: 'NEGATIVO',
      cellsII: 'NEGATIVO',
      additionalInterpretation: '',
      bacteriologist: 'Dr. Luis Valeriano',
      registryNumber: '111',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.patientId || !formData.testDate) {
      setAlertMessage('Por favor complete los campos obligatorios.');
      return;
    }

    const patientNameUpper = formData.patientName.toUpperCase().trim();
    const patientId = formData.patientId.trim();

    // Validate ID uniqueness / name match
    const existingPatient = existingRecords.find(r => r.patientId === patientId);
    if (existingPatient) {
      if (existingPatient.patientName.toUpperCase().trim() !== patientNameUpper) {
        setAlertMessage(`El ID ${patientId} ya está registrado con el nombre "${existingPatient.patientName}". Los nombres deben coincidir para el mismo ID.`);
        return;
      }
    }

    proceedToSave(patientNameUpper);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'patientName' ? value.toUpperCase() : name === 'patientId' ? value.trim() : value 
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-8">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
        <FileText className="text-red-600" size={24} />
        <h2 className="text-xl font-bold text-zinc-900">Nueva Prueba de Compatibilidad</h2>
      </div>

      {/* Patient Info Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <User size={16} /> Información del Paciente
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-medium text-zinc-700">Nombre del Paciente *</label>
            <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" placeholder="Nombre completo" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">CC / Identificación *</label>
            <input type="text" name="patientId" value={formData.patientId} onChange={handleChange} required className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" placeholder="ID" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">EPS</label>
            <input type="text" name="eps" value={formData.eps} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" placeholder="Ej: PARTICULAR" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">Edad</label>
            <input type="text" name="age" value={formData.age} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" placeholder="Ej: 68 A" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">Sexo</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm">
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">Zona</label>
            <select name="zone" value={formData.zone} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm">
              <option value="U">U (Urbana)</option>
              <option value="R">R (Rural)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test Details Section */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Activity size={16} /> Detalles del Examen
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">Fecha y Hora del Examen *</label>
            <input type="datetime-local" step="1" name="testDate" value={formData.testDate} onChange={handleChange} required className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">Resultado Final *</label>
            <select name="result" value={formData.result} onChange={handleChange} required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm font-bold ${formData.result === 'Compatible' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              <option value="Compatible">COMPATIBLE</option>
              <option value="Incompatible">INCOMPATIBLE</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
          {/* Patient Blood Group */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-700 uppercase">Grupo del Paciente</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600">Grupo</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm">
                  <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600">Rh</label>
                <select name="rh" value={formData.rh} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm">
                  <option value="+">POSITIVO (+)</option><option value="-">NEGATIVO (-)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Unit Blood Group */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-700 uppercase">Grupo de la Unidad</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600">Grupo</label>
                <select name="unitGroup" value={formData.unitGroup} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm">
                  <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600">Rh</label>
                <select name="unitRh" value={formData.unitRh} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm">
                  <option value="+">POSITIVO (+)</option><option value="-">NEGATIVO (-)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">Número de Unidad</label>
            <input type="text" name="unitId" value={formData.unitId} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm font-mono" placeholder="Ej: 2331044178" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">Fecha de Vencimiento Unidad</label>
            <input type="date" name="unitExpirationDate" value={formData.unitExpirationDate} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h4 className="text-xs font-bold text-zinc-700 uppercase">Rastreo de Anticuerpos Irregulares</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-600">General</label>
              <input type="text" name="irregularAntibodies" value={formData.irregularAntibodies} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" placeholder="NEGATIVO" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-600">Células I</label>
              <input type="text" name="cellsI" value={formData.cellsI} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" placeholder="NEGATIVO" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-600">Células II</label>
              <input type="text" name="cellsII" value={formData.cellsII} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" placeholder="NEGATIVO" />
            </div>
          </div>
        </div>
      </div>

      {/* Interpretation Section */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <FileText size={16} /> Interpretación
        </h3>
        
        <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm italic border border-blue-100">
          {generatePredefinedInterpretation(formData)}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-700">Interpretación Adicional (Opcional)</label>
          <textarea name="additionalInterpretation" value={formData.additionalInterpretation} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm resize-none" placeholder="Notas adicionales..." />
        </div>
      </div>

      {/* Professional Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-700">Bacteriólogo</label>
          <input type="text" name="bacteriologist" value={formData.bacteriologist} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm bg-zinc-50" readOnly />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-700">Registro</label>
          <input type="text" name="registryNumber" value={formData.registryNumber} onChange={handleChange} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm bg-zinc-50" readOnly />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-700">Usuario (Email)</label>
          <input type="text" value={userEmail || 'No disponible'} className="w-full px-3 py-2 border border-zinc-200 rounded-lg outline-none text-sm bg-zinc-50 text-zinc-500" readOnly />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-red-100 transition-all active:scale-95">
          <Save size={20} />
          Guardar Registro
        </button>
      </div>

      {/* Custom Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Atención</h3>
            <p className="text-zinc-600 mb-6">{alertMessage}</p>
            <button type="button" onClick={() => setAlertMessage(null)} className="w-full px-4 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold transition-colors">
              Entendido
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
