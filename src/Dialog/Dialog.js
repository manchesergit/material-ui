import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import transitions from '../styles/transitions';
import Overlay from '../internal/Overlay';
import RenderToLayer from '../internal/RenderToLayer';
import Paper from '../Paper';
import DomUtils from '../utils/dom'; // used for working out if the current focus is a child of this

import ReactTransitionGroup from 'react-transition-group/TransitionGroup';

class TransitionItem extends Component {
  static propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
    style: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    style: {},
  };

  componentWillMount() {
    const uniqueId = `${this.constructor.name}-${Math.floor(Math.random() * 0xFFFF)}`;
    this.uniqueIdTransactionItem = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
  }

  componentWillUnmount() {
    clearTimeout(this.enterTimeout);
    clearTimeout(this.leaveTimeout);
  }

  componentWillEnter(callback) {
    this.componentWillAppear(callback);
  }

  componentWillAppear(callback) {
    const spacing = this.context.muiTheme.baseTheme.spacing;

    this.setState({
      style: {
        opacity: 1,
        transform: `translate(0, ${spacing.desktopKeylineIncrement}px)`,
      },
    });

    this.enterTimeout = setTimeout(callback, 450); // matches transition duration
  }

  componentWillLeave(callback) {
    this.setState({
      style: {
        opacity: 0,
        transform: 'translate(0, 0)',
      },
    });

    this.leaveTimeout = setTimeout(callback, 450); // matches transition duration
  }

  render() {
    const {
      id,
      style,
      children,
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const baseIdItem = id || this.uniqueIdTransactionItem;

    return (
      <div id={baseIdItem} {...other} style={prepareStyles(Object.assign({}, this.state.style, style))}>
        {children}
      </div>
    );
  }
}

function getStyles(props, context) {
  const {
    autoScrollBodyContent,
    open,
  } = props;

  const {
    baseTheme: {
      spacing,
      palette,
    },
    dialog,
    zIndex,
  } = context.muiTheme;

  const gutter = spacing.desktopGutter;
  const borderScroll = `1px solid ${palette.borderColor}`;

  return {
    root: {
      position: 'fixed',
      boxSizing: 'border-box',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated)
      zIndex: zIndex.dialog,
      top: 0,
      left: open ? 0 : -10000,
      width: '100%',
      height: '100%',
      transition: open ?
        transitions.easeOut('0ms', 'left', '0ms') :
        transitions.easeOut('0ms', 'left', '450ms'),
    },
    content: {
      boxSizing: 'border-box',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated)
      transition: transitions.easeOut(),
      position: 'relative',
      width: '75%',
      maxWidth: spacing.desktopKeylineIncrement * 12,
      margin: '0 auto',
      zIndex: zIndex.dialog,
    },
    actionsContainer: {
      boxSizing: 'border-box',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated)
      padding: 8,
      width: '100%',
      textAlign: 'right',
      marginTop: autoScrollBodyContent ? -1 : 0,
      borderTop: autoScrollBodyContent ? borderScroll : 'none',
    },
    overlay: {
      zIndex: zIndex.dialogOverlay,
    },
    title: {
      margin: 0,
      padding: `${gutter}px ${gutter}px 20px ${gutter}px`,
      color: palette.textColor,
      fontSize: dialog.titleFontSize,
      lineHeight: '32px',
      fontWeight: 400,
      marginBottom: autoScrollBodyContent ? -1 : 0,
      borderBottom: autoScrollBodyContent ? borderScroll : 'none',
    },
    body: {
      fontSize: dialog.bodyFontSize,
      color: dialog.bodyColor,
      padding: `${props.title ? 0 : gutter}px ${gutter}px ${gutter}px`,
      boxSizing: 'border-box',
      overflowY: autoScrollBodyContent ? 'auto' : 'hidden',
      borderTop: autoScrollBodyContent ? borderScroll : 'none',
      borderBottom: autoScrollBodyContent ? borderScroll : 'none',
    },
  };
}

