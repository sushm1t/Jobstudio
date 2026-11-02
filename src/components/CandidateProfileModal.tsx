import React, { useState } from 'react';
import { User, Save, X } from 'lucide-react';
import { CandidateInfo } from '../data/defaultData';

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterProfileText: string;
  setMasterProfileText: (val: string) => void;
  candidateInfo: CandidateInfo;
  setCandidateInfo: React.Dispatch<React.SetStateAction<CandidateInfo>>;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  isOpen,
  onClose,
  masterProfileText,
  setMasterProfileText,
  candidateInfo,
  setCandidateInfo,
}) => {
  if (!isOpen) return null;

  const [localText, setLocalText] = useState(masterProfileText);
  const [localInfo, setLocalInfo] = useState(candidateInfo);

  const handleSave = () => {
    setMasterProfileText(localText);
    setCandidateInfo(localInfo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Candidate Master Profile & Contact Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Contact Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">First Name</label>
              <input
                type="text"
                value={localInfo.first_name}
                onChange={(e) => setLocalInfo({ ...localInfo, first_name: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Last Name</label>
              <input
                type="text"
                value={localInfo.last_name}
                onChange={(e) => setLocalInfo({ ...localInfo, last_name: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                value={localInfo.email}
                onChange={(e) => setLocalInfo({ ...localInfo, email: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone</label>
              <input
                type="text"
                value={localInfo.phone}
                onChange={(e) => setLocalInfo({ ...localInfo, phone: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Location</label>
              <input
                type="text"
                value={localInfo.location}
                onChange={(e) => setLocalInfo({ ...localInfo, location: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={localInfo.linkedin}
                onChange={(e) => setLocalInfo({ ...localInfo, linkedin: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Master Resume Experience & Skills (Used by Gemini for Tailoring)
            </label>
            <textarea
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              rows={12}
              className="w-full p-2.5 border border-slate-300 rounded font-mono text-[11px] leading-relaxed"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
