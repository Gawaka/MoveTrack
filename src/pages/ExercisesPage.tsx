import { useState } from 'react';
import { Box, Typography, Button, Paper, TextField, Tabs, Tab } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { useDispatch } from 'react-redux';
import { addExercise, removeExercise } from '../store/workoutSlice';

const MOCK_EXERCISES = [
    { id: '1', name: 'Жим гантелей на лаві', target: 'Груди', equipment: 'bench' },
    { id: '2', name: 'Підтягування', target: 'Спина', equipment: 'pullup_bar' },
    { id: '3', name: 'Румунська тяга з гантелями', target: 'Ноги', equipment: 'dumbbells' },
    { id: '4', name: 'Згинання рук з EZ-штангою', target: 'Руки', equipment: 'ez_bar' },
    { id: '5', name: 'Віджимання на брусах', target: 'Груди', equipment: 'dip_bars' },
    { id: '6', name: 'Французький жим з EZ-штангою', target: 'Руки', equipment: 'ez_bar' },
    { id: '7', name: 'Випади з гантелями', target: 'Ноги', equipment: 'dumbbells' },
];

export default function ExercisesPage() {
    const navigate = useNavigate();
    const draft = useSelector((state: RootState) => state.workout.draft);
    const [tabIndex, setTabIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch = useDispatch();

    const tabMapping = ['Усі', 'Груди', 'Руки', 'Спина', 'Ноги'];
    const activeTab = tabMapping[tabIndex];

const filteredExercises = MOCK_EXERCISES.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'Усі' || exercise.target === activeTab;
        let matchesInventory = true;

        if (draft?.category === 'home') {
            matchesInventory = draft?.inventory.includes(exercise.equipment);
        };

        return matchesSearch && matchesTab && matchesInventory;
    });

    if (!draft) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography gutterBottom>Спочатку налаштуйте тренування!</Typography>
                <Button variant="contained" onClick={() => navigate('/workout/new')}>
                    Ок
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 10 }}>
            {/* Хедер */}
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px'}}>
                <Typography variant="h4" gutterBottom sx={{ m: 0, fontWeight: "800" }}>
                    Обери вправи
                </Typography>
                <Button variant="contained" sx={{height: '30px'}} onClick={() => navigate('/workout/new')}>
                    Назад
                </Button>
            </Box>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                {/* 1. Вкладки (Tabs) */}
                <Tabs 
                    value={tabIndex} 
                    onChange={(_, newValue) => setTabIndex(newValue)} 
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0 }}}
                >
                    <Tab label="Усі" />
                    <Tab label="Груди" />
                    <Tab label="Руки" />
                    <Tab label="Спина" />
                    <Tab label="Ноги" />
                </Tabs>
                {/* 2. Пошук */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="🔎 Пошук вправи..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ bgcolor: '#0c1519', borderRadius: 1 }}
                    />
                        {/* СПИСОК ВПРАВ */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {filteredExercises.length === 0 ? (
                            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                Нічого не знайдено 😔
                            </Typography>
                        ) : (
                            filteredExercises.map((exercise) => {
                                const isAdded = draft.exercises.some((e: any)=> e.id === exercise.id);

                                return(
                                    <Box 
                                        key={exercise.id}
                                        sx={{ 
                                            display: 'grid', gridTemplateColumns: '52px 1fr auto', 
                                            gap: 2, alignItems: 'center', py: 1.5, 
                                            borderBottom: '1px solid', borderColor: 'divider',
                                            '&:last-child': { borderBottom: 0 }
                                        }}
                                    >
                                        <Box sx={{ 
                                            width: 52, height: 52, borderRadius: 2, 
                                            background: 'linear-gradient(135deg, #26332e, #11191d)', 
                                            display: 'grid', placeItems: 'center', fontSize: 24 
                                        }}>
                                            🏋️
                                        </Box>
                                        <Box>
                                            <Typography sx={{fontWeight: "bold"}}>{exercise.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {exercise.target} · {exercise.equipment}
                                            </Typography>
                                        </Box>
                                        <Button 
                                            variant={isAdded ? "outlined" : "contained"} 
                                            color={isAdded ? "error" : "primary"} // Робимо кнопку червоною, якщо вправу можна прибрати (опціонально)
                                            size="small"
                                            onClick={() => {
                                                if (isAdded) {
                                                    dispatch(removeExercise(exercise.id)); // Видаляємо, якщо вже є
                                                } else {
                                                    dispatch(addExercise(exercise));       // Додаємо, якщо немає
                                                }
                                            }}
                                        >
                                            {isAdded ? 'Прибрати ✕' : 'Додати'}
                                        </Button>
                                    </Box>
                                )
                            })
                        )}
                    </Box>
                </Paper>
                    {draft.exercises.length > 0 && (
                        <Box sx={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 2,
                            bgcolor: '#101a20',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            zIndex: 1000
                        }}>
                            <Box sx={{ maxWidth: 'sm', mx: 'auto' }}>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    size="large"
                                    onClick={() => navigate('/workout/active')}
                                >
                                    Готово (Обрано: {draft.exercises.length})
                                </Button>
                            </Box>
                        </Box>
                    )}
        </Box>
    );
}