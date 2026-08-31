import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePitStore } from '../../store/usePitStore';
import type { LaneDraft, PitRecord } from '../../types';
import StandbyForm from './StandbyForm';
import WorkingForm from './WorkingForm';

interface LaneCardProps {
  laneIndex: 0 | 1;
}

const getNowTime = (): string => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

const LANE_LABELS = ['監視レーン 1', '監視レーン 2'];
const LANE_COLORS = [
  'from-blue-600 to-blue-500',
  'from-purple-600 to-purple-500',
];
const LANE_BORDER = ['border-blue-200', 'border-purple-200'];
const LANE_STATUS_BG = ['bg-blue-50', 'bg-purple-50'];

const LaneCard: React.FC<LaneCardProps> = ({ laneIndex }) => {
  const addRecord = usePitStore((s) => s.addRecord);
  const laneState = usePitStore((s) => s.laneStates[laneIndex]);
  const setLaneState = usePitStore((s) => s.setLaneState);
  const resetLane = usePitStore((s) => s.resetLane);

  const { status, draft } = laneState;

  const handlePitIn = (fields: Pick<LaneDraft, 'pitNo' | 'carNo' | 'pitInDriver'>) => {
    setLaneState(laneIndex, {
      status: 'working',
      draft: {
        pitNo: fields.pitNo,
        carNo: fields.carNo,
        pitInDriver: fields.pitInDriver,
        isDriverChanged: false,
        pitOutDriver: '',
        pitInTime: getNowTime(),
        refuel: false,
        tires: 0,
        other: '',
        createdAt: Date.now(),
      },
    });
  };

  const handleDraftChange = (patch: Partial<LaneDraft>) => {
    setLaneState(laneIndex, {
      status: 'working',
      draft: { ...draft, ...patch },
    });
  };

  const handleCancel = () => {
    if (!window.confirm('作業データを破棄して待機中に戻りますか？')) return;
    resetLane(laneIndex);
  };

  const handleHandover = () => {
    if (!window.confirm('引き継ぎとして保存し、待機中に戻りますか？\n（PIT OUT時刻は空欄になります）')) return;
    const record: PitRecord = {
      id: uuidv4(),
      createdAt: draft.createdAt,
      carNo: draft.carNo,
      pitNo: draft.pitNo,
      pitInDriver: draft.pitInDriver,
      isDriverChanged: draft.isDriverChanged,
      pitOutDriver: draft.isDriverChanged ? draft.pitOutDriver : '',
      pitInTime: draft.pitInTime,
      pitOutTime: '',
      refuel: draft.refuel,
      tires: draft.tires,
      other: draft.other,
    };
    addRecord(record);
    resetLane(laneIndex);
  };

  const handlePitOut = () => {
    const record: PitRecord = {
      id: uuidv4(),
      createdAt: draft.createdAt,
      carNo: draft.carNo,
      pitNo: draft.pitNo,
      pitInDriver: draft.pitInDriver,
      isDriverChanged: draft.isDriverChanged,
      pitOutDriver: draft.isDriverChanged ? draft.pitOutDriver : draft.pitInDriver,
      pitInTime: draft.pitInTime,
      pitOutTime: getNowTime(),
      refuel: draft.refuel,
      tires: draft.tires,
      other: draft.other,
    };
    addRecord(record);
    resetLane(laneIndex);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-md border ${LANE_BORDER[laneIndex]} overflow-hidden`}>
      {/* ヘッダー */}
      <div className={`bg-gradient-to-r ${LANE_COLORS[laneIndex]} text-white px-4 py-2.5 flex items-center justify-between`}>
        <span className="font-bold text-sm tracking-wide">{LANE_LABELS[laneIndex]}</span>
        {status === 'working' ? (
          <span className="text-xs bg-white/20 rounded-full px-2 py-0.5 font-bold">
            🔴 作業中 — Car {draft.carNo}
          </span>
        ) : (
          <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">
            ⚪ 待機中
          </span>
        )}
      </div>

      {/* ボディ */}
      <div className={`p-4 ${status === 'working' ? LANE_STATUS_BG[laneIndex] : ''}`}>
        {status === 'standby' ? (
          <StandbyForm onPitIn={handlePitIn} />
        ) : (
          <WorkingForm
            draft={draft}
            onDraftChange={handleDraftChange}
            onCancel={handleCancel}
            onHandover={handleHandover}
            onPitOut={handlePitOut}
          />
        )}
      </div>
    </div>
  );
};

export default LaneCard;
