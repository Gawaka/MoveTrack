import { Box, Typography, TextField, Button, Container, Alert, Link } from '@mui/material';
import { Form, Field } from 'react-final-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import logo from '../../public/logo_title.png';


export default function LoginPage() {
    const navigate = useNavigate();
    const [authError, setAuthError] = useState<string | null>(null);

    const onSubmit = async (values: any) => {
        setAuthError(null);
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            navigate('/')
        } catch (error: any) {
            console.error("Помилка входу:", error);
            setAuthError("Невірний email або пароль");
        }
    };

    return (
        <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Form 
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                    <Box 
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                    <Link component={RouterLink} to="/" sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                            <Box
                                component="img"
                                src={logo}
                                alt="Логотип сайту"
                                sx={{
                                    height: 55,
                                    width: 'auto',
                                    maxWidth: '100%',
                                }}
                            />
                        </Link>
                        <Typography variant="h4" align="center" gutterBottom>
                            Вхід
                        </Typography>
                        {authError && <Alert severity="error">{authError}</Alert>}
                        <Field name='email'>
                            {({ input }) => (
                                <TextField
                                    {...input}
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    type="email"
                                />
                            )}
                        </Field>
                        <Field name='password'>
                            {({ input }) => (
                                <TextField
                                    {...input}
                                    label="Пароль"
                                    variant="outlined"
                                    fullWidth
                                    type="password"
                                />
                            )}
                        </Field>
                        <Button
                            variant="contained"
                            fullWidth
                            type="submit"
                            size="large"
                        >
                            Увійти
                        </Button>
                        <Typography align="center" sx={{ mt: 2 }}>
                            Немає акаунту?{' '}
                            <RouterLink to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                Зареєструйтесь
                            </RouterLink>
                        </Typography>
                    </Box>
                )}
            />
        </Container>
    );
}