class DialogInline extends Component {
  static propTypes = {
    actions: PropTypes.node,
    actionsContainerClassName: PropTypes.string,
    actionsContainerStyle: PropTypes.object,
    autoDetectWindowHeight: PropTypes.bool,
    autoScrollBodyContent: PropTypes.bool,
    bodyClassName: PropTypes.string,
    bodyStyle: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    contentStyle: PropTypes.object,
    id: PropTypes.string,
    modal: PropTypes.bool,
    onRequestClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    overlayClassName: PropTypes.string,
    overlayStyle: PropTypes.object,
    overrideModalEscKey: PropTypes.bool,
    paperClassName: PropTypes.string,
    paperProps: PropTypes.object,
    repositionOnUpdate: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.node,
    titleClassName: PropTypes.string,
    titleStyle: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    forceMove: false, // should the current focus be moved forceably
    lastElement: null,  // what was the last element that had focus
  };

  componentWillMount() {
    const uniqueId = `${this.constructor.name}-${this.makeRandomNumber()}`;
    this.uniqueId = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
  }

  componentDidMount() {
    this.positionDialog();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.open) {
      this.originalFocus = document.activeElement;
    } else if (this.originalFocus) {
      this.originalFocus.focus();
      this.originalFocus = null;
    }
  }

  componentDidUpdate() {
    this.positionDialog();
  }

  makeRandomNumber() {
    return Math.floor(Math.random() * 0xFFFF);
  }

  positionDialog() {
    const {
      actions,
      autoDetectWindowHeight,
      autoScrollBodyContent,
      bodyStyle,
      open,
      repositionOnUpdate,
      title,
    } = this.props;

    if (!open) {
      return;
    }

    const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const container = ReactDOM.findDOMNode(this);
    const dialogWindow = ReactDOM.findDOMNode(this.refs.dialogWindow);
    const dialogContent = ReactDOM.findDOMNode(this.refs.dialogContent);
    const minPaddingTop = 16;

    // Reset the height in case the window was resized.
    dialogWindow.style.height = '';
    dialogContent.style.height = '';

    const dialogWindowHeight = dialogWindow.offsetHeight;
    let paddingTop = ((clientHeight - dialogWindowHeight) / 2) - 64;
    if (paddingTop < minPaddingTop) paddingTop = minPaddingTop;

    // Vertically center the dialog window, but make sure it doesn't
    // transition to that position.
    if (repositionOnUpdate || !container.style.paddingTop) {
      container.style.paddingTop = `${paddingTop}px`;
    }

    // Force a height if the dialog is taller than clientHeight
    if (autoDetectWindowHeight || autoScrollBodyContent) {
      const styles = getStyles(this.props, this.context);
      styles.body = Object.assign(styles.body, bodyStyle);
      let maxDialogContentHeight = clientHeight - 2 * 64;

      if (title) maxDialogContentHeight -= dialogContent.previousSibling.offsetHeight;

      if (React.Children.count(actions)) {
        maxDialogContentHeight -= dialogContent.nextSibling.offsetHeight;
      }

      dialogContent.style.maxHeight = `${maxDialogContentHeight}px`;
      if (maxDialogContentHeight > dialogWindowHeight) {
        dialogContent.style.borderBottom = 'none';
        dialogContent.style.borderTop = 'none';
      }
    }
  }

  requestClose(buttonClicked) {
    if (!buttonClicked && (this.props.modal && this.props.overrideModalEscKey)) {
      return;
    }

    if (this.props.onRequestClose) {
      this.props.onRequestClose(!!buttonClicked);
      const ActiveElement = window.prevActiveElement;
      ActiveElement.focus();
    }
  }

  handleTouchTapOverlay = () => {
    this.requestClose(false);
  };

  handleKeyUp = (event) => {
    switch (keycode(event)) {
      case 'esc':
        this.requestClose(false);
        break;
      default :
        this.moveActive();
    }
  };

  handleBlur = () => {
    this.moveActive();
  }

  handleFocus = () => {
    this.moveActive();
  }

  handleResize = () => {
    this.positionDialog();
  };

  // this is to make sure we can get the id no matter where in the code we are
  makeIdValue() {
    return this.props.id || this.uniqueId;
  }

  // this is to make sure we have the id for the paper element (the actual dialog) so we know where to focus to
  makePaperId() {
    const id = this.makeIdValue();
    return `${id}-paper`;
  }

  /**
   * check if the currently focused element is a child of this
   * if its not, then move the focus back to the last element that was in focus
   */
  moveActive() {
    const id = this.makePaperId();
    const dialogWindow = document.getElementById(id);
    const insideWindow = DomUtils.isDescendant(dialogWindow, document.activeElement) ||
                          dialogWindow === document.activeElement;

    this.setState({forceMove: !insideWindow});

    if (!insideWindow) {
      const focusOn = this.state.lastElement || dialogWindow; // if theres something pushed to state use that
      setTimeout(() => document.activeElement.blur(), 10);
      setTimeout(() => focusOn.focus(), 10);
    } else {
      this.setState({lastElement: document.activeElement}); // save this element incase we go out of foucs
    }
  }

  render() {
    window.prevActiveElement = document.activeElement;

    const {
      actions,
      actionsContainerClassName,
      actionsContainerStyle,
      bodyClassName,
      bodyStyle,
      children,
      className,
      contentClassName,
      contentStyle,
      modal,  // eslint-disable-line no-unused-vars
      overlayClassName,
      overlayStyle,
      open,
      paperClassName,
      paperProps,
      titleClassName,
      titleStyle,
      title,
      style,
    } = this.props;


    const baseId = this.makeIdValue();
    const titleId = `${baseId}-title`;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context);

    styles.root = Object.assign(styles.root, style);
    styles.content = Object.assign(styles.content, contentStyle);
    styles.body = Object.assign(styles.body, bodyStyle);
    styles.actionsContainer = Object.assign(styles.actionsContainer, actionsContainerStyle);
    styles.overlay = Object.assign(styles.overlay, overlayStyle);
    styles.title = Object.assign(styles.title, titleStyle);

    const actionsContainer = React.Children.count(actions) > 0 && (
      <div
        ref="dialogActions"
        className={actionsContainerClassName}
        style={prepareStyles(styles.actionsContainer)}
      >
        {React.Children.map(actions, (action) => {
          const childKey = this.makeRandomNumber();
          return React.cloneElement(action, {
            ref: `action-${childKey}`,
          });
        })}
      </div>
    );

    let titleElement = title;
    if (React.isValidElement(title)) {
      titleElement = React.cloneElement(title, {
        className: title.props.className || titleClassName,
        style: prepareStyles(Object.assign(styles.title, title.props.style)),
        id: this.contentTitleId,
      });
    } else if (typeof title === 'string') {
      titleElement = (
        <h3 id={titleId} className={titleClassName} style={prepareStyles(styles.title)}>
          {title}
        </h3>
      );
    }

    const ariaHidden = this.props.modal ? true : null;
    const dialogGroupID = `${baseId}-dialogGroup`;
    const transitionGroupId = `${baseId}-transitionGroup`;
    const transitionItemId = `${baseId}-transitionItem`;
    const overlayId = `${baseId}-overlay`;
    const paperId = this.makePaperId();
    const tabIndex = this.state.forceMove ? -1 : null;  // if we are in the dialog we don't need a tabIndex

    return (
      <div
        id={dialogGroupID}
        className={className}
        style={prepareStyles(styles.root)}
      >
        {open &&
          <EventListener
            target={dialogGroupID}
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.handleKeyUp}
            onResize={this.handleResize}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
          />
        }
        <ReactTransitionGroup
          role="dialog"
          aria-live="assertive"
          component="div"
          ref="dialogWindow"
          transitionAppear={true}
          transitionAppearTimeout={450}
          transitionEnter={true}
          transitionEnterTimeout={450}
          id={transitionGroupId}
        >
          {open &&
            <TransitionItem
              id={transitionItemId}
              aria-hidden={ariaHidden}
              className={contentClassName}
              style={styles.content}
            >
              <div id="dialog-Tabstart" tabIndex="0" />
              <Paper
                id={paperId}
                className={paperClassName}
                zDepth={4}
                tabIndex={tabIndex}
                {...paperProps}
              >
                {titleElement}
                <div
                  ref="dialogContent"
                  className={bodyClassName}
                  style={prepareStyles(styles.body)}
                >
                  {children}
                </div>
                {actionsContainer}
              </Paper>
              <div id="dialog-Tabstop" tabIndex="0" />
            </TransitionItem>
          }
        </ReactTransitionGroup>
        <Overlay
          id={overlayId}
          show={open}
          className={overlayClassName}
          style={styles.overlay}
          onTouchTap={this.handleTouchTapOverlay}
        />
      </div>
    );
  }
}

