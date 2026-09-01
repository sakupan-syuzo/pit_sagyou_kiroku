import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PitRecord, LaneDraft, LaneStatus } from '../types';

export type LaneState = {
  status: LaneStatus;
  draft: LaneDraft;
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
  setLaneState: (index: 0 | 1, state: LaneState) => void;
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

      setLaneState: (index, state) =>
        set((s) => {
          const next: [LaneState, LaneState] = [...s.laneStates] as [LaneState, LaneState];
          next[index] = state;
          return { laneStates: next };
        }),

      resetLane: (index) =>
        set((s) => {
          const next: [LaneState, LaneState] = [...s.laneStates] as [LaneState, LaneState];
          next[index] = initialLaneState();
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

