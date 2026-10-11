import { AppBar, Toolbar, Typography, Box} from '@mui/material';
import logo from '../../assets/logo.svg';

export default function Header() {

    return(
        <>
            <AppBar position="static">
                <Toolbar>
                <Typography variant="h6" component="div"  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center'}}>
                    <Box
                        component="img"
                        src={logo}
                        alt="Logo"
                        sx={{
                            height: 20,
                            width: 50,
                            maxWidth: '100%',
                        }}
                        />
                        MoveTrack
                </Typography>
                </Toolbar>
            </AppBar>
        </>
    );
};