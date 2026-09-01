import React from 'react';
import { Trash2 } from 'lucide-react';
import LaneCard from '../components/LaneCard/LaneCard';
import HistoryList from '../components/HistoryList';
import EditModal from '../components/EditModal';
import { usePitStore } from '../store/usePitStore';
import type { PitRecord } from '../types';

const InputPage: React.FC = () => {
  const [editingRecord, setEditingRecord] = React.useState<PitRecord | null>(null);
  const clearAllData = usePitStore((s) => s.clearAllData);

  const handleClearAll = () => {
    if (window.confirm('本当にすべての入力情報と履歴をクリアしますか？\n（次のイベントを始める前に使用します）')) {
      clearAllData();
    }
  };

  return (
    <div className="px-3 pb-24 pt-4 space-y-4 max-w-lg mx-auto">
      {/* ページタイトルとクリアボタン */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-lg font-bold text-gray-800">📝 ピット作業入力</h1>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg border border-red-100 transition-colors"
          title="すべてのデータを初期化"
        >
          <Trash2 size={14} />
          全クリア
        </button>
      </div>

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
