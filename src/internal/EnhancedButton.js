import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Events from '../utils/events';
import keycode from 'keycode';
import FocusRipple from './FocusRipple';
import TouchRipple from './TouchRipple';
import {checkChildrenInputWitha11y, HtmlForTagName, InputTypeName} from '../utils/inputNodeCheck';

let styleInjected = false;
let listening = false;
let tabPressed = false;

function injectStyle() {
  if (!styleInjected) {
    // Remove inner padding and border in Firefox 4+.
    const style = document.createElement('style');
    style.innerHTML = `
      button::-moz-focus-inner,
      input::-moz-focus-inner {
        border: 0;
        padding: 0;
      }
    `;

    document.body.appendChild(style);
    styleInjected = true;
  }
}

function listenForTabPresses() {
  if (!listening) {
    Events.on(window, 'keydown', (event) => {
      tabPressed = keycode(event) === 'tab';
    });
    listening = true;
  }
}

class EnhancedButton extends Component {
  static propTypes = {
    centerRipple: PropTypes.bool,
    children: PropTypes.node,
    containerElement: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    disableFocusRipple: PropTypes.bool,
    disableKeyboardFocus: PropTypes.bool,
    disableTouchRipple: PropTypes.bool,
    disabled: PropTypes.bool,
    focusRippleColor: PropTypes.string,
    focusRippleOpacity: PropTypes.number,
    href: PropTypes.string,
    id: PropTypes.string,
    keyboardFocused: PropTypes.bool,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onKeyboardFocus: PropTypes.func,
    overrideRole: PropTypes.string,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    touchRippleColor: PropTypes.string,
    touchRippleOpacity: PropTypes.number,
    type: PropTypes.string,
  };

  static defaultProps = {
    containerElement: 'button',
    onBlur: () => {},
    onClick: () => {},
    onFocus: () => {},
    onKeyDown: () => {},
    onKeyUp: () => {},
    onKeyboardFocus: () => {},
    tabIndex: 0,
    type: 'button',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    isKeyboardFocused: false,
    lastHandledEventTime: 0,
  };

  componentWillMount() {
    const {disabled, disableKeyboardFocus, keyboardFocused} = this.props;
    if (!disabled && keyboardFocused && !disableKeyboardFocus) {
      this.setState({isKeyboardFocused: true});
    }

    const uniqueId = `${this.constructor.name}-${Math.floor(Math.random() * 0xFFFF)}`;
    this.uniqueId = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
  }

