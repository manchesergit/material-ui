import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TimeDisplay from './TimeDisplay';
import ClockHours from './ClockHours';
import ClockMinutes from './ClockMinutes';
import EventListener from 'react-event-listener';   // for the keyboard listener
import keycode from 'keycode';  // to work out the name of the key on the keyboadrd listener

class Clock extends Component {
  static propTypes = {
    format: PropTypes.oneOf(['ampm', '24hr']),
    initialTime: PropTypes.object,
    minutesStep: PropTypes.number,
    onChangeHours: PropTypes.func,
    onChangeMinutes: PropTypes.func,
  };

  static defaultProps = {
    initialTime: new Date(),
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    selectedTime: null,
    mode: 'hour',
  };

  componentWillMount() {
    const selectedTime = this.props.initialTime || new Date();
    const minutes = selectedTime.getMinutes();
    selectedTime.setMinutes(minutes - (minutes % this.props.minutesStep));

    this.setState({
      selectedTime,
    });
  }

  setMode = (mode) => {
    setTimeout(() => {
      this.setState({
        mode: mode,
      });
    }, 100);
  };

  handleSelectAffix = (affix) => {
    if (affix === this.getAffix()) return;

    const hours = this.state.selectedTime.getHours();

    if (affix === 'am') {
      this.handleChangeHours(hours - 12, affix);
      return;
    }

    this.handleChangeHours(hours + 12, affix);
  };

  getAffix() {
    if (this.props.format !== 'ampm') return '';

    const hours = this.state.selectedTime.getHours();
    if (hours < 12) {
      return 'am';
    }

    return 'pm';
  }

  handleChangeHours = (hours, finished) => {
    const time = new Date(this.state.selectedTime);
    let affix;

    if ( typeof finished === 'string' ) {
      affix = finished;
      finished = undefined;
    }
    if (!affix) {
      affix = this.getAffix();
    }
    if (affix === 'pm' && hours < 12) {
      hours += 12;
    }

    time.setHours(hours);
    this.setState({
      selectedTime: time,
    });

    if (finished) {
      setTimeout(() => {
        this.modeChange();

        const {onChangeHours} = this.props;
        if (onChangeHours) {
          onChangeHours(time);
        }
      }, 100);
    }
  };

  handleChangeMinutes = (minutes, finished) => {
    const time = new Date(this.state.selectedTime);
    time.setMinutes(minutes);
    this.setState({
      selectedTime: time,
    });

    const {onChangeMinutes} = this.props;
    if (onChangeMinutes && finished) {
      setTimeout(() => {
        onChangeMinutes(time);
      }, 0);
    }
  };

  /**
   * check if the current clock is showing hours or not.
   * if true is returned then its in hour mode, if false its in minute mode.
   */
  isInHourMode() {
    return this.state.mode === 'hour';
  }

  /**
   * take whatever mode the current clock is showing in (hour / minute)
   * then flip it to the other mode
   */
  modeChange() {
    setTimeout(() => {
      this.setState({
        mode: this.isInHourMode() ? 'minute' : 'hour',
      });
    }, 100);
  }

  getSelectedTime() {
    return this.state.selectedTime;
  }

  /**
   * handle keypresses for this class only.
   * up or right are move the clock hands clockwise
   * down or left are move the clock hands anit-clockwise
   * space is for switching between hour and minute modes.
   * =====================================================
   * Don't switch this to key down, as that would make it much more difficult to work with for the user
   */
  handleKeyUp = (event) => {
    let changeValue = 0;
    let done = false;

    switch (keycode(event)) {
      case 'up':
      case 'right':
        changeValue = 1;
        break;
      case 'down':
      case 'left':
        changeValue = -1;
        break;
      case 'space' :
        done = true;
        break;
    }

    if (!done) {
      /* TODO : work out how to get to the selectedTime.x as an alias and make all this generic,
                should be able to have the getHours / getMinutes as an alias and the handleChangexxx */
      if (this.isInHourMode()) {
        this.handleChangeHours(this.state.selectedTime.getHours() + changeValue, false);
      } else {
        this.handleChangeMinutes(this.state.selectedTime.getMinutes() + changeValue, false);
      }
    } else {
      this.modeChange();
    }
  };

  render() {
    let clock = null;

    const {
      prepareStyles,
      timePicker,
    } = this.context.muiTheme;

    const styles = {
      root: {
        userSelect: 'none',
      },
      container: {
        height: 280,
        padding: 10,
        position: 'relative',
        boxSizing: 'content-box',
      },
      circle: {
        position: 'absolute',
        top: 20,
        width: 260,
        height: 260,
        borderRadius: '100%',
        backgroundColor: timePicker.clockCircleColor,
      },
    };

    if (this.isInHourMode()) {
      clock = (
        <ClockHours
          key="hours"
          format={this.props.format}
          onChange={this.handleChangeHours}
          initialHours={this.state.selectedTime.getHours()}
        />
      );
    } else {
      clock = (
        <ClockMinutes
          key="minutes"
          onChange={this.handleChangeMinutes}
          initialMinutes={this.state.selectedTime.getMinutes()}
          step={this.props.minutesStep}
        />
      );
    }

    /**
     * the id of the div containing the clock has been hard coded to "clockface".
     * should anyone ever want to reuse this code so they can have n clocks on screan at once,
     * then the name will have to change to something more random (but you can't do this in the current framework)
     */
    return (
      <div style={prepareStyles(styles.root)}>
        <TimeDisplay
          selectedTime={this.state.selectedTime}
          mode={this.state.mode}
          format={this.props.format}
          affix={this.getAffix()}
          onSelectAffix={this.handleSelectAffix}
          onSelectHour={this.setMode.bind(this, 'hour')}
          onSelectMin={this.setMode.bind(this, 'minute')}
        />
        <div style={prepareStyles(styles.container)} >
          <div id="clockface" tabIndex="0" style={prepareStyles(styles.circle)} />
          <EventListener target="clockface" onKeyUp={this.handleKeyUp} />
          {clock}
        </div>
      </div>
    );
  }
}

export default Clock;
