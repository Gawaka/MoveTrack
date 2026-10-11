import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Avatar, Grid, Button, Paper, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RepeatIcon from '@mui/icons-material/Repeat';
import LayersIcon from '@mui/icons-material/Layers';
import  formatTime from '../utils/utils'
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { clearUser } from '../store/authSlice';
import { type RootState } from '../store/store';
import { auth } from '../config/firebase';
import { db } from '../config/firebase';

export default function ProfilePage() {
    const [workoutCount, setWorkoutCount] = useState(0);
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [loadingStats, setLoadingStats] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

    

    useEffect(()=> {
        const fetchStats = async ()=> {
            if (!user?.uid) return;

            setLoadingStats(true);

            try{
                const q = query(
                    collection(db, 'workouts'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const workoutsData = querySnapshot.docs.map((doc)=> ({
                    id: doc.id,
                    ...doc.data()
                }))
                setWorkouts(workoutsData);
                setWorkoutCount(workoutsData.length);
            } catch(error) {
                console.error("Помилка завантаження історії:", error);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, [user?.uid]);

    const stats = useMemo(()=> {
        
        let totalDurationSeconds = 0;
        let totalCompletedSets = 0;
        let totalTonnage = 0;
        let totalReps = 0;

        workouts.forEach((workout)=> {
            if(workout.duration) {
                totalDurationSeconds += workout.duration;
            };

            if(workout.sets) {
                const completedSets = Object.values(workout.sets).flat().filter((set: any)=> set.isDone === true);
                totalCompletedSets += completedSets.length;
                totalReps += completedSets.reduce((sum: number, set: any)=> {
                    return sum + Number(set.reps || 0);
                }, 0);
                totalTonnage += completedSets.reduce((sum: number, set: any)=> {
                    return sum + (Number(set.weight));
                }, 0);
            };

        });
        return {
            totalDurationSeconds,
            totalCompletedSets,
            totalTonnage,
            totalReps
        };
    }, [workouts]);

    const handleLogout = async ()=> {
        try{
            await signOut(auth);
            dispatch(clearUser());
            navigate('/login', {replace: true})
        } catch(error) {
            console.error('Помилка виходу:', error);
        }
    } ;    

    return(
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header page */}
            <Typography variant="h4" sx={{ fontWeight: "800", m: 0 }}>
                Профіль
            </Typography>
            {/* user card */}
            <Paper sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 2,
                bgcolor: '#0d171c',
                borderRadius: 2
            }}>
                <Avatar 
                    sx={{ 
                        width: 80, 
                        height: 80, 
                        bgcolor: '#20352d', 
                        color: 'primary.main', 
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}
                >
                    {userName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user?.email}
                    </Typography>
                </Box>
            </Paper>
            <Paper
                sx={{ 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 2,
                    bgcolor: '#0d171c',
                    borderRadius: 2
                }}
            >
                {loadingStats ? <CircularProgress/> :
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>{workoutCount}</Typography>
                        <Typography>Всього тренувань завершено</Typography>
                    </Box>
                }
                {loadingStats ? <CircularProgress/> :
                    <Grid container spacing={2}>
                        {/* Time */}
                        <Grid size={{ xs: 6 }}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                                <AccessTimeIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                                    {formatTime(stats.totalDurationSeconds)}
                                </Typography>
                                <Typography variant='caption' color='text.secondary' sx={{ display: 'block', lineHeight: 1.2 }}>
                                    Загальний час
                                </Typography>
                            </Box>
                        </Grid>
                        {/* Sets */}
                        <Grid size={{ xs: 6 }}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                                <LayersIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                                    {stats.totalCompletedSets}
                                </Typography>
                                <Typography variant='caption' color='text.secondary' sx={{ display: 'block', lineHeight: 1.2 }}>
                                    Успішні підходи
                                </Typography>
                            </Box>
                        </Grid>
                        {/* Reps */}
                        <Grid size={{ xs: 6 }}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                                <RepeatIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                                    {stats.totalReps}
                                </Typography>
                                <Typography variant='caption' color='text.secondary' sx={{ display: 'block', lineHeight: 1.2 }}>
                                    Всі повторення
                                </Typography>
                            </Box>
                        </Grid>
                        {/* Tonage */}
                        <Grid size={{ xs: 6 }}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, textAlign: 'center', height: '100%' }}>
                                <FitnessCenterIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                                    {stats.totalTonnage} <Typography component="span" variant="body2" color="text.secondary">кг</Typography>
                                </Typography>
                                <Typography variant='caption' color='text.secondary' sx={{ display: 'block', lineHeight: 1.2 }}>
                                    Піднята вага
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                }
            </Paper>
            {/* Exit btn */}
            <Button 
                variant="outlined" 
                color="error" 
                size="large"
                fullWidth
                onClick={handleLogout}
                sx={{ mt: 2 }}
            >
                Вийти з акаунту
            </Button>
        </Box>
    )
};