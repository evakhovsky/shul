import { Navbar,Nav } from 'react-bootstrap'
import authenticationService from './shared/services/authentication.service'
import { useLocation } from 'react-router-dom'
import LoginComponent from './authentication/Login';
import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from '@mui/material/FormControl';
import { Navigate } from "react-router-dom";

function BootstrapNavbar(props) {

  const [showLogin, setShowLogin] = useState(false);
  const [loggedInFirstName, setLoggedInFirstName] = useState('');
  const location = useLocation();
  console.log(location.pathname);
  const tokenHandler = null;
  const isPublicRouter = true;  

  const handleLogin = event => {
    setShowLogin(true);
    window.helloComponent.openModal();
  }

  const handleLogout = event => {
    authenticationService.logout();
    setShowLogin(false);
    setLoggedInFirstName(null);
    window.location.reload();
  }

  const renderHome = () => {
    console.log("checking if " + location.pathname + " is public router");
    /*if(isPublicRouter(location.pathname)){
      console.log(location.pathname + " is public router");
      return;
    }*/

    if (!loggedInFirstName) {
      console.log(location.pathname);
      console.log("redirecting home");
      return <Navigate to="" />;
    }
  }

  const isUserLoggedIn = () => {
    if(!authenticationService.isUserLoggedIn()){
      return false;
    }

    if(!loggedInFirstName){
      var firstName = authenticationService.getUserFirstName();
      if(!firstName){
        return false;
      }

      setLoggedInFirstName(authenticationService.getUserFirstName());
    }
    
    return true;
  }

  const renderLogin = () => {
    if (!isUserLoggedIn()) {
      return <Nav.Link onClick={handleLogin}>Login</Nav.Link>;
    }

    return <Nav.Link onClick={handleLogout}>Logout {loggedInFirstName}</Nav.Link>;    
  }

  const renderYourDonations = () => {
    if (!isUserLoggedIn()) {
      return;
    }
    
    return <Nav.Link href="/userDonations">Your donations</Nav.Link>;    
  }

  const renderAccount = () => {
    if (!isUserLoggedIn()) {
      return;
    }
    
    return <Nav.Link href="/account">Profile</Nav.Link>;    
  }
  
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Nav.Link
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </Nav.Link>
  ));
  
  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );

  const handleSelectDropDown=(e)=>{
    switch(e) {
      case 'Roles':
        console.log(e);
        window.location.href="/menageRoles"
        return;
      case 'MenageProjects':
        window.location.href="/menageProjects"
        console.log(e);        
        return;
      case 'ContractorProjects':
          window.location.href="/contractorProjects"
          console.log(e);        
          return;
      case 'TestIPN':
        window.location.href="/testIPN"
        console.log(e);
        return;
      case 'ManageSchedule':
        window.location.href="/scheduler"
        console.log(e);
        return;
      case 'PostOnHomePage':
        window.location.href="/homepagepost/"
        console.log(e);
        return;
      case 'HomepageAds':
        window.location.href="/homepageAds"
        console.log(e);
            return;
      case 'ClassifiedAdsAdmin':
        window.location.href="/classifiedAdsAdmin"
        console.log(e);
        return;            
      case "ClassifiedPostHome":
        window.location.href = "/classifiedPostHome"
        console.log(e);
        return;
      case 'CfgVar':
        window.location.href="/configVariables"
        console.log(e);
        return;
      case 'PayPalAdmin':
          window.location.href="/payPalAdmin"
          console.log(e);
          return;
      default:
        return;
    }
  }

  const renderSuperUserDropDown = (key, label) => {
    if(!authenticationService.isSuperUser()){
      console.log('not a super user');
      return;
    }

    return(
      <Dropdown.Item eventKey={key} onSelect={handleSelectDropDown}>{label}</Dropdown.Item>
    );
  }

  const renderAdminDropDown = () => {
    if(!authenticationService.isUserLoggedIn() || !authenticationService.isAdministrator()){
      return;
    }

    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" >
          Admin
        </Dropdown.Toggle>
        <Dropdown.Menu as={CustomMenu} style={{
              // Fixes the overlapping problem of the component
              zIndex: 1001}}>
          {renderSuperUserDropDown("Roles","Roles")}
          {renderSuperUserDropDown("MenageProjects", "User Projects")}
          {renderSuperUserDropDown("ContractorProjects", "Contractor Projects")}
          <Dropdown.Item eventKey="ManageSchedule" onSelect={handleSelectDropDown}>Manage Schedule</Dropdown.Item>
          <Dropdown.Item eventKey="HomepageAds" onSelect={handleSelectDropDown}>Homepage Ads</Dropdown.Item>
          <Dropdown.Item eventKey="ClassifiedAdsAdmin" onSelect={handleSelectDropDown}>Classifieds</Dropdown.Item>
          {renderSuperUserDropDown("TestIPN", "Test IPN (Developer Only)")}
          {renderSuperUserDropDown("CfgVar", "Config Variables")}
          <Dropdown.Item eventKey="PayPalAdmin" onSelect={handleSelectDropDown}>PayPal Admin</Dropdown.Item>          
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  const renderPostDropDown = () => {
    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-post-components" >
          Post
        </Dropdown.Toggle>
        <Dropdown.Menu as={CustomMenu}>
            <Dropdown.Item eventKey="PostOnHomePage" onSelect={handleSelectDropDown}>Post on Home Page</Dropdown.Item>
            <Dropdown.Item eventKey="ClassifiedPostHome" onSelect={handleSelectDropDown}>Post classified</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
      <div>
      <div className="row">
          <div className="col-md-12">
              <Navbar bg="light" collapseOnSelect expand="lg" >
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/shulSchedule">Schedule</Nav.Link>
                    <Nav.Link href="/classifiedsMainViewer">Classifieds</Nav.Link>
                    <Nav.Link href="/paypal">Donate</Nav.Link>
                    {renderYourDonations()}
                    {renderAccount()}
                    {renderPostDropDown()}
                    {renderLogin()}
                    <LoginComponent showLogin={showLogin} tokenHandler={tokenHandler}/>
                    <Nav.Link href="/help">Help</Nav.Link>                    
                    {renderAdminDropDown()}
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
                  <br />
          </div>
      </div>
      {renderHome()}
  </div>
  )
}
export default BootstrapNavbar