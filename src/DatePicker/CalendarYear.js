import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import YearButton from './YearButton';

class CalendarYear extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    maxDate: PropTypes.object.isRequired,
    minDate: PropTypes.object.isRequired,
    onTouchTapYear: PropTypes.func,
    selectedDate: PropTypes.object.isRequired,
    utils: PropTypes.object.isRequired,
    wordings: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.scrollToSelectedYear();
  }

  componentDidUpdate() {
    this.scrollToSelectedYear();
  }

  getYears() {
    const {
      DateTimeFormat,
      locale,
      minDate,
      maxDate,
      selectedDate,
      utils,
    } = this.props;

    const yearButtonIdBase = 'YearButton-';
    const minYear = utils.getYear(minDate);
    const maxYear = utils.getYear(maxDate);
    const years = [];
    let selectedYear;

    for (let year = minYear; year <= maxYear; year++) {
      const selected = utils.getYear(selectedDate) === year;
      const id = `${yearButtonIdBase}${year}`;
      const selectedProps = {};

      if (selected) {
        selectedYear = id;
        selectedProps.ref = 'selectedYearButton';
      }

      const yearFormated = new DateTimeFormat(locale, {
        year: 'numeric',
      }).format(utils.setYear(selectedDate, year));

      const tabIndex = selected ? 0 : -1;

      const yearButton = (
        <YearButton
          id={id}
          key={`yb${year}`}
          onTouchTap={this.handleTouchTapYear}
          selected={selected}
          year={year}
          utils={utils}
          {...selectedProps}
          tabIndex={tabIndex}
        >
          {yearFormated}
        </YearButton>
      );

      years.push(yearButton);
    }

    if (selectedYear) {
      const yearButton = document.getElementById(selectedYear);
      if (yearButton) {
        yearButton.focus();
      }
    }

    return years;
  }

  scrollToSelectedYear() {
    if (this.refs.selectedYearButton === undefined) {
      return;
    }

    const container = ReactDOM.findDOMNode(this);
    const yearButtonNode = ReactDOM.findDOMNode(this.refs.selectedYearButton);

    const containerHeight = container.clientHeight;
    const yearButtonNodeHeight = yearButtonNode.clientHeight || 32;

    const scrollYOffset = (yearButtonNode.offsetTop + yearButtonNodeHeight / 2) - containerHeight / 2;
    container.scrollTop = scrollYOffset;
  }

  handleTouchTapYear = (event, year) => {
    if (this.props.onTouchTapYear) {
      this.props.onTouchTapYear(event, year);
    }
  };

  render() {
    const {
      prepareStyles,
      datePicker: {
        calendarYearBackgroundColor,
      },
    } = this.context.muiTheme;

    const styles = {
      root: {
        backgroundColor: calendarYearBackgroundColor,
        height: 'inherit',
        lineHeight: '35px',
        overflowX: 'hidden',
        overflowY: 'scroll',
        position: 'relative',
      },
      child: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100%',
      },
    };

    return (
      <div style={prepareStyles(styles.root)}>
        <div style={prepareStyles(styles.child)}>
          {this.getYears()}
        </div>
      </div>
    );
  }
}

export default CalendarYear;
