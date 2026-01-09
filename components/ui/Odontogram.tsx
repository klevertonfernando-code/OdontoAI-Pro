import React, { useState } from 'react';
import { Tooth, ToothStatus, ToothFaces } from '../../types';

interface OdontogramProps {
  value?: Tooth[];
  onChange?: (teeth: Tooth[]) => void;
  readOnly?: boolean;
}

const TEETH_NUMBERS = [
  // Upper Right (18-11)
  18, 17, 16, 15, 14, 13, 12, 11,
  // Upper Left (21-28)
  21, 22, 23, 24, 25, 26, 27, 28,
  // Lower Right (48-41)
  48, 47, 46, 45, 44, 43, 42, 41,
  // Lower Left (31-38)
  31, 32, 33, 34, 35, 36, 37, 38
];

const DEFAULT_FACES: ToothFaces = {
    occlusal: 'healthy',
    vestibular: 'healthy',
    lingual: 'healthy',
    mesial: 'healthy',
    distal: 'healthy'
};

export const Odontogram: React.FC<OdontogramProps> = ({ value = [], onChange, readOnly = false }) => {
  const [selectedToothId, setSelectedToothId] = useState<number | null>(null);
  const [selectedFace, setSelectedFace] = useState<keyof ToothFaces | 'whole' | null>(null);
  
  const getToothData = (id: number): Tooth => {
    return value.find(t => t.id === id) || { id, faces: { ...DEFAULT_FACES }, generalStatus: 'healthy' };
  };

  const updateTooth = (id: number, face: keyof ToothFaces | 'whole', status: ToothStatus) => {
    if (readOnly || !onChange) return;

    let newTeeth = [...value];
    const existingIndex = newTeeth.findIndex(t => t.id === id);
    let toothData = existingIndex >= 0 ? { ...newTeeth[existingIndex] } : { id, faces: { ...DEFAULT_FACES }, generalStatus: 'healthy' as ToothStatus };

    if (face === 'whole') {
        // If status implies the whole tooth (missing/implant), override everything
        toothData.generalStatus = status;
        if (status === 'missing' || status === 'implant') {
             toothData.faces = { occlusal: status, vestibular: status, lingual: status, mesial: status, distal: status };
        }
    } else {
        // Update specific face
        toothData.faces = { ...toothData.faces, [face]: status };
        // If updating a face, ensure general status isn't 'missing' anymore unless explicitly set back
        if (toothData.generalStatus === 'missing') toothData.generalStatus = 'healthy';
    }

    if (existingIndex >= 0) {
        newTeeth[existingIndex] = toothData;
    } else {
        newTeeth.push(toothData);
    }
    onChange(newTeeth);
    setSelectedToothId(null);
    setSelectedFace(null);
  };

  return (
    <div className="relative p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      
      {/* Dental Arch Container */}
      <div className="flex flex-col gap-12 items-center justify-center relative py-6">
         {/* Upper Arch */}
         <div className="flex gap-2 justify-center flex-wrap max-w-4xl">
            {TEETH_NUMBERS.slice(0, 16).map((id) => (
                <ComplexTooth 
                    key={id} 
                    id={id} 
                    data={getToothData(id)} 
                    onFaceClick={(face) => { setSelectedToothId(id); setSelectedFace(face); }}
                />
            ))}
         </div>

         {/* Lower Arch */}
         <div className="flex gap-2 justify-center flex-wrap max-w-4xl">
            {TEETH_NUMBERS.slice(16, 32).map((id) => (
                <ComplexTooth 
                    key={id} 
                    id={id} 
                    data={getToothData(id)} 
                    onFaceClick={(face) => { setSelectedToothId(id); setSelectedFace(face); }}
                />
            ))}
         </div>
      </div>

      {/* Action Modal */}
      {selectedToothId && selectedFace && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-xl animate-fadeIn">
              <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-200 w-64">
                  <h4 className="font-bold text-gray-800 mb-2">
                      Dente {selectedToothId} - {selectedFace === 'whole' ? 'Geral' : getFaceName(selectedFace)}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                      <ActionBtn status="healthy" label="Saudável" onClick={() => updateTooth(selectedToothId, selectedFace, 'healthy')} />
                      <ActionBtn status="caries" label="Cárie" onClick={() => updateTooth(selectedToothId, selectedFace, 'caries')} />
                      <ActionBtn status="restoration" label="Restaurado" onClick={() => updateTooth(selectedToothId, selectedFace, 'restoration')} />
                      <ActionBtn status="endo" label="Canal" onClick={() => updateTooth(selectedToothId, selectedFace, 'endo')} />
                      <ActionBtn status="crown" label="Coroa" onClick={() => updateTooth(selectedToothId, selectedFace, 'crown')} />
                      <div className="col-span-2 border-t mt-1 pt-1">
                        <ActionBtn status="missing" label="Ausente (Dente Todo)" onClick={() => updateTooth(selectedToothId, 'whole', 'missing')} />
                        <ActionBtn status="implant" label="Implante (Dente Todo)" onClick={() => updateTooth(selectedToothId, 'whole', 'implant')} />
                      </div>
                  </div>
                  <button onClick={() => setSelectedToothId(null)} className="mt-3 w-full text-xs text-gray-500 hover:text-red-500">Cancelar</button>
              </div>
          </div>
      )}

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-6 justify-center text-xs text-gray-600 border-t pt-4">
          <LegendItem color="bg-gray-100 border-gray-300" label="Saudável" />
          <LegendItem color="bg-red-500" label="Cárie" />
          <LegendItem color="bg-blue-500" label="Restaurado" />
          <LegendItem color="bg-yellow-400" label="Coroa/Prótese" />
          <LegendItem color="bg-purple-500" label="Endo" />
          <LegendItem color="bg-gray-800" label="Ausente" />
          <LegendItem color="bg-green-500" label="Implante" />
      </div>
    </div>
  );
};

