import { useState } from 'react';
import {
    Snackbar,
    Alert,
    Button,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import {
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon
} from '@mui/icons-material';

function NotificationSystem() {
    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState({
        message: '',
        severity: 'info',
        duration: 6000
    });

    const showNotification = (message, severity = 'info', duration = 6000) => {
        setNotification({ message, severity, duration });
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const iconMap = {
        success: <CheckCircleIcon fontSize="small" />,
        error: <ErrorIcon fontSize="small" />,
        warning: <WarningIcon fontSize="small" />,
        info: <InfoIcon fontSize="small" />
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                🔔 Система уведомлений
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Демонстрация разных типов уведомлений
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={() => showNotification('Успешное сохранение!', 'success', 4000)}
                >
                    Успех
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => showNotification('Ошибка загрузки', 'error', 8000)}
                >
                    Ошибка
                </Button>
                <Button 
                    variant="contained" 
                    color="warning" 
                    onClick={() => showNotification('Внимание: срок истекает', 'warning', 5000)}
                >
                    Предупреждение
                </Button>
                <Button 
                    variant="contained" 
                    color="info" 
                    onClick={() => showNotification('Новое обновление доступно', 'info', 3000)}
                >
                    Информация
                </Button>
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={notification.duration}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                    icon={iconMap[notification.severity]}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2">
                    <strong>Типы уведомлений:</strong>
                </Typography>
                <ul>
                    <li><Typography variant="body2">✅ Success — успешные операции</Typography></li>
                    <li><Typography variant="body2">❌ Error — критические ошибки</Typography></li>
                    <li><Typography variant="body2">⚠️ Warning — предупреждения</Typography></li>
                    <li><Typography variant="body2">ℹ️ Info — информационные сообщения</Typography></li>
                </ul>
            </Box>
        </Box>
    );
}

export default NotificationSystem;