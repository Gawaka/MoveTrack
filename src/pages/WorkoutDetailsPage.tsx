import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Box, Typography, Button, Paper, CircularProgress, Divider } from '@mui/material';

interface WorkoutData {
    id: string;
    programType: string;
    category: string;
    inventory: string[];
    createdAt: any; // Timestamp from Firebase
    exercises: any[]; 
    sets: Record<string, { weight: string; reps: string; isDone: boolean }[]>;
    notes?: string;
};

const PROGRAM_TYPE_NAMES: Record<string, string> = {
    full_body: 'Фул баді',
    ppl: 'PPL (Push-Pull-Legs)',
    upper_lower: 'Верх-низ',
    split: 'Спліт',
    circuit_traning: 'Кругове тренування'
};

const fetchWorkoutById = async (id: string): Promise<WorkoutData> => {
    const docRef = doc(db, 'workouts', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
        throw new Error('Тренування не знайдено');
    }
    
    return {id: docSnap.id, ...docSnap.data()} as WorkoutData;
};

export default function WorkoutDetailsPage() {
    const { id } = useParams<{ id: string }>(); // id from URL
    const navigate = useNavigate();

    const { data: workout, isLoading, isError } = useQuery({
        queryKey: ['workout', id],
        queryFn: () => fetchWorkoutById(id!),
        enabled: !!id,
    });

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (isError || !workout) return <Typography color="error" align="center">Помилка завантаження тренування</Typography>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 10 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {PROGRAM_TYPE_NAMES[workout.programType] || workout.programType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {workout.createdAt?.toDate().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                </Box>
                <Button variant="contained" size="small" onClick={() => navigate('/')}>
                    На головну
                </Button>
            </Box>
            {workout.notes && (
                <Paper sx={{ p: 2, bgcolor: '#111c22', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                        НОТАТКИ
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {workout.notes}
                    </Typography>
                </Paper>
            )}
            {/* Sets details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {workout.exercises.map((exercise: any, index: number) => {
                    const exerciseSets = workout.sets[exercise.id] || [];

                    return (
                        <Paper key={exercise.id} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                {index + 1}. {exercise.name}
                            </Typography>
                            <Divider />
                            {/* Titles table Sets */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr', gap: 1, textAlign: 'center', color: 'text.secondary', fontSize: '0.8rem' }}>
                                <Typography variant="caption">Сет</Typography>
                                <Typography variant="caption">КГ</Typography>
                                <Typography variant="caption">Повторення</Typography>
                            </Box>
                            {/* Sets */}
                            {exerciseSets.map((set: any, setIndex: number) => (
                                <Box key={setIndex} sx={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr', gap: 1, alignItems: 'center' }}>
                                    <Box sx={{ textAlign: 'center', fontWeight: 'bold', bgcolor: '#17242b', p: 1, borderRadius: 1 }}>
                                        {setIndex + 1}
                                    </Box>
                                    <Box sx={{ textAlign: 'center', bgcolor: '#0c1519', p: 1, borderRadius: 1, color: set.isDone ? 'primary.main' : 'text.secondary' }}>
                                        {set.weight || '-'}
                                    </Box>
                                    <Box sx={{ textAlign: 'center', bgcolor: '#0c1519', p: 1, borderRadius: 1, color: set.isDone ? 'primary.main' : 'text.secondary' }}>
                                        {set.reps || '-'}
                                    </Box>
                                </Box>
                            ))}
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
}