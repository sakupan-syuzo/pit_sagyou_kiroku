import React from 'react';
import LaneCard from '../components/LaneCard/LaneCard';
import HistoryList from '../components/HistoryList';
import EditModal from '../components/EditModal';
import type { PitRecord } from '../types';

const InputPage: React.FC = () => {
  const [editingRecord, setEditingRecord] = React.useState<PitRecord | null>(null);

  return (
    <div className="px-3 pb-24 pt-4 space-y-4 max-w-lg mx-auto">
      {/* ページタイトル */}
      <h1 className="text-lg font-bold text-gray-800 px-1">📝 ピット作業入力</h1>

      {/* レーンカード */}
      <LaneCard laneIndex={0} />
      <LaneCard laneIndex={1} />

      {/* 履歴 */}
      <div>
        <h2 className="text-sm font-bold text-gray-600 mb-2 px-1">📋 作業履歴（タップで修正）</h2>
        <HistoryList onEditRecord={setEditingRecord} />
      </div>

      {/* 修正モーダル */}
      <EditModal record={editingRecord} onClose={() => setEditingRecord(null)} />
    </div>
  );
};

export default InputPage;
