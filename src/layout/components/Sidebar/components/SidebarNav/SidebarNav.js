/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef, useMemo } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Button, colors } from '@material-ui/core';
import { Link } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  root: {
    // marginBottom: theme.spacing(2)
    // background: 'lightblue'
    // padding: '0px'
  },
  item: {
    display: 'flex',
    paddingTop: 10,
    paddingBottom: 0,
    '&:hover $button': {
      fontSize: '12pt'
    }
  },
  // ItemText: {},
  button: {
    color: colors.blueGrey[800],
    // padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontSize: '12pt',
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { title, to, icon, clicked } = props;

  const classes = useStyles();


  // const renderLink = React.useMemo(
  //   () =>
  //     React.forwardRef((linkProps, ref) => (
  //       <Link ref={ref} to={to} {...linkProps} />
  //     )),
  //   [to],
  // );

  return (
    <ListItem
      className={classes.item}
      disableGutters
      key={title}>
      
      <Button
        activeClassName={classes.active}
        className={classes.button}
        component={CustomRouterLink}
        to={to}
        onClick={clicked}>

        <div className={classes.icon}>{icon}</div>
        {title}

      </Button>

    </ListItem>


    // <ListItem
    //   button
    //   className={classes.item}
    //   disableGutters
    //   key={title}
    //   component={renderLink}>

    //   <ListItemIcon>
    //     {icon}
    //   </ListItemIcon>

    //   <ListItemText primary={title} className={classes.ItemText} />

    // </ListItem>

  );
};

SidebarNav.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.element,
};

export default SidebarNav;
