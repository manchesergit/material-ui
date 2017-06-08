import React, {Component} from 'react';
import ReactDOM from 'react-dom';
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
    /**
     * The id prop for the component.
     */
    id: PropTypes.string,
    DateTimeFormat: PropTypes.func,
    animation: PropTypes.func,
    autoOk: PropTypes.bool,
    cancelLabel: PropTypes.node,
    container: PropTypes.oneOf(['dialog', 'inline']),
    containerStyle: PropTypes.object,
    disableYearSelection: PropTypes.bool,
    firstDayOfWeek: PropTypes.number,
    hideCalendarDate: PropTypes.bool,
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
    shouldDisableDate: PropTypes.func,
    style: PropTypes.object,
    utils: PropTypes.object,
  };

  static defaultProps = {
    DateTimeFormat: dateTimeFormat,
    cancelLabel: 'Cancel',
    container: 'dialog',
    locale: 'en-US',
    okLabel: 'OK',
  };

  componentWillMount() {
    const uniqueId = `DatePickerDialog-${this.props.container}-${this.props.mode}-${Math.floor(Math.random() * 0xFFFF)}`;
    this.uniqueId = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
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
  };

  handleRequestClose = () => {
    this.dismiss();
  };

  handleTouchTapOk = () => {
    if (this.props.onAccept && !this.refs.calendar.isSelectedDateDisabled()) {
      this.props.onAccept(this.refs.calendar.getSelectedDate());
    }

    this.dismiss();
  };

  handleContainerKeyUp = (event) => {
      if(this.state.open)
      {
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
    const {
      id,
      DateTimeFormat,
      autoOk,
      cancelLabel,
      container,
      containerStyle,
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
    const modal = (container === 'inline' ? null : true);
    const componentId = id || this.uniqueId;
    const divId = componentId + '-div';
    const containerId = componentId + '-' + container + 'Container';
    const calendarId = componentId + '-calendar';
    const eventTarget = modal ? divId : 'window';

    return (
      <div ref='root' id={divId} {...other}>
        <Container
          anchorEl={this.refs.root} // For Popover
          animation={animation || PopoverAnimationVertical} // For Popover
          bodyStyle={styles.dialogBodyContent}
          contentStyle={styles.dialogContent}
          ref="dialog"
          repositionOnUpdate={true}
          open={open}
          onRequestClose={this.handleRequestClose}
          style={Object.assign(styles.dialogBodyContent, containerStyle)}
          id={containerId}
          modal={modal}
        >
          <EventListener
            target={eventTarget}
            onKeyUp={this.handleContainerKeyUp}
          />
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
            ref='calendar'
            onTouchTapCancel={this.handleTouchTapCancel}
            onTouchTapOk={this.handleTouchTapOk}
            okLabel={okLabel}
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
