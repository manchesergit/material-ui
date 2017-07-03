import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EnhancedButton from '../internal/EnhancedButton';

function getStyles(props, context) {
  const {tabs} = context.muiTheme;

  return {
    root: {
      color: props.selected ? tabs.selectedTextColor : tabs.textColor,
      fontWeight: 500,
      fontSize: 14,
      width: props.width,
      textTransform: 'uppercase',
      padding: 0,
    },
    button: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: (props.label && props.icon) ? 72 : 48,
    },
  };
}

class Tab extends Component {
  static muiName = 'Tab';

  static propTypes = {
    /**
     * Override the inline-styles of the button element.
     */
    buttonStyle: PropTypes.object,
    /**
     * The css class name of the root element.
     */
    className: PropTypes.string,
    /**
     * Sets the icon of the tab, you can pass `FontIcon` or `SvgIcon` elements.
     */
    icon: PropTypes.node,
    /**
     * @ignore
     */
    index: PropTypes.any,
    /**
     * Sets the text value of the tab item to the string specified.
     */
    label: PropTypes.node,
    /**
     * Fired when the active tab changes by touch or tap.
     * Use this event to specify any functionality when an active tab changes.
     * For example - we are using this to route to home when the third tab becomes active.
     * This function will always recieve the active tab as it\'s first argument.
     */
    onActive: PropTypes.func,
    /**
     * @ignore
     * This property is overriden by the Tabs component.
     */
    onTouchTap: PropTypes.func,
    /**
     * @ignore
     * Defines if the current tab is selected or not.
     * The Tabs component is responsible for setting this property.
     */
    selected: PropTypes.bool,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * The ID of the container that holds this tab
     */
    tabContainerId: PropTypes.string,
    /**
     * If value prop passed to Tabs component, this value prop is also required.
     * It assigns a value to the tab so that it can be selected by the Tabs.
     */
    value: PropTypes.any,
    /**
     * @ignore
     * This property is overriden by the Tabs component.
     */
    width: PropTypes.string,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  handleTouchTap = (event) => {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(this.props.value, event, this);
    }
  };

  render() {
    const {
      icon,
      index, // eslint-disable-line no-unused-vars
      onActive, // eslint-disable-line no-unused-vars
      onTouchTap, // eslint-disable-line no-unused-vars
      selected, // eslint-disable-line no-unused-vars
      label,
      buttonStyle,
      style,
      value, // eslint-disable-line no-unused-vars
      tabContainerId,
      width, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    console.log(tabContainerId);
    const styles = getStyles(this.props, this.context);

    let iconElement;
    if (icon && React.isValidElement(icon)) {
      iconElement = React.cloneElement(icon, {
        style: {
          fontSize: 24,
          color: (icon.props && icon.props.style && icon.props.style.color) ?
            icon.props.style.color : styles.root.color,
          marginBottom: label ? 5 : 0,
        },
      });
    }

    const rippleOpacity = 0.3;
    const rippleColor = this.context.muiTheme.tabs.selectedTextColor;

    return (
      <EnhancedButton
        aria-label="Tab Button"
        {...other}
        style={Object.assign(styles.root, style)}
        focusRippleColor={rippleColor}
        touchRippleColor={rippleColor}
        focusRippleOpacity={rippleOpacity}
        touchRippleOpacity={rippleOpacity}
        onTouchTap={this.handleTouchTap}
        overrideRole='tab'
        aria-controls={tabContainerId}
      >
        <div style={Object.assign(styles.button, buttonStyle)} >
          {iconElement}
          {label}
        </div>
      </EnhancedButton>
    );
  }
}

export default Tab;
