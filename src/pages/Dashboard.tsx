import { Box, Typography, Button, Paper, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';


export default function DashboardPage() {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

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
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1}}>
                <Typography variant="h6" sx={{fontWeight: "bold"}}>Твої програми</Typography>
                
                <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', p: 1.5, 
                        bgcolor: '#0d171c', borderRadius: 2, 
                        border: '1px solid', 
                        borderColor: 'divider' 
                    }}>
                    <Box>
                        <Typography sx={{fontWeight: "bold"}}>PPL</Typography>
                        <Typography variant="caption" color="text.secondary">3 дні на тиждень · Зал</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ bgcolor: '#12352a', color: 'primary.main', px: 1.5, py: 0.5, borderRadius: 5 }}>
                        Активна
                    </Typography>
                </Box>
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
}