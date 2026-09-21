import { AppBar, Toolbar, Typography, Box, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../../config/firebase';
import { clearUser } from '../../store/authSlice';
import logo from '../../../public/logo.svg';


export default function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async ()=> {
        try{
            await signOut(auth);
            dispatch(clearUser());
            navigate('/login', {replace: true})
        } catch(error) {
            console.error('Помилка виходу:', error);
        }
    } ;


    return(
        <>
            <AppBar position="static">
                <Toolbar>
                <Typography variant="h6" component="div"  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center'}}>
                    <Box
                        component="img"
                        src={logo}
                        alt="Логотип сайту"
                        sx={{
                            height: 20,
                            width: 50,
                            maxWidth: '100%',
                        }}
                        />
                        MoveTrack
                </Typography>
                <Button 
                    variant="text" 
                    onClick={() => handleLogout()}
                >
                    Вихід
                </Button>
                </Toolbar>
            </AppBar>
        </>
    );
};