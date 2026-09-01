import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PitRecord, LaneDraft, LaneStatus } from '../types';

export type LaneState = {
  status: LaneStatus;
  draft: LaneDraft;
  continuousMode: boolean; // 連続記録モード
};

const initialLaneDraft = (): LaneDraft => ({
  pitNo: '',
  carNo: '',
  pitInDriver: '',
  isDriverChanged: false,
  pitOutDriver: '',
  pitInTime: '',
  refuel: false,
  tires: 0,
  other: '',
  createdAt: 0,
});

export const initialLaneState = (): LaneState => ({
  status: 'standby',
  draft: initialLaneDraft(),
  continuousMode: false,
});

interface PitStore {
  records: PitRecord[];
  sessionName: string;
  inspector: string;
  laneStates: [LaneState, LaneState];

  addRecord: (record: PitRecord) => void;
  updateRecord: (id: string, patch: Partial<PitRecord>) => void;
  deleteRecord: (id: string) => void;
  setSessionName: (v: string) => void;
  setInspector: (v: string) => void;
  // 部分マージ方式: 指定しなかったプロパティ（continuousMode 等）は保持される
  setLaneState: (index: 0 | 1, partial: Partial<LaneState>) => void;
  // continuousMode を温存したままstatus/draftのみ初期化
  resetLane: (index: 0 | 1) => void;
  clearAllData: () => void;
}

export const usePitStore = create<PitStore>()(
  persist(
    (set) => ({
      records: [],
      sessionName: '',
      inspector: '',
      laneStates: [initialLaneState(), initialLaneState()],

      addRecord: (record) =>
        set((state) => ({ records: [...state.records, record] })),

      updateRecord: (id, patch) =>
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...patch } : r
          ),
        })),

      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),

      setSessionName: (v) => set({ sessionName: v }),
      setInspector: (v) => set({ inspector: v }),

      // 部分マージ: continuousMode など指定しなかったキーは既存値を維持
      setLaneState: (index, partial) =>
        set((s) => {
          const next: [LaneState, LaneState] = [...s.laneStates] as [LaneState, LaneState];
          next[index] = { ...next[index], ...partial };
          return { laneStates: next };
        }),

      // continuousMode を維持したまま status/draft のみリセット
      resetLane: (index) =>
        set((s) => {
          const next: [LaneState, LaneState] = [...s.laneStates] as [LaneState, LaneState];
          next[index] = {
            ...initialLaneState(),
            continuousMode: s.laneStates[index].continuousMode,
          };
          return { laneStates: next };
        }),

      clearAllData: () =>
        set({
          records: [],
          sessionName: '',
          inspector: '',
          laneStates: [initialLaneState(), initialLaneState()],
        }),
    }),
    {
      name: 'pit-records-storage',
    }
  )
);
