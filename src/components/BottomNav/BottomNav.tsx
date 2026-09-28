import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Paper 
            sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                zIndex: 1000,
                borderTop: '1px solid',
                borderColor: 'divider',
            }} 
            elevation={3}
        >
            <BottomNavigation
                showLabels
                value={location.pathname}
                onChange={(_, newValue) => {
                    navigate(newValue);
                }}
                sx={{ 
                    bgcolor: '#101a20',
                    '& .MuiBottomNavigationAction-root': {
                        color: 'text.secondary',
                    },
                    '& .Mui-selected': {
                        color: 'primary.main',
                    }
                }}
            >
                <BottomNavigationAction 
                    label="Головна" 
                    value="/" 
                    icon={<HomeIcon />} 
                />
                <BottomNavigationAction 
                    label="Тренування" 
                    value="/workout/new" 
                    icon={<AddCircleIcon />} 
                />
                <BottomNavigationAction 
                    label="Профіль" 
                    value="/profile" 
                    icon={<PersonIcon />} 
                />
            </BottomNavigation>
        </Paper>
    );
};
