import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';

export default function MainLayout() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            
            <AppBar position="static">
                <Toolbar>
                <Typography variant="h6" component="div"  sx={{ flexGrow: 1,}}>
                    MoveTrack
                </Typography>
                </Toolbar>
            </AppBar>
            <Container 
                component="main" 
                maxWidth="sm"
                sx={{ flexGrow: 1, py: 2 }}
            >
                <Outlet/>
            </Container>
        </Box>
    );
};