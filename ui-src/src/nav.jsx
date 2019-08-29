import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import PersonIcon from '@material-ui/icons/Person'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import LoginContainer from './hApps/login/containers/loginContainer'
import PersonasContainer from './hApps/personas-profiles/containers/personasContainer'
import PersonaContainer from './hApps/personas-profiles/containers/personaContainer'
import ProfileContainer from './hApps/personas-profiles/containers/profileContainer'
import ProfilesContainer from './hApps/personas-profiles/containers/profilesContainer'
import DeepKeyOverviewContainer from './hApps/deepkey/containers/deepKeyContainer'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  }
}))

function Navigation(props) {
  const { container } = props
  const classes = useStyles()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen)
  }

  function handleClickListItem(history, path) {
    history.push(path)
    setMobileOpen(false)
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
          <Route render={({ history}) => (
            <div>
              <ListItem button onClick={() => { handleClickListItem(history,'/deepkey') }}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='Deep Key' />
              </ListItem>
              <ListItem button onClick={() => { handleClickListItem(history, '/personas') }}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='Personas' />
              </ListItem>
              <ListItem button onClick={() => { handleClickListItem(history,'/profiles') }}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='Profiles' />
              </ListItem>
              <ListItem button onClick={() => { handleClickListItem(history,'/login') }}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='Login' />
              </ListItem>
            </div>
          )} />
      </List>
    </div>
  )

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Route render={({ history}) => (
            <Typography variant="h6" onClick={() => { history.push('/') }}>
              Holochain Identity Manager
            </Typography>
          )} />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route exact path='/login' title='Holo' render={props =>
          <div>
            <LoginContainer {...props} />
          </div>
        } />
        <Route path='/personas' component={PersonasContainer} />
        <Route path='/persona/:name' component={PersonaContainer} />
        <Route path='/profiles' component={ProfilesContainer} />
        <Route exact path='/profile/:hash' render={ props =>
          <ProfileContainer {...props} />
        } />
        <Route exact path='/profile/:hash/:returnUrl' render={ props =>
          <ProfileContainer {...props} />
        } />
        <Route path='/deepkey' component={DeepKeyOverviewContainer} />
        <Route exact path='/' render={ props =>
          <div>
            <PersonasContainer {...props} />
            <ProfilesContainer {...props} />
            <DeepKeyOverviewContainer {...props} />
          </div>
        } />
      </main>
    </div>
  )
}

Navigation.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element),
}

export default Navigation
