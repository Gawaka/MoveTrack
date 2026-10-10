import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Avatar, Button, Paper, CircularProgress } from '@mui/material';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut } from 'firebase/auth';
import { data, useNavigate } from 'react-router-dom';
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

        workouts.forEach((workout)=> {
            if(workout.duration) {
                totalDurationSeconds += workout.duration;
            };

            if(workout.sets) {
                totalCompletedSets += Object.values(workout.sets).flat().filter((set: any)=> set.isDone === true).length
            }
        });
        return {
            totalDurationSeconds,
            totalCompletedSets
        };
    }, [workouts]);

    const duration = stats.totalDurationSeconds;
    const completedSets = stats.totalCompletedSets;

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
                    <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            justifyContent: 'space-between', 
                            textAlign: 'center',
                            gap: 2
                        }}>
                        <Box>
                            <Typography variant='h5' sx={{ fontWeight: 'bold' }}>{duration}</Typography>
                            <Typography sx={{fontSize: 12}}>Загальний час тренувань</Typography>
                        </Box>
                        <Box>
                            <Typography variant='h5' sx={{ fontWeight: 'bold' }}>{completedSets}</Typography>
                            <Typography sx={{fontSize: 12}}>Загальний час тренувань</Typography>
                        </Box>
                    </Box>
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