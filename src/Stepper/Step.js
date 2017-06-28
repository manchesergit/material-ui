import React, {Component} from 'react';
import PropTypes from 'prop-types';
import StepLabel from './StepLabel';
import StepButton from './StepButton';

const getStyles = ({index}, {stepper}) => {
  const {orientation} = stepper;
  const styles = {
    root: {
      flex: '0 0 auto',
    },
  };

  if (index > 0) {
    if (orientation === 'horizontal') {
      styles.root.marginLeft = -6;
    } else if (orientation === 'vertical') {
      styles.root.marginTop = -14;
    }
  }

  return styles;
};

class Step extends Component {
  static propTypes = {
    /**
     * Sets the step as active. Is passed to child components.
     */
    active: PropTypes.bool,
    /**
     * Should be `Step` sub-components such as `StepLabel`.
     */
    children: PropTypes.node,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
    /**
     * Mark the step as disabled, will also disable the button if
     * `StepButton` is a child of `Step`. Is passed to child components.
     */
    disabled: PropTypes.bool,
    /**
     * The id value used for the component.
     * This will be used as a base for all child components also.
     * If not provided the class name along with appropriate properties and a random number will be used.
     */
    id: PropTypes.string,
    /**
     * @ignore
     * Used internally for numbering.
     */
    index: PropTypes.number,
    /**
     * @ignore
     */
    last: PropTypes.bool,
    /**
     * Override the inline-style of the root element.
     */
    style: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    stepper: PropTypes.object,
  };

  componentWillMount() {
    const uniqueId = `${this.constructor.name}-${Math.floor(Math.random() * 0xFFFF)}`;
    this.uniqueId = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
  }


  renderChild = (child) => {
    const {
      active,
      completed,
      disabled,
      index,
      last,
      id,
    } = this.props;

    const icon = index + 1;
    const childId = this.makeBaseId() + icon;

    if (this.classCanBeLabelled(child)) {
      const ariaLabelledBy = this.makeLabelId();

      return React.cloneElement(child, Object.assign(
        {active, completed, disabled, icon, last, id},
        child.props, {id: childId}, {labelledById: ariaLabelledBy}
      ));
    } else {
      return React.cloneElement(child, Object.assign(
        {active, completed, disabled, icon, last, id},
        child.props, {id: childId}
      ));
    }
  }

  /**
   * check if any of the children of this object can be used as
   */
  canBeLabelled() {
    for (let i = 0; i < this.props.children.length; i++) {
      if (this.classCanBeLabelled(this.props.children[i])) {
        return true;
      }
    }

    return false;
  }

  /**
  * check if the given child object can be used as a labelled by id for this object
  */
  classCanBeLabelled(child) {
    const labelledByClasses = [StepLabel, StepButton]; // if any other class can be used for labelled by, add it here
    return labelledByClasses.indexOf(child.type) !== -1;
  }

  makeBaseId() {
    return this.props.id || this.uniqueId;
  }

  makeLabelId() {
    return `${this.makeBaseId()}-LabelledBy`;
  }

  render() {
    const {
      active, // eslint-disable-line no-unused-vars
      completed, // eslint-disable-line no-unused-vars
      disabled, // eslint-disable-line no-unused-vars
      index, // eslint-disable-line no-unused-vars
      last, // eslint-disable-line no-unused-vars
      children,
      style,
      id, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context);
    const divId = `${this.makeBaseId()}-stepDiv`;
    const labelId = this.canBeLabelled() ? this.makeLabelId() : null;

    return (
      <div
        id={divId}
        role="listitem"
        aria-labelledby={labelId}
        style={prepareStyles(Object.assign(styles.root, style))}
        {...other}
      >
        {React.Children.map(children, this.renderChild)}
      </div>
    );
  }
}

export default Step;
