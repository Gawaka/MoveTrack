import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from '../components/Header/Header';
import BottomNav from '../components/BottomNav/BottomNav';

export default function MainLayout() {
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header/>
                <Container 
                    component="main" 
                    maxWidth="sm"
                    sx={{ flexGrow: 1, p: 2, pb: 9,  }}
                >
                    <Outlet/>
                </Container>
            </Box>
            <BottomNav/>
        </>
    );
};