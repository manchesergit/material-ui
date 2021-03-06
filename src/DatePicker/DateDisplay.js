import React, {Component} from 'react';
import PropTypes from 'prop-types';
import transitions from '../styles/transitions';
import SlideInTransitionGroup from '../internal/SlideIn';
import keycode from 'keycode';
import ToolTip from '../internal/Tooltip';

function getStyles(props, context, state) {
  const {datePicker} = context.muiTheme;
  const {selectedYear} = state;
  const {highlightYear} = state;
  const isLandscape = props.mode === 'landscape';

  const styles = {
    root: {
      width: isLandscape ? 165 : '100%',
      height: isLandscape ? 330 : 'auto',
      float: isLandscape ? 'left' : 'none',
      fontWeight: 700,
      display: 'inline-block',
      backgroundColor: datePicker.headerColor,
      borderTopLeftRadius: 2,
      borderTopRightRadius: isLandscape ? 0 : 2,
      borderBottomLeftRadius: isLandscape ? 2 : 0,
      color: datePicker.textColor,
      padding: 20,
      boxSizing: 'border-box',
    },
    monthDay: {
      display: 'block',
      fontSize: 36,
      lineHeight: '36px',
      height: props.mode === 'landscape' ? '100%' : 38,
      opacity: selectedYear ? 0.7 : 1,
      transition: transitions.easeOut(),
      width: '100%',
      fontWeight: '500',
    },
    monthDayTitle: {
      cursor: !selectedYear ? 'default' : 'pointer',
      width: '100%',
      display: 'block',
    },
    year: {
      margin: 0,
      fontSize: 16,
      fontWeight: '500',
      lineHeight: '16px',
      height: 16,
      opacity: selectedYear ? 1 : 0.7,
      transition: transitions.easeOut(),
      marginBottom: 10,
    },
    yearTitle: {
      cursor: props.disableYearSelection || selectedYear ? 'default' : 'pointer',
      fontWeight: highlightYear ? '700' : '500',
    },
    yearTooltip: {
      boxSizing: 'border-box',
    },
  };

  return styles;
}

class DateDisplay extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    disableYearSelection: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    monthDaySelected: PropTypes.bool,
    onClickMonthDay: PropTypes.func,
    onClickYear: PropTypes.func,
    selectedDate: PropTypes.object.isRequired,
    style: PropTypes.object,
    yearToolTipDisabled: PropTypes.bool,
    yearToolTipStyles: PropTypes.object,
    yearToolTipText: PropTypes.string,
  };

  static defaultProps = {
    disableYearSelection: false,
    monthDaySelected: true,
    yearToolTipDisabled: false,
    yearToolTipText: null,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    focusedYear: false,
    highlightYear: false,
    selectedYear: false,
    transitionDirection: 'up',
  };

  componentWillMount() {
    if (!this.props.monthDaySelected) {
      this.setState({selectedYear: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDate !== this.props.selectedDate) {
      const direction = nextProps.selectedDate > this.props.selectedDate ? 'up' : 'down';
      this.setState({
        transitionDirection: direction,
      });
    }

    if (nextProps.monthDaySelected !== undefined) {
      this.setState({
        selectedYear: !nextProps.monthDaySelected,
      });
    }
  }

  handleClickMonthDay = () => {
    if (this.props.onClickMonthDay && this.state.selectedYear) {
      this.props.onClickMonthDay();
    }

    this.setState({selectedYear: false});
  };

  handleClickYear = () => {
    if (this.props.onClickYear && !this.props.disableYearSelection && !this.state.selectedYear) {
      this.props.onClickYear();
    }

    if (!this.props.disableYearSelection) {
      this.setState({selectedYear: true});
    }
  };

  handleBlurYear = () => {
    this.setYearShouldBeHighlighted(false);
  };

  handleFocusYear = () => {
    this.setYearShouldBeHighlighted(true);
  };

  handleKeyUp = (event) => {
    if (!this.props.disableYearSelection) {
      if ((keycode(event) === 'enter' || keycode(event) === 'space')) {
        this.handleTouchTapYear();
      }
    }
  };

  setYearShouldBeHighlighted(isFocused) {
    this.setState({
      focusedYear: isFocused,
      highlightYear: isFocused && !this.state.selectedYear,
    });
  }

  render() {
    const {
      DateTimeFormat,
      disableYearSelection, // eslint-disable-line no-unused-vars
      locale,
      mode, // eslint-disable-line no-unused-vars
      monthDaySelected, // eslint-disable-line no-unused-vars
      onClickMonthDay, // eslint-disable-line no-unused-vars
      onClickYear, // eslint-disable-line no-unused-vars
      selectedDate, // eslint-disable-line no-unused-vars
      style,
      yearToolTipStyles, // eslint-disable-line no-unused-vars
      yearToolTipDisabled,
      yearToolTipText,
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);

    const year = new DateTimeFormat(locale, {
      year: 'numeric',
    }).format(selectedDate);

    const tooltip = yearToolTipText || 'Select to change the calendar year';

    const dateTime = new DateTimeFormat(locale, {
      month: 'short',
      weekday: 'short',
      day: '2-digit',
    }).format(selectedDate);

    const yearTooltipElement = ( !yearToolTipDisabled &&
      <ToolTip
        label={tooltip}
        show={this.state.highlightYear}
        verticalPosition="bottom"
        horizontalPosition="right"
        style={Object.assign(styles.tooltip, yearToolTipStyles)}
        id="displayYear-YearTooltip"
      />
    );

    return (
      <div id="dateDisplay-div" {...other} style={prepareStyles(styles.root, style)}>
        {yearTooltipElement}
        <SlideInTransitionGroup
          id="dateDisplay-yearTransition"
          style={styles.year}
          direction={this.state.transitionDirection}
        >
          <div
            id="displayYear"
            tabIndex="0"
            key={year}
            style={styles.yearTitle}
            onClick={this.handleClickYear}
            onFocus={this.handleFocusYear}
            onBlur={this.handleBlurYear}
            onMouseEnter={this.handleFocusYear}
            onMouseLeave={this.handleBlurYear}
            onKeyUp={this.handleKeyUp}
          >
            {year}
          </div>
        </SlideInTransitionGroup>
        <SlideInTransitionGroup
          id="dateDisplay-monthDayTransition"
          style={styles.monthDay}
          direction={this.state.transitionDirection}
        >
          <div
            id="displayMonthDay"
            key={dateTime}
            onClick={this.handleClickMonthDay}
            style={styles.monthDayTitle}
          >
            {dateTime}
          </div>
        </SlideInTransitionGroup>
      </div>
    );
  }
}

export default DateDisplay;
