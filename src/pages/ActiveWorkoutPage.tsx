import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';

export default function ActiveWorkoutPage() {
    const draft = useSelector((state: RootState) => state.workout.draft);
    const navigate = useNavigate();
    
    const [setsData, setSetsData] = useState<Record<string, {weight: string, reps: string, isDone: boolean}[]>>(()=> {
        const initial: any = {};
        if(draft) {
            draft.exercises.forEach((ex: any)=> {
                initial[ex.id] = [{weight: '', reps: '', isDone: false}];
            });
        }
        return initial;
    });

    const addSet = (exerciseId: string)=> {
        setSetsData(prev=> ({
            ...prev,
            [exerciseId]: [...prev[exerciseId], { weight: '', reps: '', isDone: false }]  
        }));
    };

    const updateSet = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
        setSetsData(prev=> {
            const newSets = [...prev[exerciseId]];
            newSets[setIndex] = {...newSets[setIndex], [field]: value};
            return {...prev, [exerciseId]: newSets};
        });
    };

    const toggleSetDone = (exerciseId: string, setIndex: number) => {
        setSetsData(prev => {
            const newSets = [...prev[exerciseId]];
            newSets[setIndex] = { ...newSets[setIndex], isDone: !newSets[setIndex].isDone };
            return { ...prev, [exerciseId]: newSets };
        });
    };

    if (!draft || draft.exercises.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography gutterBottom>Тренування порожнє!</Typography>
                <Button variant="contained" sx={{height: '30px'}} onClick={() => navigate('/workout/exercises')}>
                    Назад
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3, pb: 10 }}>
            
            {/* Хедер тренування */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" sx={{fontWeight: "bold"}}>
                        Тренування
                    </Typography>
                    <Typography variant="body2" color="primary.main">
                        ⏱ 00:00 {/* Потім тут будемо рахувати час */}
                    </Typography>
                </Box>

                <Button variant="contained" sx={{height: '30px'}} onClick={() => navigate('/workout/exercises')}>
                    Назад
                </Button>
            </Box>
            {draft.exercises.map((exercise: any, index: number) => (
                <Paper key={exercise.id} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography variant="h6" sx={{fontWeight: "bold"}}>
                        {index + 1}. {exercise.name}
                    </Typography>
                        <Box 
                            sx={{ display: 'grid', 
                                gridTemplateColumns: '40px 1fr 1fr 40px', 
                                gap: 1, 
                                textAlign: 'center', 
                                color: 'text.secondary', 
                                fontSize: '0.8rem', 
                                px: 1,
                            }}>
                            <Typography variant="caption">Сет</Typography>
                            <Typography variant="caption">КГ</Typography>
                            <Typography variant="caption">Повторення</Typography>
                            <Typography variant="caption">✓</Typography>
                        </Box>
                        {setsData[exercise.id]?.map((set, setIndex)=> (
                            <Box 
                                key={setIndex}
                                sx={{
                                    display: 'grid', 
                                    gridTemplateColumns: '40px 1fr 1fr 40px', 
                                    gap: 1, 
                                    alignItems: 'center' 
                                    }}>
                                <Box 
                                    sx={{ textAlign: 'center', 
                                    fontWeight: 'bold', 
                                    bgcolor: '#17242b', 
                                    p: 1, 
                                    borderRadius: 1 
                                    }}>
                                    {setIndex + 1}
                                </Box>
                                {/* Поле для кілограмів */}
                                <TextField 
                                    size="small"
                                    type="number" 
                                    placeholder="0"
                                    onChange={(e) => updateSet(exercise.id, setIndex, 'weight', e.target.value)}
                                    disabled={set.isDone}
                                    sx={{ bgcolor: '#0c1519', borderRadius: 1, input: { textAlign: 'center', p: 1 } }} 
                                />
                                {/* Поле для повторень */}
                                <TextField 
                                    size="small" 
                                    type="number" 
                                    placeholder="0"
                                    onChange={(e) => updateSet(exercise.id, setIndex, 'reps', e.target.value)}
                                    disabled={set.isDone}
                                    sx={{ bgcolor: '#0c1519', borderRadius: 1, input: { textAlign: 'center', p: 1 }}} 
                                />
                                {/* Кнопка "Виконано" (поки що просто квадратик) */}
                                <Button 
                                    variant="outlined"
                                    onClick={() => toggleSetDone(exercise.id, setIndex)}
                                    sx={{ 
                                        minWidth: 0, 
                                        width: 40, 
                                        height: 40, 
                                        p: 0, 
                                        borderColor: 'divider', 
                                        color: 'primary.main',
                                    }}>
                                    {set.isDone ? '✓' : ''}
                                </Button>
                            </Box>
                        ))}
                    <Button 
                        variant="text"
                        onClick={() => addSet(exercise.id)}
                        sx={{ 
                            color: 'primary.main', 
                            mt: 1, 
                            textTransform: 'none' 
                        }}>
                        + Додати підхід
                    </Button>
                </Paper>
            ))}
                <Button 
                    variant="contained" 
                    color="error" 
                    size="small"  
                    onClick={() => console.log('Фінальні дані:', setsData)}
                    sx={{width: '48%', alignSelf: 'center'}}
                    >
                    Завершити тренування
                </Button>
        </Box>
    );
};