import React from 'react';
import { BloodTestRecord } from '../types';

interface LabelPreviewProps {
  record: BloodTestRecord;
}

export const LabelPreview: React.FC<LabelPreviewProps> = ({ record }) => {
  // Format the date to DD/MM/YYYY if it's in YYYY-MM-DD
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  return (
    <div className="mt-8 mb-4">
      <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        Vista Previa del Rótulo Físico
      </h4>
      
      {/* Label Container */}
      <div className="border border-black bg-white max-w-3xl mx-auto font-sans text-black shadow-sm overflow-hidden" style={{ width: '100%', maxWidth: '800px' }}>
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="flex border-b border-black">
            {/* Logo Area */}
            <div className="w-1/4 border-r border-black flex items-center justify-center p-2 bg-white">
              <img 
                src="/logo.png" 
                alt="UCI HONDA" 
                className="max-h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="font-bold text-xl text-center">UCI<br/>HONDA</div>';
                }}
              />
            </div>
            
            {/* Header Text Area */}
            <div className="w-3/4 flex flex-col">
              <div className="border-b border-black text-center font-bold py-1.5 text-sm sm:text-base uppercase tracking-wide">
                MEDICINA INTENSIVA DEL TOLIMA S.A
              </div>
              <div className="flex border-b border-black text-xs sm:text-sm font-bold">
                <div className="w-1/2 border-r border-black flex items-center justify-center p-1.5 text-center uppercase">
                  GESTION PRE TRANSFUSIONAL
                </div>
                <div className="w-1/2 flex">
                  <div className="w-1/3 border-r border-black flex items-center justify-center p-1.5 uppercase">
                    CÓDIGO:
                  </div>
                  <div className="w-2/3 flex items-center justify-center p-1.5 uppercase">
                    ADT-GPT-FOR-011
                  </div>
                </div>
              </div>
              <div className="text-center font-bold py-1.5 text-sm sm:text-base uppercase tracking-wide">
                ROTULO DE PRUEBA DE COMPATIBILIDAD
              </div>
            </div>
          </div>

          {/* Data Rows */}
          <div className="flex flex-col text-sm sm:text-base">
            <div className="flex border-b border-black">
              <div className="w-1/2 border-r border-black p-1.5 pl-3 font-medium italic">Nombre del Paciente</div>
              <div className="w-1/2 p-1.5 pl-3 font-semibold uppercase">{record.patientName}</div>
            </div>
            
            <div className="flex border-b border-black">
              <div className="w-1/2 border-r border-black p-1.5 pl-3 font-medium italic">Numero de Identificación</div>
              <div className="w-1/2 p-1.5 pl-3 font-semibold">{record.patientId}</div>
            </div>
            
            <div className="flex border-b border-black">
              <div className="w-1/2 border-r border-black p-1.5 pl-3 font-medium italic">Grupo Sanguíneo y Rh Paciente</div>
              <div className="w-1/2 p-1.5 pl-3 font-bold text-lg">{record.bloodGroup} {record.rh}</div>
            </div>
            
            <div className="flex border-b border-black">
              <div className="w-1/2 border-r border-black p-1.5 pl-3 font-medium italic">Fecha de Pruebas Cruzadas</div>
              <div className="w-1/2 p-1.5 pl-3 font-semibold">{formatDate(record.testDate)}</div>
            </div>
            
            <div className="flex border-b border-black">
              <div className="w-1/2 border-r border-black p-1.5 pl-3 font-medium italic">Resultado</div>
              <div className="w-1/2 p-1.5 pl-3 font-bold uppercase">{record.result}</div>
            </div>
            
            <div className="flex border-b border-black">
              <div className="w-1/2 border-r border-black p-1.5 pl-3 font-medium italic">Sello de Calidad</div>
              <div className="w-1/2 p-1.5 pl-3 font-semibold">{record.qualitySeal}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/2 border-r border-black p-1.5 pl-3 font-bold italic uppercase">RESPONSABLE</div>
              <div className="w-1/2 p-1.5 pl-3 font-semibold uppercase">{record.responsiblePerson}</div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-zinc-400 mt-2 text-center">
        Esta es una representación digital del rótulo físico (ADT-GPT-FOR-011).
      </p>
    </div>
  );
};
