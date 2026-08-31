import React from 'react';
import type { LaneDraft } from '../../types';
import DriverSelector from '../DriverSelector';

interface ToggleSwitchProps {
  value: boolean;
  onChange: (v: boolean) => void;
  labelOff?: string;
  labelOn?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onChange,
  labelOff = 'なし',
  labelOn = 'あり',
}) => {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-sm font-bold ${!value ? 'text-gray-800' : 'text-gray-400'}`}
      >
        {labelOff}
      </span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
          value ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        aria-pressed={value}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span
        className={`text-sm font-bold ${value ? 'text-blue-600' : 'text-gray-400'}`}
      >
        {labelOn}
      </span>
    </div>
  );
};

interface WorkingFormProps {
  draft: LaneDraft;
  onDraftChange: (patch: Partial<LaneDraft>) => void;
  onCancel: () => void;
  onHandover: () => void;
  onPitOut: () => void;
}

const WorkingForm: React.FC<WorkingFormProps> = ({
  draft,
  onDraftChange,
  onCancel,
  onHandover,
  onPitOut,
}) => {
  return (
    <div className="space-y-3 relative">
      {/* 取り消しボタン（右上） */}
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <div className="bg-gray-100 rounded-lg px-3 py-1 text-xs text-gray-600">
            <span className="font-bold">PIT</span> {draft.pitNo}
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-1 text-xs text-gray-600">
            <span className="font-bold">Car</span> {draft.carNo}
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-red-500 border border-red-300 rounded-lg px-2 py-1 font-bold hover:bg-red-50 active:bg-red-100 transition-colors"
        >
          取り消し
        </button>
      </div>

      {/* PIT INドライバー (Read-only) */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">PIT INドライバー</label>
        <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 font-bold">
          {draft.pitInDriver}
        </div>
      </div>

      {/* PIT IN時刻 (Read-only) */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">PIT IN時刻</label>
        <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 font-bold font-mono">
          {draft.pitInTime}
        </div>
      </div>

      {/* ドライバー交代 */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-2">ドライバー交代</label>
        <ToggleSwitch
          value={draft.isDriverChanged}
          onChange={(v) => onDraftChange({ isDriverChanged: v })}
        />
        {draft.isDriverChanged && (
          <div className="mt-2">
            <label className="block text-xs font-bold text-gray-600 mb-1.5">PIT OUTドライバー</label>
            <DriverSelector
              value={draft.pitOutDriver}
              onChange={(v) => onDraftChange({ pitOutDriver: v })}
              placeholder="交代後ドライバー名"
              excludeLabels={[draft.pitInDriver]}
            />
          </div>
        )}
      </div>

      {/* 給油 */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-2">給油</label>
        <ToggleSwitch
          value={draft.refuel}
          onChange={(v) => onDraftChange({ refuel: v })}
        />
      </div>

      {/* タイヤ交換 */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-2">タイヤ交換</label>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => onDraftChange({ tires: n })}
              className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                draft.tires === n
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {n}本
            </button>
          ))}
        </div>
      </div>

      {/* その他 */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">その他作業</label>
        <input
          type="text"
          value={draft.other}
          onChange={(e) => onDraftChange({ other: e.target.value })}
          placeholder="例: エアプレッシャー調整"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 引き継ぎボタン */}
      <button
        onClick={onHandover}
        className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow"
      >
        🔄 引き継ぎ（途中離脱）
      </button>

      {/* PIT OUTボタン */}
      <button
        onClick={onPitOut}
        className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg"
      >
        🏁 PIT OUT
      </button>
    </div>
  );
};

export default WorkingForm;
