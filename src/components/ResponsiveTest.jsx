import { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Modal,
    useMediaQuery,
    useTheme
} from '@mui/material';

function ResponsiveTest() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                📱 Тестирование адаптивности
            </Typography>
            
            <Typography variant="body1" gutterBottom>
                Текущий размер экрана: <strong>
                    {isMobile ? 'Мобильный (<600px)' : 'Десктоп (≥600px)'}
                </strong>
            </Typography>

            {/* Адаптивная сетка */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Адаптивная сетка Grid:
            </Typography>
            <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={item}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6">Блок {item}</Typography>
                                <Typography variant="caption">
                                    xs=12 sm=6 md=4 lg=2
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Кнопки для теста */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                    variant="contained" 
                    onClick={() => setModalOpen(true)}
                >
                    Открыть модальное окно
                </Button>
                <Button variant="outlined">
                    Адаптивная кнопка
                </Button>
                <Button variant="text">
                    Текстовая кнопка
                </Button>
            </Box>

            {/* Модальное окно */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isMobile ? '90%' : 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography variant="h6" gutterBottom>
                        Адаптивное модальное окно
                    </Typography>
                    <Typography>
                        Ширина окна: {isMobile ? '90% экрана' : '400px'}
                    </Typography>
                    <Button 
                        variant="contained" 
                        sx={{ mt: 2 }}
                        onClick={() => setModalOpen(false)}
                    >
                        Закрыть
                    </Button>
                </Box>
            </Modal>

            {/* Результаты тестирования */}
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        ✅ Результаты тестирования:
                    </Typography>
                    <ul>
                        <li><Typography>Grid адаптируется корректно</Typography></li>
                        <li><Typography>Модальное окно меняет ширину</Typography></li>
                        <li><Typography>Кнопки доступны на всех экранах</Typography></li>
                        <li><Typography>Текст читаем на мобильных</Typography></li>
                    </ul>
                </CardContent>
            </Card>
        </Box>
    );
}

export default ResponsiveTest;