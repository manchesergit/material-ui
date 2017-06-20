import React, {Component, Children} from 'react';
import PropTypes from 'prop-types';
import StepConnector from './StepConnector';

const getStyles = (props) => {
  const {orientation} = props;
  return {
    root: {
      display: 'flex',
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
      alignContent: 'center',
      alignItems: orientation === 'horizontal' ? 'center' : 'stretch',
      justifyContent: 'space-between',
    },
  };
};

class Stepper extends Component {

  static propTypes = {
    /**
     * Set the active step (zero based index). This will enable `Step` control helpers.
     */
    activeStep: PropTypes.number,
    /**
     * Should be two or more `<Step />` components.
     */
    children: PropTypes.node,
    /**
     * A component to be placed between each step.
     */
    connector: PropTypes.node,
    /**
     * The id value used for the component.
     * This will be used as a base for all child components also.
     * If not provided the class name along with appropriate properties and a random number will be used.
     */
    id: PropTypes.string,
    /**
     * If set to `true`, the `Stepper` will assist in controlling steps for linear flow
     */
    linear: PropTypes.bool,
    /**
     * The stepper orientation (layout flow direction)
     */
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    /**
     * Override the inline-style of the root element.
     */
    style: PropTypes.object,
  };

  static defaultProps = {
    connector: <StepConnector />,
    orientation: 'horizontal',
    linear: true,
  };

  static contextTypes = {muiTheme: PropTypes.object.isRequired};

  static childContextTypes = {stepper: PropTypes.object};

  componentWillMount() {
    const uniqueId = `${this.constructor.name}-${this.orientation}-${Math.floor(Math.random() * 0xFFFF)}`;
    this.uniqueId = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
  }

  getChildContext() {
    const {orientation} = this.props;
    return {stepper: {orientation}};
  }

  render() {
    const {
      activeStep,
      children,
      connector,
      linear,
      style,
      id
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context);
    const baseId = id || this.uniqueId;

    /**
     * One day, we may be able to use real CSS tools
     * For now, we need to create our own "pseudo" elements
     * and nth child selectors, etc
     * That's what some of this garbage is for :)
     */
    const numChildren = Children.count(children);
    const steps = Children.map(children, (step, index) => {
      const controlProps = {index};

      if (activeStep === index) {
        controlProps.active = true;
      } else if (linear && activeStep > index) {
        controlProps.completed = true;
      } else if (linear && activeStep < index) {
        controlProps.disabled = true;
      }

      if (index + 1 === numChildren) {
        controlProps.last = true;
      }

      return [
        index > 0 && connector,
        React.cloneElement(step, Object.assign(controlProps, step.props)),
      ];
    });

    return (
      <div id={baseId} style={prepareStyles(Object.assign(styles.root, style))}>
        {steps}
      </div>
    );
  }
}

export default Stepper;
