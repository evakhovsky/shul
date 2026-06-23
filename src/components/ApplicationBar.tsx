import React, { MouseEvent } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginDlg from './authentication/LoginDlg';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled, alpha } from '@mui/material/styles';
import { MenuProps } from '@mui/material/Menu';
import { authenticationService } from '../components/shared/services/Authenticationservice';
import { useAppBar } from '../components/shared/AppBarContext';
import { useLocation } from 'react-router-dom';
import { routeConfig } from './shared/routeConfig';
import { routesMap } from './shared/routeConfig';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
  const [anchorElMobile, setAnchorElMobile] = React.useState<null | HTMLElement>(null);
  const openMobile = Boolean(anchorElMobile);
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

  const handleClose = () => {
    setAnchorEl(null);    
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

const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (value: string) => {
    console.log(`Selected action: ${value}`);
    handleClose();
  };

  const renderMobileMenuListItem = (title: string, path: string) => {
    if(!routeConfig.isPublicRouter(path) && !authenticationService.isUserLoggedIn()){
      return;
    }

    return (<ListItem key={title} disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={handleDrawerToggle} >
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

  interface DropdownOption {
    value: string;
    label: string;
  }

  const options: DropdownOption[] = [
    { value: 'profile', label: 'My Profile' },
    { value: 'settings', label: 'Account Settings' },
    { value: 'logout', label: 'Logout' },
  ];

  const renderAdmindropdown = () => {
    if(!authenticationService.isAdministrator()){
      return;
    }

    return (
    <>
      <Button
        id="dropdown-button"
        aria-controls={open ? 'dropdown-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleMenuClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Admin
      </Button>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'dropdown-button',
        }}
        // Aligns the menu cleanly below the button
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            onClick={() => handleItemClick(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
  }

  const renderAdmindropdownMobile = () => {
    if(!authenticationService.isAdministrator()){
      return;
    }
    
    return (
    <List sx={{ width: 250, bgcolor: 'background.paper' }}>
      {/* Container List Item */}
      <ListItem disablePadding>
        <ListItemButton
          id="list-dropdown-button"
          aria-controls={openMobile ? 'list-dropdown-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openMobile ? 'true' : undefined}
          onClick={handleMenuClick}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Admin" />
          <KeyboardArrowDownIcon />
        </ListItemButton>
      </ListItem>

      {/* The Menu remains completely detached from the visual layout flow */}
      <Menu
        id="list-dropdown-menu"
        anchorEl={anchorElMobile}
        open={openMobile}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'list-dropdown-button',
        }}
        // Positions the dropdown cleanly underneath the list item row
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            onClick={() => handleItemClick(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </List>
  );
  }


  const isUserLoggedIn = (): boolean => {
    return authenticationService.isUserLoggedIn();
  }

  const getLoginName = (): string => {
    return authenticationService.getUserFirstName();
  }

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {authenticationService.getEntityAbbreviation()}
      </Typography>
      <Divider />
      <List>
          {renderMobileMenuListItem("Home", routesMap.home)}
          {renderMobileMenuListItem("Profile", routesMap.account)}
          {renderMobileMenuListItem("Your Donations", routesMap.userDonations)}
          {renderMobileMenuListItem("Donate", routesMap.paypal)}
          {renderMobileLoginMenuListItem()}
          {renderMobileMenuListItem("Contact Us", routesMap.contactUs)}
          {renderAdmindropdownMobile()}
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
             {authenticationService.getEntityAbbreviation()}
          </Typography>          
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {renderDesktopMenuButton("Home", handleMenuButtonClick, routesMap.home)}
            {renderDesktopMenuButton("Profile", handleMenuButtonClick, routesMap.account)}
            {renderDesktopMenuButton("Your Donations", handleMenuButtonClick, routesMap.userDonations)}
            {renderDesktopMenuButton("Donate", handleMenuButtonClick, routesMap.paypal)}            
            {renderLoginMenuButton()}
            {renderDesktopMenuButton("Contact Us", handleMenuButtonClick, routesMap.contactUs)}
            {renderAdmindropdown()}
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
