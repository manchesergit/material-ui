import React, {Component} from 'react';
import PropTypes from 'prop-types';
import transitions from '../styles/transitions';
import propTypes from '../utils/propTypes';
import EnhancedButton from '../internal/EnhancedButton';
import FontIcon from '../FontIcon';
import Tooltip from '../internal/Tooltip';
import {extendChildren} from '../utils/childUtils';

function getStyles(props, context) {
  const {baseTheme} = context.muiTheme;

  return {
    root: {
      boxSizing: 'border-box',
      overflow: 'visible',
      transition: transitions.easeOut(),
      padding: baseTheme.spacing.iconSize / 2,
      width: baseTheme.spacing.iconSize * 2,
      height: baseTheme.spacing.iconSize * 2,
      fontSize: 0,
    },
    tooltip: {
      boxSizing: 'border-box',
    },
    disabled: {
      color: baseTheme.palette.disabledColor,
      fill: baseTheme.palette.disabledColor,
      cursor: 'default',
    },
  };
}

class IconButton extends Component {
  static muiName = 'IconButton';

  static propTypes = {
    /**
     * values to be added into aria-label on the button
     */
    buttonAriaLabel: PropTypes.string,
    /**
     * Can be used to pass a `FontIcon` element as the icon for the button.
     */
    children: PropTypes.node,
    /**
     * The CSS class name of the root element.
     */
    className: PropTypes.string,
    /**
     * value to be added into aria-describedby
     */
    describedBy: PropTypes.string,
    /**
     * If true, the element's ripple effect will be disabled.
     */
    disableTouchRipple: PropTypes.bool,
    /**
     * If true, the element will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * Override the inline-styles of the root element when the component is hovered.
     */
    hoveredStyle: PropTypes.object,
    /**
     * The URL to link to when the button is clicked.
     */
    href: PropTypes.string,
    /**
     * The CSS class name of the icon. Used for setting the icon with a stylesheet.
     */
    iconClassName: PropTypes.string,
    /**
     * Override the inline-styles of the icon element.
     * Note: you can specify iconHoverColor as a String inside this object.
     */
    iconStyle: PropTypes.object,
    /**
     * The id value used for the component.
     * This will be used as a base for all child components also.
     * If not provided the class name along with appropriate properties and a random number will be used.
     */
    id: PropTypes.string,
    /**
     * value to be added into aria-labelledby
     */
    labelledBy: PropTypes.string,
    /** @ignore */
    onBlur: PropTypes.func,
    /**
     * Callback function fired when the button is touch-tapped.
     *
     * @param {object} event TouchTap event targeting the button.
     */
    onClick: PropTypes.func,
    /** @ignore */
    onFocus: PropTypes.func,
    /**
     * Callback function fired when the element is focused or blurred by the keyboard.
     *
     * @param {object} event `focus` or `blur` event targeting the element.
     * @param {boolean} keyboardFocused Indicates whether the element is focused.
     */
    onKeyboardFocus: PropTypes.func,
    /** @ignore */
    onMouseEnter: PropTypes.func,
    /** @ignore */
    onMouseLeave: PropTypes.func,
    /** @ignore */
    onMouseOut: PropTypes.func,
    /** @ignore */
    onTouchStart: PropTypes.func,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * The text to supply to the element's tooltip.
     */
    tooltip: PropTypes.node,
    /**
     * The vertical and horizontal positions, respectively, of the element's tooltip.
     * Possible values are: "bottom-center", "top-center", "bottom-right", "top-right",
     * "bottom-left", and "top-left".
     */
    tooltipPosition: propTypes.cornersAndCenter,
    /**
     * Override the inline-styles of the tooltip element.
     */
    tooltipStyles: PropTypes.object,
    /**
     * If true, increase the tooltip element's size. Useful for increasing tooltip
     * readability on mobile devices.
     */
    touch: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    disableTouchRipple: false,
    iconStyle: {},
    tooltipPosition: 'bottom-center',
    touch: false,
    buttonAriaLabel: '',
    labelledBy: '',
    describedBy: '',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    hovered: false,
    isKeyboardFocused: false,
    // Not to be confonded with the touch property.
    // This state is to determined if it's a mobile device.
    touch: false,
    tooltipShown: false,
  };

