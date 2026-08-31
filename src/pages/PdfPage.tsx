import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { usePitStore } from '../store/usePitStore';
import HistoryList from '../components/HistoryList';
import EditModal from '../components/EditModal';
import PitDocument from '../pdf/PitDocument';
import type { PitRecord } from '../types';

const PdfPage: React.FC = () => {
  const records = usePitStore((s) => s.records);
  const sessionName = usePitStore((s) => s.sessionName);
  const inspector = usePitStore((s) => s.inspector);
  const setSessionName = usePitStore((s) => s.setSessionName);
  const setInspector = usePitStore((s) => s.setInspector);

  const [editingRecord, setEditingRecord] = React.useState<PitRecord | null>(null);

  const fileName = `pit_record_${sessionName || 'session'}_${new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '')}.pdf`;

  return (
    <div className="px-3 pb-24 pt-4 space-y-4 max-w-lg mx-auto">
      <h1 className="text-lg font-bold text-gray-800 px-1">📄 PDF出力</h1>

      {/* セッション情報 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-3">
        <h2 className="text-sm font-bold text-gray-700">出力情報</h2>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">セッション名</label>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="例: 決勝レース"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">担当技術委員</label>
          <input
            type="text"
            value={inspector}
            onChange={(e) => setInspector(e.target.value)}
            placeholder="氏名"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PDFダウンロードボタン */}
        {records.length === 0 ? (
          <div className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-xl text-center text-sm">
            作業記録がないためPDF出力できません
          </div>
        ) : (
          <PDFDownloadLink
            document={
              <PitDocument
                records={records}
                sessionName={sessionName}
                inspector={inspector}
              />
            }
            fileName={fileName}
          >
            {({ loading, error }) => (
              <button
                className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-base transition-colors shadow-md ${
                  loading
                    ? 'bg-gray-400 text-white cursor-wait'
                    : error
                    ? 'bg-red-500 text-white'
                    : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
                }`}
                disabled={loading}
              >
                <Download size={20} />
                {loading ? 'PDF生成中...' : error ? 'エラー' : 'PDFダウンロード'}
              </button>
            )}
          </PDFDownloadLink>
        )}
      </div>

      {/* 履歴一覧（再利用） */}
      <div>
        <h2 className="text-sm font-bold text-gray-600 mb-2 px-1">📋 作業履歴（タップで修正）</h2>
        <HistoryList onEditRecord={setEditingRecord} />
      </div>

      <EditModal record={editingRecord} onClose={() => setEditingRecord(null)} />
    </div>
  );
};

export default PdfPage;
