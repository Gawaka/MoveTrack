export type WorkoutType = 'home' | 'gym' | 'bodyweight';
export type ProgramType = 'fullbody' | 'ppl' | 'upper_lower' | 'split' | 'circuit_traning';

export interface InventoryItem {
    id: number,
    name: string,
    weights?: number,
    isAvailable: boolean
};

export interface WorkoutDraft {
    id: string,
    date: string,
    category: WorkoutType,
    program: ProgramType
};

export interface ExerciseSet {
    id: string,
    status: boolean,
    weights?: number,
    reps: number
};

export interface WorkoutExercise {
    id: string,
    exerciseId: string,
    sets: ExerciseSet[],
    supersetId?: string
};

export interface WorkoutSession {
    id: string,
    date: WorkoutDraft['date'],
    program: ProgramType,
    category: WorkoutType,
    exercises: WorkoutExercise[]
};


export interface User {
    uid: string,
    email: string | null,
    displayName: string | null
};

export interface AuthState {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean
};