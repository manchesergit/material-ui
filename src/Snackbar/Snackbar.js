import React, {Component} from 'react';
import PropTypes from 'prop-types';
import transitions from '../styles/transitions';
import ClickAwayListener from '../internal/ClickAwayListener';
import SnackbarBody from './SnackbarBody';
import makeUniqueIdForElement from '../utils/uniqueId';

function getStyles(props, context, state) {
  const {
    muiTheme: {
      baseTheme: {
        spacing: {
          desktopSubheaderHeight,
        },
      },
      zIndex,
    },
  } = context;

  const {open} = state;

  const easeOutTime = '400ms';  // how long the snackbar will stay up before starting to animate off screen

  const styles = {
    root: {
      position: 'fixed',
      left: '50%',
      display: 'flex',
      bottom: 0,
      zIndex: zIndex.snackbar,
      visibility: open ? 'visible' : 'hidden',
      transform: open ?
        'translate(-50%, 0)' :
        `translate(-50%, ${desktopSubheaderHeight}px)`,
      transition: `${transitions.easeOut(easeOutTime, 'transform')}, ${
        transitions.easeOut(easeOutTime, 'visibility')}`,
    },
  };

  return styles;
}

const minimumAutoHideTime = 10000;

class Snackbar extends Component {
  static propTypes = {
    /**
     * The label for the action on the snackbar.
     */
    action: PropTypes.node,
    /**
     * The number of milliseconds to wait before automatically dismissing.
     * If no value is specified the snackbar will dismiss normally.
     * If a value is provided the snackbar can still be dismissed normally.
     * If a snackbar is dismissed before the timer expires, the timer will be cleared.
     * For accessibility reasons, the default value is the minimum number of milliseconds that this can be set to.
     */
    autoHideDuration: PropTypes.number,
    /**
     * Override the inline-styles of the body element.
     */
    bodyStyle: PropTypes.object,
    /**
     * The css class name of the root element.
     */
    className: PropTypes.string,
    /**
     * Override the inline-styles of the content element.
     */
    contentStyle: PropTypes.object,
    /**
     * The ID to use for the snackbar.
     */
    id: PropTypes.string,
    /**
     * The message to be displayed.
     *
     * (Note: If the message is an element or array, and the `Snackbar` may re-render while it is still open,
     * ensure that the same object remains as the `message` property if you want to avoid the `Snackbar` hiding and
     * showing again)
     */
    message: PropTypes.node.isRequired,
    /**
     * Fired when the action button is clicked.
     *
     * @param {object} event Action button event.
     */
    onActionClick: PropTypes.func,
    /**
     * Fired when the `Snackbar` is requested to be closed by a click outside the `Snackbar`, or after the
     * `autoHideDuration` timer expires.
     *
     * Typically `onRequestClose` is used to set state in the parent component, which is used to control the `Snackbar`
     * `open` prop.
     *
     * The `reason` parameter can optionally be used to control the response to `onRequestClose`,
     * for example ignoring `clickaway`.
     *
     * @param {string} reason Can be:`"timeout"` (`autoHideDuration` expired) or: `"clickaway"`
     */
    onRequestClose: PropTypes.func,
    /**
     * Controls whether the `Snackbar` is opened or not.
     */
    open: PropTypes.bool.isRequired,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    autoHideDuration: minimumAutoHideTime,
  };
  static reasons = {
    CLICKAWAY: 'clickaway',
    TIMEOUT: 'timeout'
  }

  componentWillMount() {
    this.setState({
      open: this.props.open,
      message: this.props.message,
      action: this.props.action,
    });
    this.uniqueId = makeUniqueIdForElement(this);
  }

  componentDidMount() {
    if (this.state.open) {
      this.setAutoHideTimer();
      this.setTransitionTimer();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open && nextProps.open &&
        (nextProps.message !== this.props.message || nextProps.action !== this.props.action)) {
      this.setState({
        open: false,
      });

      clearTimeout(this.timerOneAtTheTimeId);
      this.timerOneAtTheTimeId = setTimeout(() => {
        this.setState({
          message: nextProps.message,
          action: nextProps.action,
          open: true,
        });
      }, 500);
    } else {
      const open = nextProps.open;

      this.setState({
        open: open !== null ? open : this.state.open,
        message: nextProps.message,
        action: nextProps.action,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.open !== this.state.open) {
      if (this.state.open) {
        this.setAutoHideTimer();
        this.setTransitionTimer();
      } else {
        clearTimeout(this.timerAutoHideId);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerAutoHideId);
    clearTimeout(this.timerTransitionId);
    clearTimeout(this.timerOneAtTheTimeId);
  }

  componentClickAway = () => {
    if (this.timerTransitionId) {
      // If transitioning, don't close the snackbar.
      return;
    }

    if (this.props.open !== null && this.props.onRequestClose) {
      this.props.onRequestClose(Snackbar.reasons.CLICKAWAY);
    } else {
      this.setState({open: false});
    }
  };

  /* Timer that controls delay before snackbar auto hides
  has a minimum length of 10 seconds - for accessibility reasons*/
  setAutoHideTimer() {
    let autoHideDuration = this.props.autoHideDuration;
    if (autoHideDuration < minimumAutoHideTime) {
      autoHideDuration = minimumAutoHideTime;
    }
    if (autoHideDuration > 0) {
      clearTimeout(this.timerAutoHideId);
      this.timerAutoHideId = setTimeout(() => {
        if (this.props.open !== null && this.props.onRequestClose) {
          this.props.onRequestClose(Snackbar.reasons.TIMEOUT);
        } else {
          this.setState({open: false});
        }
      }, autoHideDuration);
    }
  }

  // Timer that controls delay before click-away events are captured (based on when animation completes)
  setTransitionTimer() {
    this.timerTransitionId = setTimeout(() => {
      this.timerTransitionId = undefined;
    }, 1000);
  }

  render() {
    const {
      autoHideDuration, // eslint-disable-line no-unused-vars
      contentStyle,
      bodyStyle,
      id,
      message: messageProp, // eslint-disable-line no-unused-vars
      onRequestClose, // eslint-disable-line no-unused-vars
      onActionClick,
      style,
      ...other
    } = this.props;

    const {
      action,
      message,
      open,
    } = this.state;

    const contentId = id || this.uniqueId;
    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);
    const openAttr = open ? {open} : null;
    const contentWrapperId = `${contentId}-wrapper`;

    return (
      <ClickAwayListener onClickAway={open ? this.componentClickAway : null}>
        <div
          id={contentWrapperId}
          {...other}
          role="dialog"
          aria-live="polite"
          aria-describedby={this.contentId}
          {...openAttr}
          style={prepareStyles(Object.assign(styles.root, style))}
        >
          <SnackbarBody
            action={action}
            contentId={contentId}
            contentStyle={contentStyle}
            message={message}
            open={open}
            onActionClick={onActionClick}
            style={bodyStyle}
          />
        </div>
      </ClickAwayListener>
    );
  }
}

export default Snackbar;