  componentWillMount() {
    const uniqueId = `${this.constructor.name}-${Math.floor(Math.random() * 0xFFFF)}`;
    this.uniqueId = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) {
      this.setState({hovered: false});
    }
  }

  setKeyboardFocus() {
    this.button.setKeyboardFocus();
  }

  showTooltip() {
    if (this.props.tooltip) {
      this.setState({tooltipShown: true});
    }
  }

  hideTooltip() {
    if (this.props.tooltip) this.setState({tooltipShown: false});
  }

  handleBlur = (event) => {
    this.hideTooltip();
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  handleFocus = (event) => {
    this.showTooltip();
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleMouseLeave = (event) => {
    if (!this.button.isKeyboardFocused()) {
      this.hideTooltip();
    }
    this.setState({hovered: false});
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(event);
    }
  };

  handleMouseOut = (event) => {
    if (this.props.disabled) this.hideTooltip();
    if (this.props.onMouseOut) this.props.onMouseOut(event);
  };

  handleMouseEnter = (event) => {
    this.showTooltip();

    // Cancel hover styles for touch devices
    if (!this.state.touch) {
      this.setState({hovered: true});
    }
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(event);
    }
  };

  handleTouchStart = (event) => {
    this.setState({touch: true});

    if (this.props.onTouchStart) {
      this.props.onTouchStart(event);
    }
  };

  handleKeyboardFocus = (event, isKeyboardFocused) => {
    const {disabled, onFocus, onBlur, onKeyboardFocus} = this.props;
    if (isKeyboardFocused && !disabled) {
      this.showTooltip();
      if (onFocus) {
        onFocus(event);
      }
    } else {
      this.hideTooltip();
      if (onBlur) {
        onBlur(event);
      }
    }

    this.setState({isKeyboardFocused});
    if (onKeyboardFocus) {
      onKeyboardFocus(event, isKeyboardFocused);
    }
  };

  render() {
    const {
      buttonAriaLabel, // eslint-disable-line no-unused-vars
      disabled,
      describedBy, // eslint-disable-line no-unused-vars
      disableTouchRipple,
      children,
      hoveredStyle,
      iconClassName,
      iconStyle,
      id,
      labelledBy, // eslint-disable-line no-unused-vars
      style,
      tooltip,
      tooltipPosition: tooltipPositionProp,
      tooltipStyles,
      touch,
      ...other
    } = this.props;
    let fonticon;

    const baseId = id || this.uniqueId;

    /* aria tags to associate this button with parent containers or
     * nothing depending on how the call for this has been made */
    const ariaBaseName = 'Icon Button';
    const ariaLabelPrefix = this.props.buttonAriaLabel.length === 0 ? '' : `${this.props.buttonAriaLabel} `;
    const ariaLabel = `${ariaLabelPrefix}${ariaBaseName}`;
    const toolTipIdValue = `${baseId}-tooltip`;
    const ariaLabelledBy = this.props.labelledBy.length === 0 ? null : this.props.labelledBy ;
    const ariaDescribedBy = this.props.describedBy.length === 0 ? null : this.props.describedBy ;

    const styles = getStyles(this.props, this.context);
    const tooltipPosition = tooltipPositionProp.split('-');

    const hovered = (this.state.hovered || this.state.isKeyboardFocused) && !disabled;

    const mergedRootStyles = Object.assign(
      styles.root,
      style,
      hovered ? hoveredStyle : {}
    );

    const tooltipElement = tooltip ? (
      <Tooltip
        label={tooltip}
        show={this.state.tooltipShown}
        touch={touch}
        style={Object.assign(styles.tooltip, tooltipStyles)}
        verticalPosition={tooltipPosition[0]}
        horizontalPosition={tooltipPosition[1]}
        id={toolTipIdValue}
      />
    ) : null;

    if (iconClassName) {
      const {
        iconHoverColor,
        ...iconStyleFontIcon
      } = iconStyle;

      fonticon = (
        <FontIcon
          className={iconClassName}
          hoverColor={disabled ? null : iconHoverColor}
          style={Object.assign(
            {},
            disabled && styles.disabled,
            iconStyleFontIcon
          )}
          color={this.context.muiTheme.baseTheme.palette.textColor}
        >
          {children}
        </FontIcon>
      );
    }

    const childrenStyle = disabled ? Object.assign({}, iconStyle, styles.disabled) : iconStyle;

    return (
      <EnhancedButton
        id={baseId}
        role="button"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        ref={(ref) => this.button = ref}
        {...other}
        centerRipple={true}
        disabled={disabled}
        onTouchStart={this.handleTouchStart}
        style={mergedRootStyles}
        disableTouchRipple={disableTouchRipple}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        onMouseOut={this.handleMouseOut}
        onKeyboardFocus={this.handleKeyboardFocus}
      >
        {tooltipElement}
        {fonticon}
        {extendChildren(children, {
          style: childrenStyle,
        })}
      </EnhancedButton>
    );
  }
}

export default IconButton;
