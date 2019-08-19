import * as React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import withRoot from '../../../../withRoot'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import { PersonaField as PersonaFieldType, Persona as PersonaType, PersonaSpec } from '../../types/persona'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import PersonAdd from '@material-ui/icons/PersonAdd'
import PersonOutline from '@material-ui/icons/PersonOutline'
import TextFields from '@material-ui/icons/TextFields'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { GetPersonas } from '../../actions'

export interface RouterProps extends RouteComponentProps<{name: string}> {}

export interface OwnProps {
  classes?: any
}

export interface StateProps {
  currentPersona: PersonaType,
  title: string,
  personas: Array<PersonaType>
}

export interface DispatchProps {
  create: (personaSpec: PersonaSpec, personaFields: Array<PersonaFieldType>) => Promise<any>,
  update: (personaAddress: string, personaSpec: PersonaSpec, personaFields: Array<PersonaFieldType>) => Promise<any>,
  delete: (personaAddress: string) => Promise<any>,
  getPersonas: typeof GetPersonas.sig
}

export type Props = OwnProps & StateProps & DispatchProps

export interface State {
  persona: PersonaType,
  open: boolean
}

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    textAlign: 'left',
    paddingTop: spacing(1)
  },
  button: {
    marginRight: spacing(1),
    marginTop: spacing(1)
  },
  paper: {
    padding: spacing(1)
  }
})

function PersonaField (props: {index: number, field: PersonaFieldType, onChange: (updatedField: PersonaFieldType) => void}) {

  const onChangeName = (newName: string): void => {
    props.onChange({
      ...props.field,
      name: newName
    })
  }

  const onChangeData = (newData: string): void => {
    props.onChange({
      ...props.field,
      data: newData
    })
  }

  return (
    <div>
      <TextField name={`fieldName${props.index}`} label='Field Name' value={props.field.name} onChange={(e) => onChangeName(e.target.value)} />
      <TextField name={`fieldValue${props.index}`} label='Field Value' value={props.field.data} onChange={(e) => onChangeData(e.target.value)} />
    </div>
  )
}

class Persona extends React.Component<Props & RouterProps, State> {

  constructor (props: Props & RouterProps) {
    super(props)
    this.state = {
      open: false,
      persona: {
        name: '',
        hash: '',
        fields: []
      }
    }
  }

  handleSubmit = () => {
    const personaSpec: PersonaSpec = { 'name': this.state.persona.name }
    const personaFields: Array<PersonaFieldType> = this.state.persona.fields
    if (this.state.persona.hash === '') {
      this.props.create(personaSpec, personaFields)
        .then(this.props.getPersonas)
        .catch(err => console.log(err))
    } else {
      this.props.update(this.state.persona.hash, personaSpec, personaFields)
        .then(this.props.getPersonas)
        .catch(err => console.error(err))
    }
    this.props.history.push('/personas')
  }

  handleConfirmDelete = () => {
    this.setState({
      open: true
    })
  }

  handleDelete = () => {
    this.setState({
      open: false
    })
    this.props.delete(this.state.persona.hash)
      .then(this.props.getPersonas)
      .catch(err => console.error(err))
    this.props.history.push('/personas')
  }

  handleCloseDialog = () => {
    this.setState({
      open: false
    })
  }

  handleAddPersonaField = () => {
    this.setState({
      persona: {
        ...this.state.persona,
        fields: [...this.state.persona.fields, { 'name': '', 'data': '' }]
      }
    })
  }

  componentDidMount () {
    this.props.getPersonas({})
      .catch((err) => console.log(err))
    this.setState({
      open: false,
      persona: this.props.currentPersona
    })
  }

  static getDerivedStateFromProps (nextProps: Props & RouterProps, prevState: State) {
    if (!prevState.persona) {
      return {
        persona: nextProps.currentPersona
      }
    } else {
      return null
    }
  }

  updateField (newField: PersonaFieldType, index: number) {
    const fields = this.state.persona.fields
    this.setState({
      persona: {
        ...this.state.persona,
        fields: [...fields.slice(0, index), newField, ...fields.slice(index + 1)]
      }
    })
  }

  updateName (newName: string) {
    this.setState({
      persona: {
        ...this.state.persona,
        name: newName
      }
    })
  }

  render () {
    const { classes } = this.props

    if (!this.state.persona) {
      return (
        <div>
          <CircularProgress/>
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant='h4'>
            Manage Your Personas
          </Typography>
          <Typography variant='body1' gutterBottom={true}>
            You can add a new Persona and add as many fields to it as you like. You will probably have a *Default*, *Work* and a *Friends* persona.
          </Typography>
            <div>
              <TextField name='personaName' value={this.state.persona.name} onChange={e => this.updateName(e.target.value)} label='Persona Name'/>
            </div>
            {this.state.persona.fields.map((field: PersonaFieldType, index: number) => (<PersonaField key={index} index={index} field={field} onChange={(newField: PersonaFieldType) => this.updateField(newField, index)}/>))}
            <Button name='addField' color='primary' onClick={this.handleAddPersonaField}>
              <TextFields/>
              Add Field
            </Button>
            <Button name='submitPersona' color='primary' onClick={() => this.handleSubmit()}>
              <PersonAdd/>
              {this.state.persona.hash === '' ? 'Create Persona' : 'Update Persona'}
            </Button>
            <Button name='deletePersona' color='primary' onClick={() => this.handleConfirmDelete()}>
              <PersonOutline/>
              Delete Persona
            </Button>
            <Dialog open={this.state.open} onClose={this.handleCloseDialog}>
              <DialogTitle id='alert-dialog-slide-title'>
                Delete {this.state.persona.name} Persona?
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Agreeing will delete this Persona.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseDialog} color='primary'>
                  Cancel
                </Button>
                <Button id='Agree' onClick={this.handleDelete} color='primary'>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
      </div>
    )
  }
}

export { Persona as PersonaBase }
export default withRoot(withStyles(styles)(withRouter(Persona)))
