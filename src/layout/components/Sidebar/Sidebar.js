import React, { useContext, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import  {ConfirmationNumber,Schedule,Mms, AspectRatio } from '@material-ui/icons'
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import { List, LinearProgress } from '@material-ui/core';


//https://material-ui.com/components/material-icons/
//https://material.io/resources/icons/?style=baseline
import { SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    background: '#e6e6fa',
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
  listroot: {

  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, closeDrawer, ...rest } = props;

  const classes = useStyles();

  const nav_links = [
    {
      title: 'Test',
      href: '/test',
      icon: (<DashboardIcon />)
    },
    {
      title: 'Printer Demo',
      href: '/printer-demo',
      icon: (<AspectRatio />)
    }
  ];


  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}>
        
        
        <Divider className={classes.divider} />

        <List>
          { 
            nav_links.map(item => 
              <SidebarNav
                key={item.title}
                title={item.title}
                icon={item.icon}
                to={item.href}
                clicked={onClose}/>
            ) 
          }
        </List>
        
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
