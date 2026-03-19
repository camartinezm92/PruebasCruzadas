import React, { useState } from 'react';
import { BloodTestRecord } from '../types';
import { Save, User, IdCard, Calendar, Droplets, ShieldCheck, UserCheck, FileText, Activity, AlertTriangle } from 'lucide-react';

interface BloodTestFormProps {
  onSave: (record: BloodTestRecord) => void;
  existingSeals: string[];
}

export const BloodTestForm: React.FC<BloodTestFormProps> = ({ onSave, existingSeals }) => {
  const [formData, setFormData] = useState<Partial<BloodTestRecord>>({
    bloodGroup: 'O',
    rh: '+',
    testDate: new Date().toISOString().split('T')[0],
    result: 'Compatible',
    qualitySeal: '',
    responsiblePerson: '',
    patientName: '',
    patientId: '',
    unitId: '',
    hemoderivativeUnit: '',
    unitGroup: 'O',
    unitRh: '+',
    observations: '',
  });

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{message: string, onConfirm: () => void} | null>(null);

  const proceedToSave = () => {
    const newRecord: BloodTestRecord = {
      ...(formData as BloodTestRecord),
      createdAt: new Date().toISOString(),
    };

    onSave(newRecord);
    // Reset form
    setFormData({
      bloodGroup: 'O',
      rh: '+',
      testDate: new Date().toISOString().split('T')[0],
      result: 'Compatible',
      qualitySeal: '',
      responsiblePerson: '',
      patientName: '',
      patientId: '',
      unitId: '',
      hemoderivativeUnit: '',
      unitGroup: 'O',
      unitRh: '+',
      observations: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.patientId || !formData.responsiblePerson) {
      setAlertMessage('Por favor complete los campos obligatorios.');
      return;
    }

    if (formData.qualitySeal && existingSeals.includes(formData.qualitySeal.trim().toLowerCase())) {
      setConfirmState({
        message: 'El Sello de Calidad ingresado ya existe en otro registro. ¿Desea guardarlo de todos modos?',
        onConfirm: () => {
          setConfirmState(null);
          proceedToSave();
        }
      });
      return;
    }

    proceedToSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
        <FileText className="text-red-600" size={24} />
        <h2 className="text-xl font-bold text-zinc-900">Nueva Prueba Cruzada</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Información del Paciente</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
              <User size={16} /> Nombre del Paciente *
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
              placeholder="Nombre completo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
              <IdCard size={16} /> Número de Identificación *
            </label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
              placeholder="ID / Cédula"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                <Droplets size={16} /> Grupo Sanguíneo
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 transition-all outline-none"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                Rh
              </label>
              <select
                name="rh"
                value={formData.rh}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 transition-all outline-none"
              >
                <option value="+">+</option>
                <option value="-">-</option>
              </select>
            </div>
          </div>
        </div>

        {/* Test Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Detalles de la Prueba</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
              <Calendar size={16} /> Fecha de Pruebas Cruzadas *
            </label>
            <input
              type="date"
              name="testDate"
              value={formData.testDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
              <FileText size={16} /> Resultado de la Prueba *
            </label>
            <select
              name="result"
              value={formData.result}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 transition-all outline-none font-semibold ${
                formData.result === 'Compatible' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              <option value="Compatible">Compatible</option>
              <option value="Incompatible">Incompatible</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
              <ShieldCheck size={16} /> Sello de Calidad *
            </label>
            <input
              type="text"
              name="qualitySeal"
              value={formData.qualitySeal}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 transition-all outline-none"
              placeholder="Código o descripción"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
              <UserCheck size={16} /> Responsable de la Actividad *
            </label>
            <input
              type="text"
              name="responsiblePerson"
              value={formData.responsiblePerson}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 transition-all outline-none"
              placeholder="Nombre del profesional"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
              <Activity size={16} /> Unidad de Hemoderivado
            </label>
            <input
              type="text"
              name="hemoderivativeUnit"
              value={formData.hemoderivativeUnit}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 transition-all outline-none"
              placeholder="Ej: Concentrado de glóbulos rojos"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Observaciones</label>
            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 transition-all outline-none resize-none"
              placeholder="Notas adicionales..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-red-100 transition-all active:scale-95"
        >
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
            <button 
              type="button"
              onClick={() => setAlertMessage(null)} 
              className="w-full px-4 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmState && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2 text-center">Confirmación Requerida</h3>
            <p className="text-zinc-600 mb-6 text-center">{confirmState.message}</p>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setConfirmState(null)} 
                className="flex-1 px-4 py-3 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl font-bold transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={confirmState.onConfirm} 
                className="flex-1 px-4 py-3 bg-amber-500 text-white hover:bg-amber-600 rounded-xl font-bold transition-colors"
              >
                Sí, guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
