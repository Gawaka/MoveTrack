import { useState } from 'react';
import { Box, Typography, Button, Paper, TextField, Tabs, Tab, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { useDispatch } from 'react-redux';
import { addExercise, removeExercise } from '../store/workoutSlice';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Exercise {
    id: string;
    name: string;
    slug: string;
    category: string;
    muscleGroups: string[];
    equipmentIds: string[];
    location: string[];
    difficulty: string;
    instructions: string[];
};

interface Equipment {
    id: string;
    name: string;
    slug: string;
    category: string;
    type: string;
    location: string[];
    adjustable: boolean;
    description: string;
};

const CATEGORY_NAMES: Record<string, string> = {
    chest: 'Груди',
    back: 'Спина',
    legs: 'Ноги',
    arms: 'Руки',
    shoulders: 'Плечі',
    core: 'Прес',
    full_body: 'Все тіло'
};

const DIFFICULTY_NAMES: Record<string, string> = {
    beginner: 'Початківець',
    intermediate: 'Середній',
    advanced: 'Просунутий'
};

const LOCATION_NAMES:  Record<string, string> = {
    gym: 'Тренажерний зал',
    home: 'Дім'
};

const fetchExercises = async (): Promise<Exercise[]>=> {
    const collectionExercises = collection(db, 'exercises');
    const querySnapshot = await getDocs(collectionExercises);

    const exercises = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Exercise[];

    return exercises;
};

const fetchEquipments = async (): Promise<Equipment[]>=> {
    const collectionEquipment = collection(db, 'equipment');
    const querySnapshot = await getDocs(collectionEquipment);

    const equipment = querySnapshot.docs.map((doc)=> ({
        id: doc.id,
        ...doc.data(),
    })) as Equipment[];

    return equipment;
};

export default function ExercisesPage() {
    const navigate = useNavigate();
    const draft = useSelector((state: RootState) => state.workout.draft);
    const [tabIndex, setTabIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch = useDispatch();
    const { data: exercisesList = [], isLoading, isError } = useQuery({
        queryKey: ['exercises'],
        queryFn: fetchExercises,
    });
    const { data: equipmentList = [] } = useQuery({
        queryKey: ['equipment'],
        queryFn: fetchEquipments,
    });

    console.log(equipmentList);

    const DYNAMIC_EQUIPMENT_NAMES = equipmentList.reduce((acc, eq) => {
        acc[eq.id] = eq.name;
        return acc;
    }, {} as Record<string, string>);

    const tabKeys = ['all', 'chest', 'arms', 'back', 'legs', 'shoulders', 'core', 'full_body'];
    const activeTabKey = tabKeys[tabIndex];

    const filteredExercises = exercisesList.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTabKey === 'all' || exercise.category === activeTabKey;
        let matchesInventory = true;

        if (draft?.category === 'home') {
            if (exercise.equipmentIds.length > 0) {
                matchesInventory = exercise.equipmentIds.some(eq => draft?.inventory.includes(eq));
            } else {
                matchesInventory = true;
            };
        }
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
    };

        if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
        if (isError) return<Typography sx={{color: 'red', fontWeight: "bold"}}>"Помилка завантаження тренування".</Typography>;

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 10 }}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px'}}>
                <Typography variant="h4" gutterBottom sx={{ m: 0, fontWeight: "800" }}>
                    Обери вправи
                </Typography>
                <Button variant="contained" sx={{height: '30px'}} onClick={() => navigate('/workout/new')}>
                    Назад
                </Button>
            </Box>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                {/* Tabs */}
                <Tabs 
                    value={tabIndex} 
                    onChange={(_, newValue) => setTabIndex(newValue)} 
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0 }}}
                >
                    {/* Category exercises */}
                    <Tab label="Усі" />
                    <Tab label="Груди" />
                    <Tab label="Руки" />
                    <Tab label="Спина" />
                    <Tab label="Ноги" />
                    <Tab label="Плечі" />
                    <Tab label="Прес" />
                    <Tab label="Все тіло" />
                </Tabs>
                {/* Search */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="🔎 Пошук вправи..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ bgcolor: '#0c1519', borderRadius: 1 }}
                    />
                        {/* Exercises list */}
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
                                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                            <Typography sx={{fontWeight: "bold"}}>{exercise.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {CATEGORY_NAMES[exercise.category] || exercise.category}
                                                {' · '}
                                                {exercise.equipmentIds.length === 0 
                                                    ? 'Власна вага' 
                                                    : exercise.equipmentIds.map(item => DYNAMIC_EQUIPMENT_NAMES[item] || item).join(', ') 
                                                }
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {exercise.location.map(item=> LOCATION_NAMES[item] || item).join(', ')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {DIFFICULTY_NAMES[exercise.difficulty]}
                                            </Typography>
                                        </Box>
                                        <Button 
                                            variant={isAdded ? "outlined" : "contained"} 
                                            color={isAdded ? "error" : "primary"}
                                            size="small"
                                            onClick={() => {
                                                if (isAdded) {
                                                    dispatch(removeExercise(exercise.id));
                                                } else {
                                                    dispatch(addExercise(exercise));
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
                    {/* Submit added btn */}
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
                            zIndex: 1001,
                        }}>
                            
                            <Box sx={{ maxWidth: 'sm', mx: 'auto',}}>
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
        </>
    );
};