class Dialog extends Component {
  static propTypes = {
    /**
     * Action buttons to display below the Dialog content (`children`).
     * This property accepts either a React element, or an array of React elements.
     */
    actions: PropTypes.node,
    /**
     * The `className` to add to the actions container's root element.
     */
    actionsContainerClassName: PropTypes.string,
    /**
     * Overrides the inline-styles of the actions container's root element.
     */
    actionsContainerStyle: PropTypes.object,
    /**
     * If set to true, the height of the `Dialog` will be auto detected. A max height
     * will be enforced so that the content does not extend beyond the viewport.
     */
    autoDetectWindowHeight: PropTypes.bool,
    /**
     * If set to true, the body content of the `Dialog` will be scrollable.
     */
    autoScrollBodyContent: PropTypes.bool,
    /**
     * The `className` to add to the content's root element under the title.
     */
    bodyClassName: PropTypes.string,
    /**
     * Overrides the inline-styles of the content's root element under the title.
     */
    bodyStyle: PropTypes.object,
    /**
     * The contents of the `Dialog`.
     */
    children: PropTypes.node,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * The `className` to add to the content container.
     */
    contentClassName: PropTypes.string,
    /**
     * Overrides the inline-styles of the content container.
     */
    contentStyle: PropTypes.object,
    /**
     * The id value used for the component.
     * This will be used as a base for all child components also.
     * If not provided the class name along with appropriate properties and a random number will be used.
     */
    id: PropTypes.string,
    /**
     * Force the user to use one of the actions in the `Dialog`.
     * Clicking outside the `Dialog` will not trigger the `onRequestClose`.
     */
    modal: PropTypes.bool,
    /**
     * Fired when the `Dialog` is requested to be closed by a click outside the `Dialog` or on the buttons.
     *
     * @param {bool} buttonClicked Determines whether a button click triggered this request.
     */
    onRequestClose: PropTypes.func,
    /**
     * Controls whether the Dialog is opened or not.
     */
    open: PropTypes.bool.isRequired,
    /**
     * The `className` to add to the `Overlay` component that is rendered behind the `Dialog`.
     */
    overlayClassName: PropTypes.string,
    /**
     * Overrides the inline-styles of the `Overlay` component that is rendered behind the `Dialog`.
     */
    overlayStyle: PropTypes.object,
    /**
    * Overrides the use of the escape key for cancelling a modal dialog
    */
    overrideModalEscKey: PropTypes.bool,
    /**
     * The CSS class name of the `Paper` element.
     */
    paperClassName: PropTypes.string,
    /**
     * Properties applied to the `Paper` element.
     */
    paperProps: PropTypes.object,
    /**
     * Determines whether the `Dialog` should be repositioned when it's contents are updated.
     */
    repositionOnUpdate: PropTypes.bool,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * The title to display on the `Dialog`. Could be number, string, element or an array containing these types.
     */
    title: PropTypes.node,
    /**
     * The `className` to add to the title's root container element.
     */
    titleClassName: PropTypes.string,
    /**
     * Overrides the inline-styles of the title's root container element.
     */
    titleStyle: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    autoDetectWindowHeight: true,
    autoScrollBodyContent: false,
    modal: false,
    overrideModalEscKey: false,
    repositionOnUpdate: true,
  };

  componentWillUpdate(nextProps) {
    if (nextProps.open) {
      this.originalFocus = document.activeElement;
    } else {
      setTimeout(() => {
        if (this.originalFocus) {
          this.originalFocus.focus();
          this.originalFocus = null;
        }
      }, 1);
    }
  }

  renderLayer = () => {
    return (
      <DialogInline {...this.props} />
    );
  };

  render() {
    return (
      <RenderToLayer render={this.renderLayer} open={true} useLayerForClickAway={false} />
    );
  }
}

export default Dialog;
