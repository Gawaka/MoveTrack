import { Box, Typography, Button, Paper } from '@mui/material';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { Field } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { setDraft } from '../store/workoutSlice';
import { type ProgramType } from '../types/types';

interface ProgramConfig {
    id: ProgramType;
    title: string;
    description: string;
};

interface TrainingConfigType {
    id: string;
    title: string;
    description: string;
}

interface TrainingConfigType {
    id: string;
    title: string;
    description: string;
}

const TRAINING_CATEGORY_CONFIG: TrainingConfigType[] = [
    { 
        id: 'gym',
        title: '🏋️ GYM', 
        description: 'Тренування в залі' 
    },
    { 
        id: 'home', 
        title: '🏠 Дім', 
        description: 'Домашнє тренування' 
    },
    { 
        id: 'bodyweight', 
        title: '🤸 Власна вага', 
        description: 'Тренування із власною вагою'
    },
];

const PROGRAMS_CONFIG: ProgramConfig[] = [
    {
        id: 'fullbody',
        title: 'Full body',
        description: 'Все тіло',
    },
    {
        id: 'ppl',
        title: 'PPL',
        description: 'Push · Pull · Legs',
    },
    {
        id: 'split',
        title: 'Спліт',
        description: 'Спліт-тренування',
    },
    {
        id: 'upper_lower',
        title: 'Верх-низ',
        description: 'Спліт-Upper/Lower',
    },
    {
        id: 'circuit_traning',
        title: 'Циклічне тренування',
        description: 'Циклічне тренування/Circuit traning',
    }
];


export default function NewWorkoutPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = (values: any) => {
        console.log("Вибрані налаштування тренування:", values);
        dispatch(setDraft(values));
        navigate('/workout/exercises');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Title */}
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box>   
                    <Typography variant="h4" gutterBottom sx={{ m: 0, fontWeight:"800" }}>
                        Новий день
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Налаштуй тренування перед додаванням вправ.
                    </Typography>
                </Box>
                <Button variant="contained" sx={{height: '30px'}} onClick={() => navigate('/')}>
                    Назад
                </Button>
            </Box>
            {/* Form box */}
            <Paper sx={{ p: 2 }}>
                <Form
                    onSubmit={onSubmit}
                    initialValues={{
                        programType: 'ppl',
                        category: 'gym',
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
                            {/* section: Program type */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Typography variant="h6" sx={{fontWeight: "bold"}}>💪Тип програми</Typography>
                                {PROGRAMS_CONFIG.map(program=> (
                                    <Field key={program.id} name="programType" type="radio" value={program.id}>
                                        {({ input }) => {
                                            const isSelected = input.checked;
                                            return (
                                                <Box 
                                                    onClick={() => input.onChange(program.id)}
                                                    sx={{ 
                                                        p: 2, 
                                                        border: '1px solid', 
                                                        borderColor: isSelected ? 'primary.main' : 'divider',
                                                        bgcolor: isSelected ? '#103125' : '#0d171c',
                                                        borderRadius: 2,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Typography sx={{fontWeight: "bold"}}>{program.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{program.description}</Typography>
                                                </Box>
                                            );
                                        }}
                                    </Field>
                                ))}
                            </Box>
                            {/* section: Category(GYM, HOME...) */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Typography variant="h6" sx={{fontWeight: "bold"}}>Категорія</Typography>
                                {TRAINING_CATEGORY_CONFIG.map(category=> (
                                <Field key={category.id} name="category" type="radio" value={category.id}>
                                        {({ input }) => {
                                            const isSelected = input.checked;
                                            return (
                                                <Box 
                                                    onClick={() => input.onChange(category.id)}
                                                    sx={{ 
                                                        p: 2, 
                                                        border: '1px solid', 
                                                        borderColor: isSelected ? 'primary.main' : 'divider',
                                                        bgcolor: isSelected ? '#103125' : '#0d171c',
                                                        borderRadius: 2,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Typography sx={{fontWeight: "bold"}}>{category.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{category.description}</Typography>
                                                </Box>
                                            );
                                        }}
                                    </Field>
                                ))}
                                </Box>
                                {/* Inventory */}
                                {values.category !== 'gym' && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Typography variant="h6" sx={{ mt: 1,  fontWeight: "bold" }}>
                                            Інвентар
                                        </Typography>
                                        {/* option 1*/}
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
                                        {/* option 2*/}
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
                                    </Box> 
                                )}
                            {/* action btns */}
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
};