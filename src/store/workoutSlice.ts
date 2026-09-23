import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DraftWorkout {
    programType: string;
    category: string;
    inventory: string[];
    exercises: any[];
}

interface WorkoutState {
    draft: DraftWorkout | null;
}

const initialState: WorkoutState = {
    draft: null
};

export const workoutSlice = createSlice({
    name: 'workout',
    initialState,
    reducers: {
        // Оновлюємо setDraft, щоб він одразу створював порожній масив вправ
        setDraft: (state, action: PayloadAction<Omit<DraftWorkout, 'exercises'>>) => {
            state.draft = {
                ...action.payload,
                exercises: []
            };
        },
        //Новий екшен для додавання вправи
        addExercise: (state, action: PayloadAction<any>) => {
            if (state.draft) {
                // Перевіряємо, чи вправа ще не додана (щоб уникнути дублів)
                const exists = state.draft.exercises.find(e => e.id === action.payload.id);
                if (!exists) {
                    state.draft.exercises.push(action.payload);
                }
            }
        },
        clearDraft: (state) => {
            state.draft = null;
        },
        removeExercise: (state, action: PayloadAction<string>) => {
            if (state.draft) {
                state.draft.exercises = state.draft.exercises.filter(
                    (exercise) => exercise.id !== action.payload
                );
            }
        },
    }
});

export const { setDraft, addExercise, clearDraft, removeExercise } = workoutSlice.actions;
export default workoutSlice.reducer;