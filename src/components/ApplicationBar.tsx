import React, { MouseEvent } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginDlg from './authentication/LoginDlg';
import MenuItem from '@mui/material/MenuItem';
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import LoginIcon from '@mui/icons-material/Login';
import { authenticationService } from '../components/shared/services/Authenticationservice';
import { useAppBar } from '../components/shared/AppBarContext';
import { useLocation } from 'react-router-dom';
import { routeConfig } from './shared/routeConfig';
import { routesMap } from './shared/routeConfig';
import { useNavigate } from 'react-router-dom';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  
}

const drawerWidth = 240;

export default function ApplicationBar(props: Props) {
  
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [, forceUpdate] = React.useState({}); // Dummy state variable
  const { title } = useAppBar();
  const location = useLocation();
  const navigate = useNavigate();

  const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
        ...theme.applyStyles('dark', {
          color: 'inherit',
        }),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));

  const handleDrawerToggle = () => {
    console.log('handleDrawerToggle');
    setMobileOpen((prevState) => !prevState);
  };

  const handleLoginDesktop = (event: React.MouseEvent<HTMLElement>) => {
    if(!isUserLoggedIn()){
      handleLogin();
    }

    authenticationService.logout();      
    forceUpdate({}); // Update the dummy state to trigger re-render      
  };

  const handleClose = (menuClicked: string) => {
    setAnchorEl(null);
    console.log(menuClicked);
  };

  const handleLogin = () => {
    console.log('handleLogin');
    setAnchorEl(null);
    setShowLogin(true);
  }

  const handleMobileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('List item clicked:', event.currentTarget.innerText);

    menuNavigate(event.currentTarget.innerText);
  }

  const renderMobileMenuListItem = (title: string, path: string) => {
    if(!routeConfig.isPublicRouter(path) && !authenticationService.isUserLoggedIn()){
      return;
    }

    return (<ListItem key={title} disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary={title} onClick={handleMobileMenuClick}/>
          </ListItemButton>
        </ListItem>    
    );
  }

  const renderMobileLoginMenuListItem = () => {
    let title: string = 'Login';

    if(isUserLoggedIn()){
      title = 'Logout ' + getLoginName();
    }

    return (<ListItem key={title} disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary={title} onClick={handleLoginDesktop}/>
          </ListItemButton>
        </ListItem>    
    );
  }

  const renderLoginMenuButton = () => {
    if(!isUserLoggedIn()){
      return (<Button key='Login' sx={{ color: '#fff' }} onClick={handleLoginDesktop}>
              Login
            </Button>
      );
    }
    
    return (<Button key='Login' sx={{ color: '#fff' }} onClick={handleLoginDesktop}>
              {'Logout ' + getLoginName()}
            </Button>
      );
  } 

  const handleMenuButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    const clickedButton = event.currentTarget; 
    const buttonTitle = clickedButton.textContent; 

    console.log(`Button with title "${buttonTitle}" was clicked.`);
    
    menuNavigate(buttonTitle);
  };

  const menuNavigate = (title: string | null) => {
    switch(title)
    {
      case "Home":
        navigate(routesMap.home);
        break;
      case "Donate":
        navigate(routesMap.paypal);
        break;
      case "Your Donations":
        navigate(routesMap.userDonations);
        break;
      case "Profile":
        navigate(routesMap.account);
        break;
      case "Contact Us":
        navigate(routesMap.contactUs);
        break;
    }
  }

  const renderDesktopMenuButton = (title: string, onclick: (event: React.MouseEvent<HTMLButtonElement>) => void, path:string) => {
    if(!routeConfig.isPublicRouter(path) && !authenticationService.isUserLoggedIn()){
      return;
    }

    return (<Button key={title} sx={{ color: '#fff' }} onClick={onclick}>
              {title}
            </Button>
    );
  }

  const isUserLoggedIn = (): boolean => {
    return authenticationService.isUserLoggedIn();
  }

  const getLoginName = (): string => {
    return authenticationService.getUserFirstName();
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
          {renderMobileMenuListItem("Home", routesMap.home)}
          {renderMobileMenuListItem("Profile", routesMap.account)}
          {renderMobileMenuListItem("Your Donations", routesMap.userDonations)}
          {renderMobileMenuListItem("Donate", routesMap.paypal)}
          {renderMobileLoginMenuListItem()}
          {renderMobileMenuListItem("Contact Us", routesMap.contactUs)}
      </List>
    </Box>
  );

  const handleOnCloseLoginDlg = () => {
    console.log('handleOnCloseLoginDlg');
    setShowLogin(false);    
  };

  const renderCurrentURL = () => {
    console.log('location.pathname');
    console.log(location.pathname);
    if(!routeConfig.isPublicRouter(location.pathname)){
      switch(location.pathname){
        case routesMap.userDonations:
        case routesMap.account:
          if(authenticationService.isUserLoggedIn()){
            return;
          }
      }
      menuNavigate("Home");
      return;
    }

    return(<div></div>);
  };

  return (
    <div>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            MUI
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <StyledMenu
              id="demo-customized-menu"
              slotProps={{
              list: {
                'aria-labelledby': 'demo-customized-button',
              },
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
          <MenuItem onClick={handleLogin} disableRipple>
            <LoginIcon />
            Login
          </MenuItem>
          <MenuItem onClick={() => handleClose("copy")} disableRipple>
            <FileCopyIcon />
            Duplicate
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={() => handleClose("archive")} disableRipple>
          <ArchiveIcon />
            Archive
          </MenuItem>
          <MenuItem onClick={() => handleClose("horizon")} disableRipple>
            <MoreHorizIcon />
            More
          </MenuItem>
        </StyledMenu>
            {renderDesktopMenuButton("Home", handleMenuButtonClick, routesMap.home)}
            {renderDesktopMenuButton("Profile", handleMenuButtonClick, routesMap.account)}
            {renderDesktopMenuButton("Your Donations", handleMenuButtonClick, routesMap.userDonations)}
            {renderDesktopMenuButton("Donate", handleMenuButtonClick, routesMap.paypal)}            
            {renderLoginMenuButton()}
            {renderDesktopMenuButton("Contact Us", handleMenuButtonClick, routesMap.contactUs)}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Typography>
          {renderCurrentURL()}
        </Typography>
      </Box>      
    </Box>
    <LoginDlg open={showLogin} 
              onClose={handleOnCloseLoginDlg}/>
    </div>
  );
}
