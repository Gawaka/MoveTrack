import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#35df88',
            dark: '#0f9d5a',
            contrastText: '#07140e'
        },
        error: { main: '#ff5c67' },
        background: { 
            default: '#05090b',
            paper: '#101a20'
        },
        text: { 
            primary: '#f5f7f7',
            secondary: '#8fa2a8'
        },
        divider: '#24343b',
    },
    typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        button: { 
            textTransform: 'none',
            fontWeight: 700 
        },
    },
    shape: { 
        borderRadius: 12
    },
    components: {
        MuiPaper: {
        styleOverrides: {
            root: {
            backgroundImage: 'none',
            border: '1px solid #24343b',
            // borderRadius: 18,
            }
        }
        },
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 13 },
            }
        }
    }
});