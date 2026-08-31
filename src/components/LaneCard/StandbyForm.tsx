import React from 'react';
import type { LaneDraft } from '../../types';
import DriverSelector from '../DriverSelector';

interface StandbyFormProps {
  onPitIn: (draft: Pick<LaneDraft, 'pitNo' | 'carNo' | 'pitInDriver'>) => void;
}

const StandbyForm: React.FC<StandbyFormProps> = ({ onPitIn }) => {
  const [pitNo, setPitNo] = React.useState('');
  const [carNo, setCarNo] = React.useState('');
  const [pitInDriver, setPitInDriver] = React.useState('');

  const handlePitIn = () => {
    if (!pitNo.trim() || !carNo.trim() || !pitInDriver.trim()) {
      alert('PIT No. / Car No. / PIT INドライバーをすべて入力してください');
      return;
    }
    onPitIn({ pitNo: pitNo.trim(), carNo: carNo.trim(), pitInDriver: pitInDriver.trim() });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">PIT No.</label>
          <input
            type="text"
            inputMode="numeric"
            value={pitNo}
            onChange={(e) => setPitNo(e.target.value)}
            placeholder="例: 1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Car No.</label>
          <input
            type="text"
            inputMode="numeric"
            value={carNo}
            onChange={(e) => setCarNo(e.target.value)}
            placeholder="例: 12"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">PIT INドライバー</label>
        <DriverSelector
          value={pitInDriver}
          onChange={setPitInDriver}
          placeholder="ドライバー名を入力"
        />
      </div>

      <button
        onClick={handlePitIn}
        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 rounded-xl text-base transition-colors shadow-md"
      >
        🏎️ PIT IN
      </button>
    </div>
  );
};

export default StandbyForm;
