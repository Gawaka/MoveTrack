import { Box, Typography, Button, Paper, Avatar, CircularProgress, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

const PROGRAM_NAMES: Record<string, string> = {
    ppl: 'PPL (Push-Pull-Legs)',
    split: 'Спліт-тренування',
    full_body: 'Full Body',
};

const CATEGORY_ICONS: Record<string, string> = {
    home: '🏠 Дім',
    gym: '🏋️ GYM',
    bodyweight: '🤸 Власна вага'
};

const INVENTORY_NAMES: Record<string, string> = {
    dumbbells: 'Гантелі',
    pullup_bar: 'Турнік',
    bench: 'Лава',
    ez_bar: 'EZ-штанга'
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        const fetchHistory = async ()=> {
            if (!user?.uid) return;

            setLoading(true);

            try {
                const q = query(
                    collection(db, 'workouts'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc'),
                );
                const querySnapshot = await getDocs(q);

                const historyData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setHistory(historyData);
                
            } catch (error) {
                console.error("Помилка завантаження історії:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    console.log(history);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ m: 0, fontWeight: "800", }}>
                        Привіт, {userName} 👋
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Готовий до тренування?
                    </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#20352d', color: 'primary.main', fontWeight: 'bold' }}>
                    {userName.charAt(0).toUpperCase()}
                </Avatar>
            </Box>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    Твої тренування
                </Typography>
                
                {loading && <CircularProgress size={24} sx={{ alignSelf: 'center', my: 2 }} />}
                
                {!loading && history.length === 0 && (
                    <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                        У тебе ще немає завершених тренувань.<br/>Час почати!
                    </Typography>
                )}
                
                {!loading && history.length > 0 && history.map((workout) => (
                    <Box 
                        key={workout.id} // 👈 Ось цей обов'язковий ключ!
                        sx={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 1.5, 
                            p: 2, 
                            bgcolor: '#0d171c', 
                            borderRadius: 2, 
                            border: '1px solid', 
                            borderColor: 'divider',
                            transition: 'border-color 0.2s ease',
                            '&:hover': { borderColor: 'primary.main', cursor: 'pointer' } // Готуємо до майбутнього кліку
                        }}
                    >
                        {/* Верхній ряд: Назва програми та статус */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography sx={{ fontWeight: "bold", fontSize: '1.1rem' }}>
                                    {PROGRAM_NAMES[workout.programType] || workout.programType}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {workout.createdAt?.toDate().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </Typography>
                            </Box>
                            
                            {/* Використовуємо Chip замість звичайного Typography для статусу */}
                            <Chip 
                                label="Виконано" 
                                size="small" 
                                sx={{ bgcolor: '#12352a', color: 'primary.main', fontWeight: 'bold', borderRadius: 1 }} 
                            />
                        </Box>
                        {/* Нижній ряд: Категорія та інвентар */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                            <Chip 
                                label={CATEGORY_ICONS[workout.category] || workout.category} 
                                size="small" 
                                variant="outlined" 
                                sx={{ borderColor: 'divider', color: 'text.secondary', borderRadius: 1 }} 
                            />
                            {/* Виводимо інвентар тільки для дому, і перекладаємо його через словник */}
                            {workout.category === 'home' && workout.inventory && workout.inventory.length > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                    {workout.inventory.map((item: string) => INVENTORY_NAMES[item] || item).join(', ')}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ))}
            </Paper>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{fontWeight: "bold"}}>Швидкий старт</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Створи новий день і вибери формат тренування.
                </Typography>
                <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => navigate('/workout/new')}
                >
                    + Новий день тренування
                </Button>
            </Paper>
        </Box>
    );
};