// Helper components
const getFaceName = (face: string) => {
    const map: Record<string, string> = { occlusal: 'Oclusal/Incisal', vestibular: 'Vestibular', lingual: 'Lingual/Palatal', mesial: 'Mesial', distal: 'Distal' };
    return map[face] || face;
}

const getStatusColor = (status: ToothStatus) => {
    switch (status) {
        case 'caries': return 'bg-red-500 hover:bg-red-600';
        case 'restoration': return 'bg-blue-500 hover:bg-blue-600';
        case 'missing': return 'bg-gray-800';
        case 'endo': return 'bg-purple-500 hover:bg-purple-600';
        case 'implant': return 'bg-green-500 hover:bg-green-600';
        case 'crown': return 'bg-yellow-400 hover:bg-yellow-500';
        default: return 'bg-gray-100 hover:bg-gray-200';
    }
};

interface ComplexToothProps {
  id: number;
  data: Tooth;
  onFaceClick: (face: keyof ToothFaces | 'whole') => void;
}

const ComplexTooth: React.FC<ComplexToothProps> = ({ id, data, onFaceClick }) => {
    // Styling layout for a tooth divided into 5 faces (Cross shape)
    // CSS Grid: 3x3
    // . V .
    // M O D
    // . L .

    if (data.generalStatus === 'missing' || data.generalStatus === 'implant') {
        return (
            <div className="flex flex-col items-center gap-1">
                <div 
                    onClick={() => onFaceClick('whole')}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${getStatusColor(data.generalStatus)}`}
                >
                    {data.generalStatus === 'missing' && <i className="fa-solid fa-xmark text-white"></i>}
                    {data.generalStatus === 'implant' && <i className="fa-solid fa-screw text-white"></i>}
                </div>
                <span className="text-xs font-bold text-gray-500">{id}</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 md:w-12 md:h-12 grid grid-cols-3 grid-rows-3 gap-[1px] bg-gray-300 border border-gray-300 rounded overflow-hidden shadow-sm cursor-pointer transition-transform hover:scale-105">
                {/* Top Row */}
                <div className="bg-white"></div> {/* Corner */}
                <div onClick={() => onFaceClick('vestibular')} className={`cursor-pointer ${getStatusColor(data.faces.vestibular)}`} title="Vestibular"></div>
                <div className="bg-white"></div> {/* Corner */}

                {/* Middle Row */}
                <div onClick={() => onFaceClick('mesial')} className={`cursor-pointer ${getStatusColor(data.faces.mesial)}`} title="Mesial"></div>
                <div onClick={() => onFaceClick('occlusal')} className={`cursor-pointer ${getStatusColor(data.faces.occlusal)}`} title="Oclusal"></div>
                <div onClick={() => onFaceClick('distal')} className={`cursor-pointer ${getStatusColor(data.faces.distal)}`} title="Distal"></div>

                {/* Bottom Row */}
                <div className="bg-white"></div> {/* Corner */}
                <div onClick={() => onFaceClick('lingual')} className={`cursor-pointer ${getStatusColor(data.faces.lingual)}`} title="Lingual"></div>
                <div className="bg-white"></div> {/* Corner */}
            </div>
            <span className="text-xs font-bold text-gray-500">{id}</span>
        </div>
    );
};

interface ActionBtnProps {
    status: ToothStatus;
    label: string;
    onClick: () => void;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ status, label, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs font-bold border transition-colors ${getStatusColor(status).replace('bg-', 'text-').replace('hover:', '')} border-current bg-white hover:bg-gray-50`}>
        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
        {label}
    </button>
);

interface LegendItemProps {
    color: string;
    label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
    <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span>{label}</span>
    </div>
);