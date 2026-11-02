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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F5F5F7] flex items-center justify-center">
              <User className="w-4.5 h-4.5 text-[#86868B]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1D1D1F]" style={{ fontFamily: 'var(--font-display)' }}>
                Candidate Profile
              </h2>
              <p className="text-xs text-[#86868B]">
                Contact details &amp; master resume
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#86868B] hover:text-[#1D1D1F] p-2 rounded-full hover:bg-[#F5F5F7] transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5" style={{ fontFamily: 'var(--font-body)' }}>
          {/* Contact Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#6E6E73] text-xs font-medium uppercase tracking-wider block mb-1.5">First Name</label>
              <input
                type="text"
                value={localInfo.first_name}
                onChange={(e) => setLocalInfo({ ...localInfo, first_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border-0 rounded-xl text-[#1D1D1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all duration-200 placeholder:text-[#86868B]"
              />
            </div>
            <div>
              <label className="text-[#6E6E73] text-xs font-medium uppercase tracking-wider block mb-1.5">Last Name</label>
              <input
                type="text"
                value={localInfo.last_name}
                onChange={(e) => setLocalInfo({ ...localInfo, last_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border-0 rounded-xl text-[#1D1D1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all duration-200 placeholder:text-[#86868B]"
              />
            </div>
            <div>
              <label className="text-[#6E6E73] text-xs font-medium uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                value={localInfo.email}
                onChange={(e) => setLocalInfo({ ...localInfo, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border-0 rounded-xl text-[#1D1D1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all duration-200 placeholder:text-[#86868B]"
              />
            </div>
            <div>
              <label className="text-[#6E6E73] text-xs font-medium uppercase tracking-wider block mb-1.5">Phone</label>
              <input
                type="text"
                value={localInfo.phone}
                onChange={(e) => setLocalInfo({ ...localInfo, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border-0 rounded-xl text-[#1D1D1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all duration-200 placeholder:text-[#86868B]"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[#6E6E73] text-xs font-medium uppercase tracking-wider block mb-1.5">Location</label>
              <input
                type="text"
                value={localInfo.location}
                onChange={(e) => setLocalInfo({ ...localInfo, location: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border-0 rounded-xl text-[#1D1D1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all duration-200 placeholder:text-[#86868B]"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[#6E6E73] text-xs font-medium uppercase tracking-wider block mb-1.5">LinkedIn URL</label>
              <input
                type="text"
                value={localInfo.linkedin}
                onChange={(e) => setLocalInfo({ ...localInfo, linkedin: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border-0 rounded-xl text-[#1D1D1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all duration-200 placeholder:text-[#86868B]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[#6E6E73] text-xs font-medium uppercase tracking-wider block">
                Master Resume Experience &amp; Skills
              </label>
              <span className="text-[10px] text-[#86868B] font-medium uppercase tracking-wider">Source of Truth</span>
            </div>
            <textarea
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              rows={12}
              className="w-full p-3.5 bg-[#F5F5F7] border-0 rounded-xl font-mono text-[12px] leading-relaxed text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all duration-200 resize-none placeholder:text-[#86868B]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-[rgba(0,0,0,0.06)] bg-[#F5F5F7]/50 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-[#0071E3] hover:text-[#0077ED] hover:bg-[#0071E3]/5 rounded-full transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-all duration-200 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