  componentDidMount() {
    injectStyle();
    listenForTabPresses();
    if (this.state.isKeyboardFocused) {
      this.button.focus();
      this.props.onKeyboardFocus(null, true);
    }

    // ----------  a11y test incase the button has a child input tag -------------
    let children = this.props.children; // children will be checked for input blocks
    let excludeTag = null;              // this tag will not be checked

    // if this button already has a 'for' value at this level, exclude it from the next level of checks
    if (this.props.hasOwnProperty(HtmlForTagName)) {
      excludeTag = HtmlForTagName;
    }

    // if the type of the children is a div, then we need to test the inside of the div
    if (this.props.children.type === 'div') {
      let grandChild = children; // this is what will end up being checked

      // check all the children of the children for an input tag
      React.Children.forEach(children.props.children, (child) => {
        if (child !== null) {
          if (child.type === InputTypeName) {
            grandChild = child; // if theres an input tag use it as the base to test from
          }
        }
      });
      children = grandChild;  // test these instead of the this.props.children
    }

    checkChildrenInputWitha11y(this.getBaseId(), children, excludeTag);
    // ----------  a11y test incase the button has a child input tag -------------
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.disabled || nextProps.disableKeyboardFocus) &&
      this.state.isKeyboardFocused) {
      this.setState({isKeyboardFocused: false});
      if (nextProps.onKeyboardFocus) {
        nextProps.onKeyboardFocus(null, false);
      }
    }
  }

  componentWillUnmount() {
    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
    }
  }

  isKeyboardFocused() {
    return this.state.isKeyboardFocused;
  }

  removeKeyboardFocus(event) {
    if (this.state.isKeyboardFocused) {
      this.setState({isKeyboardFocused: false});
      this.props.onKeyboardFocus(event, false);
    }
  }

  setKeyboardFocus(event) {
    if (!this.state.isKeyboardFocused) {
      this.setState({isKeyboardFocused: true});
      this.props.onKeyboardFocus(event, true);
    }
  }

  cancelFocusTimeout() {
    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
      this.focusTimeout = null;
    }
  }

  createButtonChildren() {
    const {
      centerRipple,
      children,
      disabled,
      disableFocusRipple,
      disableKeyboardFocus,
      disableTouchRipple,
      focusRippleColor,
      focusRippleOpacity,
      touchRippleColor,
      touchRippleOpacity,
    } = this.props;
    const {isKeyboardFocused} = this.state;
    const focusRippleId = `${this.getBaseId()}-focusRipple`;
    const touchRippleId = `${this.getBaseId()}-touchRipple`;

    // Focus Ripple
    const focusRipple = isKeyboardFocused && !disabled && !disableFocusRipple && !disableKeyboardFocus ? (
      <FocusRipple
        id={focusRippleId}
        color={focusRippleColor}
        opacity={focusRippleOpacity}
        show={isKeyboardFocused}
        style={{
          overflow: 'hidden',
        }}
        key="focusRipple"
      />
    ) : undefined;

    // Touch Ripple
    const touchRipple = !disabled && !disableTouchRipple ? (
      <TouchRipple
        id={touchRippleId}
        centerRipple={centerRipple}
        color={touchRippleColor}
        opacity={touchRippleOpacity}
        key="touchRipple"
      >
        {children}
      </TouchRipple>
    ) : undefined;

    return [
      focusRipple,
      touchRipple,
      touchRipple ? undefined : children,
    ];
  }

  handleKeyDown = (event) => {
    if (!this.props.disabled && !this.props.disableKeyboardFocus) {
      if (keycode(event) === 'enter' && this.state.isKeyboardFocused) {
        this.handleClick(event);
      }
      if (keycode(event) === 'esc' && this.state.isKeyboardFocused) {
        this.removeKeyboardFocus(event);
      }
    }
    this.props.onKeyDown(event);
  };

  handleKeyUp = (event) => {
    if (!this.props.disabled && !this.props.disableKeyboardFocus) {
      if (keycode(event) === 'space' && this.state.isKeyboardFocused) {
        this.handleClick(event);
      }
    }
    this.props.onKeyUp(event);
  };

  handleBlur = (event) => {
    this.cancelFocusTimeout();
    this.removeKeyboardFocus(event);
    this.props.onBlur(event);
  };

  handleFocus = (event) => {
    if (event) event.persist();
    if (!this.props.disabled && !this.props.disableKeyboardFocus) {
      // setTimeout is needed because the focus event fires first
      // Wait so that we can capture if this was a keyboard focus
      // or touch focus
      this.focusTimeout = setTimeout(() => {
        if (tabPressed) {
          this.setKeyboardFocus(event);
          tabPressed = false;
        }
      }, 150);

      this.props.onFocus(event);
    }
  };

  handleClick = (event) => {
    // when firing the handleClick from the handleKeyUp, 2 events are generated, both with the same timeStamp
    // the chances of someone managing to fire two events in the same millisecond are ... well slim to none.
    const bumpTime = this.state.lastHandledEventTime + 1;
    // this is for the chance that no event is provided
    const eventTime = event ? event.hasOwnProperty('timeStamp') ? event.timeStamp : bumpTime : bumpTime;
    // don't bother running the handler code if the event being processed happened
    // in the same millisecond as the last one processed
    if (eventTime !== this.state.lastHandledEventTime) {
      this.setState({lastHandledEventTime: eventTime});
      this.cancelFocusTimeout();
      if (!this.props.disabled) {
        tabPressed = false;
        this.removeKeyboardFocus(event);
        this.props.onClick(event);
      }
    }
  };

  getBaseId() {
    return this.props.id || this.uniqueId;
  }

  render() {
    const {
      id, // eslint-disable-line no-unused-vars
      centerRipple, // eslint-disable-line no-unused-vars
      children,
      containerElement,
      disabled,
      disableFocusRipple, // eslint-disable-line no-unused-vars
      disableKeyboardFocus, // eslint-disable-line no-unused-vars
      disableTouchRipple, // eslint-disable-line no-unused-vars
      focusRippleColor, // eslint-disable-line no-unused-vars
      focusRippleOpacity, // eslint-disable-line no-unused-vars
      href,
      keyboardFocused, // eslint-disable-line no-unused-vars
      touchRippleColor, // eslint-disable-line no-unused-vars
      touchRippleOpacity, // eslint-disable-line no-unused-vars
      onBlur, // eslint-disable-line no-unused-vars
      onClick, // eslint-disable-line no-unused-vars
      onFocus, // eslint-disable-line no-unused-vars
      onKeyUp, // eslint-disable-line no-unused-vars
      onKeyDown, // eslint-disable-line no-unused-vars
      onKeyboardFocus, // eslint-disable-line no-unused-vars
      overrideRole,
      style,
      tabIndex,
      type,
      ...other
    } = this.props;

    const baseId = this.getBaseId();
    const spanId = `${baseId}-span`;

    const {
      prepareStyles,
      enhancedButton,
    } = this.context.muiTheme;

    const mergedStyles = Object.assign({
      border: 10,
      boxSizing: 'border-box',
      display: 'inline-block',
      fontFamily: this.context.muiTheme.baseTheme.fontFamily,
      WebkitTapHighlightColor: enhancedButton.tapHighlightColor, // Remove mobile color flashing (deprecated)
      cursor: disabled ? 'default' : 'pointer',
      textDecoration: 'none',
      margin: 0,
      padding: 0,
      outline: 'none',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      position: 'relative', // This is needed so that ripples do not bleed past border radius.
      verticalAlign: href ? 'middle' : null,
    }, style);


    // Passing both background:none & backgroundColor can break due to object iteration order
    if (!mergedStyles.backgroundColor && !mergedStyles.background) {
      mergedStyles.background = 'none';
    }

    if (disabled && href) {
      return (
        <span
          id={spanId}
          {...other}
          style={mergedStyles}
        >
          {children}
        </span>
      );
    }

    const ariaRole = overrideRole || 'button';
    const buttonProps = {
      ...other,
      role: ariaRole,
      style: prepareStyles(mergedStyles),
      ref: (node) => this.button = node,
      disabled: disabled,
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      onKeyUp: this.handleKeyUp,
      onKeyDown: this.handleKeyDown,
      onClick: this.handleClick,
      tabIndex: disabled || disableKeyboardFocus ? -1 : tabIndex,
      id: baseId,
    };

    if (href) buttonProps.href = href;

    const buttonChildren = this.createButtonChildren();

    if (React.isValidElement(containerElement)) {
      return React.cloneElement(containerElement, buttonProps, buttonChildren);
    }

    if (!href && containerElement === 'button') {
      buttonProps.type = type;
    }

    return React.createElement(href ? 'a' : containerElement, buttonProps, buttonChildren);
  }
}

export default EnhancedButton;
