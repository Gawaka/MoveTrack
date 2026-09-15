import { Box, Typography, TextField, Button, Container, Alert, Link } from '@mui/material';
import { Form, Field } from 'react-final-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import { auth } from '../config/firebase';
import logo from '../../public/logo_title.png';

export default function RegisterPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [authError, setAuthError] = useState<string | null>(null);

    const validate = (values: any) => {
        const errors: any = {};
        if (!values.email) errors.email = 'Email обовʼязковий';
        if (!values.password) errors.password = 'Пароль обовʼязковий';
        if (values.password !== values.confirmPassword) {
            errors.confirmPassword = 'Паролі не збігаються';
        }
        return errors;
    };

    const onSubmit = async (values: any) => {
        setAuthError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            if (values.displayName) {
                await updateProfile(userCredential.user, {
                    displayName: values.displayName
                });
                dispatch(setUser({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    displayName: values.displayName
                }));
            }
            navigate('/');
        } catch (error: any) {
            console.error("Помилка реєстрації:", error);
            setAuthError("Не вдалося створити акаунт. Можливо, такий email вже існує або пароль занадто легкий.");
        }
    };

    return (
        <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Form 
                onSubmit={onSubmit}
                validate={validate}
                render={({ handleSubmit }) => (
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                            Реєстрація
                        </Typography>
                        {authError && <Alert severity="error">{authError}</Alert>}
                        <Field name='email'>
                            {({ input, meta }) => (
                                <TextField
                                    {...input}
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    type="email"
                                    error={meta.touched && Boolean(meta.error)}
                                    helperText={meta.touched && meta.error}
                                />
                            )}
                        </Field>
                        <Field name='displayName'>
                            {({ input, meta }) => (
                                <TextField
                                    {...input}
                                    label='Імʼя або нікнейм'
                                    variant='outlined'
                                    fullWidth
                                    type='text'
                                    error={meta.touched && Boolean(meta.error)}
                                    helperText={meta.touched && meta.error}
                                />
                            )}
                        </Field>
                        <Field name='password'>
                        {({input, meta})=> (
                            <TextField
                                {...input}
                                label='Придумайте пароль'
                                variant='outlined'
                                fullWidth
                                type='password'
                                error={meta.touched && Boolean(meta.error)}
                                helperText={meta.touched && meta.error}
                            />
                            )}
                        </Field>
                        <Field name='confirmPassword'>
                            {({input, meta})=> (
                                <TextField
                                    {...input}
                                    label='Підтвердіть пароль'
                                    variant='outlined'
                                    fullWidth
                                    type='password'
                                    error={meta.touched && Boolean(meta.error)}
                                    helperText={meta.touched && meta.error}
                                />
                            )}
                        </Field>
                        <Button variant="contained" fullWidth type="submit" size="large">
                            Зареєструватися
                        </Button>
                        <Typography align="center" sx={{ mt: 2 }}>
                            Вже є акаунт?{' '}
                            <RouterLink to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                Увійдіть
                            </RouterLink>
                        </Typography>
                    </Box>
                )}
            />
        </Container>
    );
};