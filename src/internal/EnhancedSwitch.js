import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import transitions from '../styles/transitions';
import FocusRipple from './FocusRipple';
import TouchRipple from './TouchRipple';
import Paper from './../Paper';
import warning from 'warning';

function getStyles(props, context) {
  const {baseTheme} = context.muiTheme;

  return {
    root: {
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      position: 'relative',
      overflow: 'visible',
      display: 'table',
      height: 'auto',
      width: '100%',
    },
    input: {
      position: 'absolute',
      cursor: 'inherit',
      pointerEvents: 'all',
      opacity: 0,
      width: '100%',
      height: '100%',
      zIndex: 2,
      left: 0,
      boxSizing: 'border-box',
      padding: 0,
      margin: 0,
    },
    controls: {
      display: 'flex',
      width: '100%',
      height: '100%',
    },
    label: {
      float: 'left',
      position: 'relative',
      display: 'block',
      width: 'calc(100% - 60px)',
      lineHeight: '24px',
      color: baseTheme.palette.textColor,
      fontFamily: baseTheme.fontFamily,
    },
    wrap: {
      transition: transitions.easeOut(),
      float: 'left',
      position: 'relative',
      display: 'block',
      flexShrink: 0,
      width: 60 - baseTheme.spacing.desktopGutterLess,
      marginRight: (props.labelPosition === 'right') ?
        baseTheme.spacing.desktopGutterLess : 0,
      marginLeft: (props.labelPosition === 'left') ?
        baseTheme.spacing.desktopGutterLess : 0,
    },
    ripple: {
      color: props.rippleColor || baseTheme.palette.primary1Color,
      height: '200%',
      width: '200%',
      top: -12,
      left: -12,
    },
  };
}

