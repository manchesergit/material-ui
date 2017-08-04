import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import Calendar from './Calendar';
import Dialog from '../Dialog';
import Popover from '../Popover/Popover';
import PopoverAnimationVertical from '../Popover/PopoverAnimationVertical';
import {dateTimeFormat} from './dateUtils';

class DatePickerDialog extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func,
    animation: PropTypes.func,
    autoOk: PropTypes.bool,
    cancelLabel: PropTypes.node,
    container: PropTypes.oneOf(['dialog', 'inline']),
    containerStyle: PropTypes.object,
    disableEscapeKeyForDialogs: PropTypes.bool,
    disableYearSelection: PropTypes.bool,
    firstDayOfWeek: PropTypes.number,
    hideCalendarDate: PropTypes.bool,
    id: PropTypes.string,
    initialDate: PropTypes.object,
    locale: PropTypes.string,
    maxDate: PropTypes.object,
    minDate: PropTypes.object,
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    okLabel: PropTypes.node,
    onAccept: PropTypes.func,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    open: PropTypes.bool,
    openToYearSelection: PropTypes.bool,
    shouldDisableDate: PropTypes.func,
    style: PropTypes.object,
    utils: PropTypes.object,
  };

  static defaultProps = {
    DateTimeFormat: dateTimeFormat,
    disableEscapeKeyForDialogs: false,
    cancelLabel: 'Cancel',
    container: 'dialog',
    locale: 'en-US',
    okLabel: 'OK',
    openToYearSelection: false,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    open: false,
    containerComponentId: '',
    calendarComponentId: '',
    divComponentId: '',
  };

  componentWillMount() {
    const distinctions = `${this.props.container}-${this.props.mode}`;
    const uniqueId = `${this.constructor.name}-${distinctions}-${Math.floor(Math.random() * 0xFFFF)}`;
    this.uniqueId = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
  }

  show = () => {
    if (this.props.onShow && !this.state.open) {
      this.props.onShow();
    }

    this.setState({
      open: true,
    });
  };

  dismiss = () => {
    if (this.props.onDismiss && this.state.open) {
      this.props.onDismiss();
    }

    this.setState({
      open: false,
    });
  };

  handleTouchTapDay = () => {
    if (this.props.autoOk) {
      setTimeout(this.handleTouchTapOk, 300);
    }
  };

  handleTouchTapCancel = () => {
    this.dismiss();
    const ActiveElement = window.prevActiveElement;
    ActiveElement.focus();
  };

  handleRequestClose = () => {
    this.dismiss();
    const ActiveElement = window.prevActiveElement;
    ActiveElement.focus();
  };

  handleTouchTapOk = () => {
    if (this.props.onAccept && !this.refs.calendar.isSelectedDateDisabled()) {
      this.props.onAccept(this.refs.calendar.getSelectedDate());
    }

    this.dismiss();
    const ActiveElement = window.prevActiveElement;
    ActiveElement.focus();
  };

  handleContainerKeyUp = (event) => {
    if (this.state.open) {
      switch (keycode(event)) {
        case 'enter':
          this.handleTouchTapOk();
          break;
        case 'esc':
          this.handleRequestClose();
          break;
      }
    }
  };

  render() {
    window.prevActiveElement = document.activeElement;
    const {
      id,
      DateTimeFormat,
      autoOk,
      cancelLabel,
      container,
      containerStyle,
      disableEscapeKeyForDialogs,
      disableYearSelection,
      initialDate,
      firstDayOfWeek,
      locale,
      maxDate,
      minDate,
      mode,
      okLabel,
      onAccept, // eslint-disable-line no-unused-vars
      onDismiss, // eslint-disable-line no-unused-vars
      onShow, // eslint-disable-line no-unused-vars
      openToYearSelection,
      shouldDisableDate,
      hideCalendarDate,
      style, // eslint-disable-line no-unused-vars
      animation,
      utils,
      ...other
    } = this.props;

    const {open} = this.state;

    const styles = {
      dialogContent: {
        width: (!hideCalendarDate && mode === 'landscape') ? 479 : 310,
      },
      dialogBodyContent: {
        padding: 0,
        minHeight: (hideCalendarDate || mode === 'landscape') ? 330 : 434,
        minWidth: (hideCalendarDate || mode !== 'landscape') ? 310 : 479,
      },
    };

    const Container = (container === 'inline' ? Popover : Dialog);
    const modal = true;
    const componentId = id || this.uniqueId;
    const containerId = `${componentId}-${container}Container`;
    const calendarId = `${componentId}-calendar`;
    const escOverride = modal ? disableEscapeKeyForDialogs : null;

    const windowListener = modal ? null : ( <EventListener target="window" onKeyUp={this.handleContainerKeyUp} />);
    const containerListener = modal ? this.handleContainerKeyUp : null;

    return (
      <div ref="root" id={componentId} {...other}>
        <Container
          anchorEl={this.refs.root} // For Popover
          animation={animation || PopoverAnimationVertical} // For Popover
          bodyStyle={styles.dialogBodyContent}
          contentStyle={styles.dialogContent}
          ref="dialog"
          repositionOnUpdate={true}
          open={open}
          onRequestClose={this.handleRequestClose}
          overrideModalEscKey={escOverride}
          style={Object.assign(styles.dialogBodyContent, containerStyle)}
          id={containerId}
          modal={modal}
          onKeyUp={containerListener}
        >
          {windowListener}
          <Calendar
            id={calendarId}
            autoOk={autoOk}
            DateTimeFormat={DateTimeFormat}
            cancelLabel={cancelLabel}
            disableYearSelection={disableYearSelection}
            firstDayOfWeek={firstDayOfWeek}
            initialDate={initialDate}
            locale={locale}
            onTouchTapDay={this.handleTouchTapDay}
            maxDate={maxDate}
            minDate={minDate}
            mode={mode}
            open={open}
            ref="calendar"
            onTouchTapCancel={this.handleTouchTapCancel}
            onTouchTapOk={this.handleTouchTapOk}
            okLabel={okLabel}
            openToYearSelection={openToYearSelection}
            shouldDisableDate={shouldDisableDate}
            hideCalendarDate={hideCalendarDate}
            utils={utils}
          />
        </Container>
      </div>
    );
  }
}

export default DatePickerDialog;
