import * as React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import withRoot from '../../../../withRoot'
import { Profile as ProfileType, ProfileField } from '../../types/profile'
import { Persona as PersonaType } from '../../types/persona'
import Button from '@material-ui/core/Button'
import { GetProfiles, GetPersonas } from '../../actions'
import FieldMapper from './fieldMapper'
import Typography from '@material-ui/core/Typography'
import {
  TextField,
  MenuItem,
  Grid
} from '@material-ui/core/'

const styles = ({ spacing }: Theme) => createStyles({
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  button: {
    marginRight: spacing(1),
    marginTop: spacing(1),
    marginLeft: 25,
    marginBottom: 25
  },
  selectContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    width: '100%',
    marginBottom: 25
  },
  select: {
    width: '100%'
  },
  paper: {
    padding: spacing(1)
  }
})

export interface RouterProps extends RouteComponentProps<{hash: string, returnUrl: string}> {}

export interface OwnProps {
  classes?: any,
  onSubmit?: () => void
}

export interface DispatchProps {
  save: (profile: ProfileType, personas: Array<PersonaType>) => Promise<any>
  getProfiles: typeof GetProfiles.sig
  getPersonas: typeof GetPersonas.sig
  setCurrentPersona: (newCurrentPersona: PersonaType) => void
}

export interface StateProps {
  personas: Array<PersonaType>
  selectedPersona: PersonaType
  profile: ProfileType,
  returnUrl: string
}

export interface State {
  profile: ProfileType
  personas: Array<PersonaType>
}

export type Props = OwnProps & DispatchProps & StateProps

class Profile extends React.Component<Props & RouterProps, State> {
  constructor (props: Props & RouterProps) {
    super(props)
    this.state = {
      profile: props.profile,
      personas: props.personas
    }
  }

  componentDidMount () {
    this.props.getPersonas({})
      .then(() => this.props.getProfiles({}))
      .catch((err) => console.log(JSON.stringify(err)))
  }

  static getDerivedStateFromProps (nextProps: Props & RouterProps, prevState: State) {
    if (!prevState.profile) {
      return {
        profile: nextProps.profile
      }
    } else {
      return null
    }
  }

  handleMappingChange = (updatedField: ProfileField, value: string) => {
    // To be able to save new Persona fields we add new fields to the existing personas.
    console.log('updatedField')
    if (updatedField.mapping !== undefined) {
      let personas = this.props.personas
      let personaAddress = updatedField.mapping.personaAddress
      let personaFieldName = updatedField.mapping.personaFieldName
      let selectedPersonas = personas.filter(function (persona: PersonaType) {
        return persona.hash === personaAddress
      })
      if (selectedPersonas.length === 1) {
        let selectedPersonaFields = selectedPersonas[0].fields.filter(function (field) {
          return field.name === personaFieldName
        })
        if (selectedPersonaFields.length === 0) {
          selectedPersonas[0].fields.push({ name: personaFieldName, data: value })
          this.setState({
            personas: personas
          })
        }
      }
    }

    this.state.profile.fields.filter(function (field) {
      return field.name === updatedField.name
    })[0] = updatedField

    this.setState({
      profile: this.state.profile
    })
  }

  handleSaveProfile = () => {
    this.props.save(this.state.profile, this.props.personas)
      .then(this.props.getProfiles)
      .then(() => {
        if (this.props.returnUrl === '/profiles') {
          this.props.history.push(this.props.returnUrl)
        } else {
          window.location.replace(decodeURIComponent(this.props.returnUrl))
        }
      })
      .catch(err => console.log(err))
  }

  public handleChangeSelectedPersona = (event: any) => {
    let personaAddress = event.target.value
    let selectedPersona = this.props.personas.filter(function (persona: PersonaType) {
      return persona.hash === personaAddress
    })[0]
    this.props.setCurrentPersona(selectedPersona)
  }

  render () {
    if (!this.props.selectedPersona || !this.props.profile) {
      return (
        <Grid container={true} justify='center'>
          <CircularProgress/>
        </Grid>
      )
    }

    const { profile, classes } = this.props

    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <Typography variant='h4' component='h2'>
            Profile for {profile.name}
          </Typography>
          <Typography component='p'>
              Welcome to the Agent Centric Web where you are in control of your personal data.
          </Typography>
          <Paper className={classes.selectContainer}>
            <TextField name='PersonasSelect' className={classes.select} select={true} value={this.props.selectedPersona.hash} onChange={this.handleChangeSelectedPersona} label='Selected Persona'>
            {this.props.personas.map((persona) => {
              return (
                <MenuItem key={persona.hash} value={persona.hash} >
                  {persona.name}
                </MenuItem>
              )
            })}
            </TextField>
          </Paper>
          <Paper className={classes.form}>
            {this.state.profile.fields.map((field, i) => {
              return (
                <FieldMapper
                  key={i}
                  personas={this.props.personas}
                  selectedPersona={this.props.selectedPersona} // make sure the currentPersona is at the top
                  profile={profile}
                  field={field}
                  mapSaved={this.props.profile.fields[i].mapping}
                  handleMappingChange={this.handleMappingChange}
                />
              )
            })}
            <Button id='Agree' onClick={this.handleSaveProfile} color='primary'>
              Save Profile
            </Button>
          </Paper>
        </Paper>
      </div>
    )
  }
}

export { Profile as ProfileBase }
export default withRoot(withStyles(styles)(withRouter(Profile)))
