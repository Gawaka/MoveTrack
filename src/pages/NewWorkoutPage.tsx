import { Box, Typography, Button, Paper } from '@mui/material';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { Field } from 'react-final-form';

export default function NewWorkoutPage() {
    const navigate = useNavigate();

    const onSubmit = (values: any) => {
        console.log("Вибрані налаштування тренування:", values);
        // Пізніше ми тут додамо перехід на сторінку вибору вправ
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Заголовок */}
            <Box>
                <Typography variant="h4" gutterBottom sx={{ m: 0, fontWeight:"800" }}>
                    Новий день
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Налаштуй тренування перед додаванням вправ.
                </Typography>
            </Box>
            {/* Контейнер форми */}
            <Paper sx={{ p: 2 }}>
                <Form
                    onSubmit={onSubmit}
                    initialValues={{
                        programType: 'ppl',
                        category: 'home',
                        inventory: ['dumbbells', 'pullup_bar', 'bench']
                    }}
                    render={({ handleSubmit, values }) => (
                        <Box 
                            component="form" 
                            onSubmit={handleSubmit} 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 3 
                            }}>
                            {/* СЕКЦІЯ: ТИП ПРОГРАМИ */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Typography variant="h6" sx={{fontWeight: "bold"}}>💪Тип програми</Typography>
                                {/* ОПЦІЯ 1: Full body */}
                                <Field name="programType" type="radio" value="full_body">
                                    {({ input }) => {
                                        const isSelected = input.checked;
                                        return (
                                            <Box 
                                                onClick={() => input.onChange('full_body')}
                                                sx={{ 
                                                    p: 2, 
                                                    border: '1px solid', 
                                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                                    bgcolor: isSelected ? '#103125' : '#0d171c',
                                                    borderRadius: 2,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Typography sx={{fontWeight: "bold"}}>Full body</Typography>
                                                <Typography variant="caption" color="text.secondary">Все тіло</Typography>
                                            </Box>
                                        );
                                    }}
                                </Field>
                                <Field name="programType" type="radio" value="split">
                                    {({ input }) => {
                                        const isSelected = input.checked;
                                        return (
                                            <Box 
                                                onClick={() => input.onChange('split')}
                                                sx={{ 
                                                    p: 2, 
                                                    border: '1px solid', 
                                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                                    bgcolor: isSelected ? '#103125' : '#0d171c',
                                                    borderRadius: 2,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Typography sx={{fontWeight: "bold"}}>Спліт</Typography>
                                                <Typography variant="caption" color="text.secondary">Спліт-тренування</Typography>
                                            </Box>
                                        );
                                    }}
                                </Field>
                                {/* ОПЦІЯ 2: PPL */}
                                <Field name="programType" type="radio" value="ppl">
                                    {({ input }) => {
                                        const isSelected = input.checked;
                                        return (
                                            <Box 
                                                onClick={() => input.onChange('ppl')}
                                                sx={{ 
                                                    p: 2, border: '1px solid', borderRadius: 2, cursor: 'pointer',
                                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                                    bgcolor: isSelected ? '#103125' : '#0d171c',
                                                }}
                                            >
                                                <Typography sx={{fontWeight: "bold"}}>PPL</Typography>
                                                <Typography variant="caption" color="text.secondary">Push · Pull · Legs</Typography>
                                            </Box>
                                        );
                                    }}
                                </Field>
                            </Box>
                            {/* СЕКЦІЯ: КАТЕГОРІЯ */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Typography variant="h6" sx={{fontWeight: "bold"}}>Категорія</Typography>
                                    <Field name="category" type="radio" value="gym">
                                        {({ input }) => {
                                            const isSelected = input.checked;
                                            return (
                                                <Box 
                                                    onClick={() => input.onChange('gym')}
                                                    sx={{ 
                                                        p: 2, 
                                                        border: '1px solid', 
                                                        borderColor: isSelected ? 'primary.main' : 'divider',
                                                        bgcolor: isSelected ? '#103125' : '#0d171c',
                                                        borderRadius: 2,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Typography sx={{fontWeight: "bold"}}>🏋️ GYM</Typography>
                                                    <Typography variant="caption" color="text.secondary">Тренування в залі</Typography>
                                                </Box>
                                            );
                                        }}
                                    </Field>
                                    <Field name="category" type="radio" value="home">
                                        {({ input }) => {
                                            const isSelected = input.checked;
                                            return (
                                                <Box 
                                                    onClick={() => input.onChange('home')}
                                                    sx={{ 
                                                        p: 2, 
                                                        border: '1px solid', 
                                                        borderColor: isSelected ? 'primary.main' : 'divider',
                                                        bgcolor: isSelected ? '#103125' : '#0d171c',
                                                        borderRadius: 2,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Typography sx={{fontWeight: "bold"}}>🏠 Дім</Typography>
                                                    <Typography variant="caption" color="text.secondary">Домашне тренування</Typography>
                                                </Box>
                                            );
                                        }}
                                    </Field>
                                    <Field name="category" type="radio" value="bodyweight">
                                        {({ input }) => {
                                            const isSelected = input.checked;
                                            return (
                                                <Box 
                                                    onClick={() => input.onChange('bodyweight')}
                                                    sx={{ 
                                                        p: 2, 
                                                        border: '1px solid', 
                                                        borderColor: isSelected ? 'primary.main' : 'divider',
                                                        bgcolor: isSelected ? '#103125' : '#0d171c',
                                                        borderRadius: 2,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Typography sx={{fontWeight: "bold"}}>🤸 Власна вага</Typography>
                                                    <Typography variant="caption" color="text.secondary">Незабаром...</Typography>
                                                </Box>
                                            );
                                        }}
                                    </Field>
                                </Box>
                                {/* СЕКЦІЯ: ІНВЕНТАР */}
                                {values.category !== 'gym' && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Typography variant="h6" sx={{ mt: 1,  fontWeight: "bold" }}>
                                            Інвентар
                                        </Typography>
                                        {/* ОПЦІЯ 1: Гантелі */}
                                        <Field name="inventory" type="checkbox" value="dumbbells">
                                            {({ input }) => (
                                                <Box 
                                                    component="label"
                                                    sx={{ 
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, 
                                                        bgcolor: '#0d171c', cursor: 'pointer'
                                                    }}
                                                >
                                                    <Typography>Гантелі (набірні)</Typography>
                                                    <input 
                                                        type="checkbox" 
                                                        {...input} 
                                                        style={{ accentColor: '#35df88', width: 20, height: 20 }} 
                                                    />
                                                </Box>
                                            )}
                                        </Field>
                                        {/* ОПЦІЯ 2: Турнік */}
                                        <Field name="inventory" type="checkbox" value="pullup_bar">
                                            {({ input }) => (
                                                <Box 
                                                    component="label" 
                                                    sx={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'center', p: 1.5, 
                                                        border: '1px solid', 
                                                        borderColor: 'divider', 
                                                        borderRadius: 2, 
                                                        bgcolor: '#0d171c', 
                                                        cursor: 'pointer' 
                                                        }}>
                                                    <Typography>Турнік</Typography>
                                                    <input type="checkbox" {...input} style={{ accentColor: '#35df88', width: 20, height: 20 }} />
                                                </Box>
                                            )}
                                        </Field>
                                        {/* ТУТ БУДЕ ОПЦІЯ 3 ТА 4 */}
                                    </Box>
                                )}
                            {/* Кнопки дій */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                                <Button variant="contained" type="submit" size="large">
                                    Далі — додати вправи
                                </Button>
                                <Button variant="outlined" color="inherit" onClick={() => navigate(-1)} size="large">
                                    Скасувати
                                </Button>
                            </Box>
                        </Box>
                    )}
                />
            </Paper>
        </Box>
    );
}