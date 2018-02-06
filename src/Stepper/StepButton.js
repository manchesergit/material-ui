import React, {Component} from 'react';
import PropTypes from 'prop-types';
import transitions from '../styles/transitions';
import EnhancedButton from '../internal/EnhancedButton';
import StepLabel from './StepLabel';
import makeUniqueIdForElement from '../utils/uniqueId';

const isLabel = (child) => {
  return child && child.type && child.type.muiName === 'StepLabel';
};

const getStyles = (props, context, state) => {
  const {hovered} = state;
  const {backgroundColor, hoverBackgroundColor} = context.muiTheme.stepper;

  const styles = {
    root: {
      padding: 0,
      backgroundColor: hovered ? hoverBackgroundColor : backgroundColor,
      transition: transitions.easeOut(),
    },
  };

  if (context.stepper.orientation === 'vertical') {
    styles.root.width = '100%';
  }

  return styles;
};

class StepButton extends Component {

  static propTypes = {
    /**
     * Passed from `Step` Is passed to StepLabel.
     */
    active: PropTypes.bool,
    /**
     * Can be a `StepLabel` or a node to place inside `StepLabel` as children.
     */
    children: PropTypes.node,
    /**
     * Sets completed styling. Is passed to StepLabel.
     */
    completed: PropTypes.bool,
    /**
     * Disables the button and sets disabled styling. Is passed to StepLabel.
     */
    disabled: PropTypes.bool,
    /**
     * The icon displayed by the step label.
     */
    icon: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.number,
    ]),
    /**
     * Override the inline-styles of the icon container element.
     */
    iconContainerStyle: PropTypes.object,
    /**
     * The id value used for the component.
     * This will be used as a base for all child components also.
     * If not provided the class name along with appropriate properties and a random number will be used.
     */
    id: PropTypes.string,
    /**
    * The id to use for the text in children.
    * If this is not provided a value will be generated based on the ID for this object.
    */
    labelledById: PropTypes.string,
    /** @ignore */
    last: PropTypes.bool,
    /** @ignore */
    onMouseEnter: PropTypes.func,
    /** @ignore */
    onMouseLeave: PropTypes.func,
    /** @ignore */
    onTouchStart: PropTypes.func,
    /**
     * Override the inline-style of the root element.
     */
    style: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    stepper: PropTypes.object,
  };

  state = {
    hovered: false,
    touched: false,
  };

  componentWillMount() {
    this.uniqueId = makeUniqueIdForElement(this);
  }

  handleMouseEnter = (event) => {
    const {onMouseEnter} = this.props;
    // Cancel hover styles for touch devices
    if (!this.state.touched) {
      this.setState({hovered: true});
    }
    if (typeof onMouseEnter === 'function') {
      onMouseEnter(event);
    }
  };

  handleMouseLeave = (event) => {
    const {onMouseLeave} = this.props;
    this.setState({hovered: false});
    if (typeof onMouseLeave === 'function') {
      onMouseLeave(event);
    }
  };

  handleTouchStart = (event) => {
    const {onTouchStart} = this.props;
    if (!this.state.touched) {
      this.setState({touched: true});
    }
    if (typeof onTouchStart === 'function') {
      onTouchStart(event);
    }
  };

  render() {
    const {
      active,
      children,
      completed,
      disabled,
      icon,
      iconContainerStyle,
      id,
      labelledById,
      last, // eslint-disable-line no-unused-vars
      onMouseEnter, // eslint-disable-line no-unused-vars
      onMouseLeave, // eslint-disable-line no-unused-vars
      onTouchStart, // eslint-disable-line no-unused-vars
      style,
      ...other
    } = this.props;

    const baseId = id || this.uniqueId;
    const styles = getStyles(this.props, this.context, this.state);

    const childLabelId = `${baseId}-stepLabel`;
    const child = isLabel(children) ? children : <StepLabel id={childLabelId} labelledById={labelledById}>{children}</StepLabel>; // eslint-disable-line max-len

    return (
      <EnhancedButton
        id={baseId}
        disabled={disabled}
        style={Object.assign(styles.root, style)}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleTouchStart}
        {...other}
      >
        {React.cloneElement(child, {active, completed, disabled, icon, iconContainerStyle})}
      </EnhancedButton>
    );
  }
}

export default StepButton;