class EnhancedSwitch extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    className: PropTypes.string,
    defaultChecked: PropTypes.bool,
    disableFocusRipple: PropTypes.bool,
    disableTouchRipple: PropTypes.bool,
    disabled: PropTypes.bool,
    iconStyle: PropTypes.object,
    id: PropTypes.string,
    inputStyle: PropTypes.object,
    inputType: PropTypes.string.isRequired,
    label: PropTypes.node,
    labelPosition: PropTypes.oneOf(['left', 'right']),
    labelStyle: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseUp: PropTypes.func,
    onParentShouldUpdate: PropTypes.func,
    onSwitch: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onTouchStart: PropTypes.func,
    rippleColor: PropTypes.string,
    rippleStyle: PropTypes.object,
    style: PropTypes.object,
    switchElement: PropTypes.element.isRequired,
    switched: PropTypes.bool.isRequired,
    thumbStyle: PropTypes.object,
    trackStyle: PropTypes.object,
    value: PropTypes.any,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    /* We need to know the value of checked if its been passed as it will populated the aria-checked
     * property of the input element.  It needs to be copied from the params as we can't cleanly do a
     * state check and a pram check at render time */
    this.state = {
      isKeyboardFocused: false,
      isChecked: this.continsCheckedProperty(props) ? props.checked :
        this.containsDefaultCheckedProperty(props) ? props.defaultChecked : false,
    };
  }

  componentWillMount() {
    const generatedId = Math.floor(Math.random() * 0xFFFF);
    const uniqueId = `${this.constructor.name}-${this.props.labelPosition}-${generatedId}`;
    this.uniqueId = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
  }

  componentDidMount() {
    const inputNode = this.refs.checkbox;
    if ((!this.props.switched || inputNode.checked !== this.props.switched) && this.props.onParentShouldUpdate) {
      this.props.onParentShouldUpdate(inputNode.checked);
    }
  }

  componentWillReceiveProps(nextProps) {
    const hasCheckedProp = this.continsCheckedProperty(nextProps);
    const hasNewDefaultProp =
      (this.containsDefaultCheckedProperty(nextProps) &&
      (nextProps.defaultChecked !== this.props.defaultChecked));

    if (hasCheckedProp || hasNewDefaultProp) {
      const switched = nextProps.checked || nextProps.defaultChecked || false;

      this.setState({
        switched: switched,
        isChecked: switched,
      });

      if (this.props.onParentShouldUpdate && switched !== this.props.switched) {
        this.props.onParentShouldUpdate(switched);
      }
    }
  }

  // check that theres a checked property in the provided propterties object
  continsCheckedProperty(propsToCheck) {
    return ('checked' in propsToCheck);
  }

  // check that theres a defaultChecked property in the provided propterties object
  containsDefaultCheckedProperty(propsToCheck) {
    return ('defaultChecked' in propsToCheck);
  }

  // no callback here because there is no event
  setSwitched(newSwitchedValue) {
    if (!this.continsCheckedProperty(this.props) || this.props.checked === false) {
      if (this.props.onParentShouldUpdate) {
        this.props.onParentShouldUpdate(newSwitchedValue);
      }
      this.refs.checkbox.checked = newSwitchedValue;
    } else {
      warning(false, 'Material-UI: Cannot call set method while checked is defined as a property.');
    }
  }

  getValue() {
    return this.refs.checkbox.value;
  }

  handleChange = (event) => {
    this.tabPressed = false;
    this.setState({
      isKeyboardFocused: false,
    });

    const isInputChecked = this.refs.checkbox.checked;
    this.setState({isChecked: isInputChecked});

    if (!this.props.hasOwnProperty('checked') && this.props.onParentShouldUpdate) {
      this.props.onParentShouldUpdate(isInputChecked);
    }

    if (this.props.onSwitch) {
      this.props.onSwitch(event, isInputChecked);
    }
  };

  // Checkbox inputs only use SPACE to change their state. Using ENTER will
  // update the ui but not the input.
  handleKeyDown = (event) => {
    const code = keycode(event);

    if (code === 'tab') {
      this.tabPressed = true;
    }
    if (this.state.isKeyboardFocused && code === 'space') {
      this.handleChange(event);
    }
  };

  handleKeyUp = (event) => {
    if (this.state.isKeyboardFocused && keycode(event) === 'space') {
      this.handleChange(event);
    }
  };

  /**
   * Because both the ripples and the checkbox input cannot share pointer
   * events, the checkbox input takes control of pointer events and calls
   * ripple animations manually.
   */
  handleMouseDown = (event) => {
    // only listen to left clicks
    if (event.button === 0) {
      this.refs.touchRipple.start(event);
    }
  };

  handleMouseUp = () => {
    this.refs.touchRipple.end();
  };

  handleMouseLeave = () => {
    this.refs.touchRipple.end();
  };

  handleTouchStart = (event) => {
    this.refs.touchRipple.start(event);
  };

  handleTouchEnd = () => {
    this.refs.touchRipple.end();
  };

  handleBlur = (event) => {
    this.setState({
      isKeyboardFocused: false,
    });

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  handleFocus = (event) => {
    // setTimeout is needed becuase the focus event fires first
    // Wait so that we can capture if this was a keyboard focus
    // or touch focus
    setTimeout(() => {
      if (this.tabPressed) {
        this.setState({
          isKeyboardFocused: true,
        });
      }
    }, 150);

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  render() {
    const {
      id,
      name,
      value,
      iconStyle,
      inputStyle,
      inputType,
      label,
      labelStyle,
      labelPosition,
      onSwitch, // eslint-disable-line no-unused-vars
      onBlur, // eslint-disable-line no-unused-vars
      onFocus, // eslint-disable-line no-unused-vars
      onMouseUp, // eslint-disable-line no-unused-vars
      onMouseDown, // eslint-disable-line no-unused-vars
      onMouseLeave, // eslint-disable-line no-unused-vars
      onTouchStart, // eslint-disable-line no-unused-vars
      onTouchEnd, // eslint-disable-line no-unused-vars
      onParentShouldUpdate, // eslint-disable-line no-unused-vars
      disabled,
      disableTouchRipple,
      disableFocusRipple,
      className,
      rippleColor, // eslint-disable-line no-unused-vars
      rippleStyle,
      style,
      switched, // eslint-disable-line no-unused-vars
      switchElement,
      thumbStyle,
      trackStyle,
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context);
    const wrapStyles = Object.assign(styles.wrap, iconStyle);
    const mergedRippleStyle = Object.assign(styles.ripple, rippleStyle);

    const baseId = id || this.uniqueId;
    const touchRippleId = `${baseId}-touchRipple`;
    const focusRippleId = `${baseId}-focusRipple`;
    const inputId = `${baseId}-input`;
    const thumbStyleId = `${baseId}-thumbStyle`;
    const wrapStyleId = `${baseId}-wrapStyle`;
    const trackStyleId = `${baseId}-trackStyle`;
    const paperStyleId = `${baseId}-paperStyle`;
    const styleControlId = `${baseId}-styleControl`;
    const labelId = `${baseId}-label`;

    if (thumbStyle) {
      wrapStyles.marginLeft /= 2;
      wrapStyles.marginRight /= 2;
    }

    const labelElement = label && (
      <label htmlFor={inputId} style={prepareStyles(Object.assign(styles.label, labelStyle))} id={labelId}>
        {label}
      </label>
    );

    const showTouchRipple = !disabled && !disableTouchRipple;
    const showFocusRipple = !disabled && !disableFocusRipple;

    const touchRipple = (
      <TouchRipple
        id={touchRippleId}
        ref="touchRipple"
        key="touchRipple"
        style={mergedRippleStyle}
        color={mergedRippleStyle.color}
        muiTheme={this.context.muiTheme}
        centerRipple={true}
      />
    );

    const focusRipple = (
      <FocusRipple
        id={focusRippleId}
        key="focusRipple"
        innerStyle={mergedRippleStyle}
        color={mergedRippleStyle.color}
        muiTheme={this.context.muiTheme}
        show={this.state.isKeyboardFocused}
      />
    );

    const ripples = [
      showTouchRipple ? touchRipple : null,
      showFocusRipple ? focusRipple : null,
    ];

    const inputElement = (
      <input
        id={inputId}
        role="checkbox"
        aria-label="checkbox"
        aria-labelledby={labelId}
        aria-checked={this.state.isChecked}
        {...other}
        ref="checkbox"
        type={inputType}
        style={prepareStyles(Object.assign(styles.input, inputStyle))}
        name={name, inputId}
        value={value}
        disabled={disabled}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onChange={this.handleChange}
        onMouseUp={showTouchRipple && this.handleMouseUp}
        onMouseDown={showTouchRipple && this.handleMouseDown}
        onMouseLeave={showTouchRipple && this.handleMouseLeave}
        onTouchStart={showTouchRipple && this.handleTouchStart}
        onTouchEnd={showTouchRipple && this.handleTouchEnd}
      />
    );

    // If toggle component (indicated by whether the style includes thumb) manually lay out
    // elements in order to nest ripple elements
    const switchOrThumbElement = !thumbStyle ? (
      <div id={thumbStyleId} style={prepareStyles(wrapStyles)}>
        {switchElement}
        {ripples}
      </div>
    ) : (
      <div id={wrapStyleId} style={prepareStyles(wrapStyles)}>
        <div id={trackStyleId} style={prepareStyles(Object.assign({}, trackStyle))} />
        <Paper
          id={paperStyleId}
          style={thumbStyle}
          zDepth={1}
          circle={true}
        >
          {ripples}
        </Paper>
      </div>
    );

    const elementsInOrder = labelPosition === 'right' ? (
      <div id={styleControlId} style={styles.controls}>
        {switchOrThumbElement}
        {labelElement}
      </div>
    ) : (
      <div id={styleControlId} style={styles.controls}>
        {labelElement}
        {switchOrThumbElement}
      </div>
    );

    return (
      <div
        id={baseId}
        ref="root"
        className={className}
        style={prepareStyles(Object.assign(styles.root, style))}
      >
        <EventListener
          target="window"
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
        />
        {inputElement}
        {elementsInOrder}
      </div>
    );
  }
}

export default EnhancedSwitch;
