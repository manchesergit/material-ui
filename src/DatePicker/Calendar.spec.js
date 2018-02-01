/* eslint-env mocha */
import React from 'react';
import PropTypes from 'prop-types';
import {shallow, mount} from 'enzyme';
import {assert} from 'chai';
import Calendar from './Calendar';
import CalendarMonth from './CalendarMonth';
import CalendarYear from './CalendarYear';
import DateDisplay from './DateDisplay';
import {addMonths, dateTimeFormat} from './dateUtils';
import getMuiTheme from '../styles/getMuiTheme';
import ReactDOM from 'react-dom';

describe('<Calendar />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const mountWithContext = (node) => mount(node, {
    context: {muiTheme},
    childContextTypes: {muiTheme: PropTypes.object},
  });

  let wrapperNode;
  beforeEach(() => {
    // Pattern from "react-router": http://git.io/vWpfs
    wrapperNode = document.createElement('div');
    document.body.appendChild(wrapperNode);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(wrapperNode);
    wrapperNode.parentNode.removeChild(wrapperNode);
  });

  describe('Next Month Button', () => {
    it('should initially be disabled if the current month is the same as the month in the maxDate prop', () => {
      const initialDate = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      const maxDate = new Date(initialDate.toDateString());

      const wrapper = shallowWithContext(
        <Calendar
          initialDate={initialDate}
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          maxDate={maxDate}
        />
      );

      assert.notOk(wrapper.find('CalendarToolbar').prop('nextMonth'));
    });

    it('should initially be disabled if the current month is after the month in the maxDate prop', () => {
      const initialDate = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      let maxDate = new Date(initialDate.toDateString());
      maxDate = addMonths(maxDate, -1);

      const wrapper = shallowWithContext(
        <Calendar
          initialDate={initialDate}
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          maxDate={maxDate}
        />
      );

      assert.notOk(wrapper.find('CalendarToolbar').prop('nextMonth'));
    });

    it('should initially enable the next month button if the current month is before the maxDate prop', () => {
      const initialDate = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      let maxDate = new Date(initialDate.toDateString());
      maxDate = addMonths(maxDate, 1);

      const wrapper = shallowWithContext(
        <Calendar
          initialDate={initialDate}
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          maxDate={maxDate}
        />
      );

      assert.ok(wrapper.find('CalendarToolbar').prop('nextMonth'));
    });

    it('should reenable the next month button when the current month is before the maxDate prop', () => {
      const initialDate = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      const maxDate = new Date(initialDate.toDateString());

      const wrapper = shallowWithContext(
        <Calendar
          initialDate={initialDate}
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          maxDate={maxDate}
        />
      );

      wrapper.instance().handleMonthChange(-1);
      wrapper.update();

      assert.ok(wrapper.find('CalendarToolbar').prop('nextMonth'));
    });

    it('should redisable the next month button when the current month is the same as the maxDate prop', () => {
      const initialDate = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      let maxDate = new Date(initialDate.toDateString());
      maxDate = addMonths(maxDate, 1);

      const wrapper = shallowWithContext(
        <Calendar
          initialDate={initialDate}
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          maxDate={maxDate}
        />
      );

      wrapper.instance().handleMonthChange(1);
      wrapper.update();

      assert.notOk(wrapper.find('CalendarToolbar').prop('nextMonth'));
    });
  });

  describe('Previous Month Button', () => {
    it(`should initially disable the previous month button if the current month
      is the same as the minDate month prop`, () => {
      const initialDate = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      const minDate = new Date(initialDate.toDateString());

      const wrapper = shallowWithContext(
        <Calendar
          initialDate={initialDate}
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          minDate={minDate}
        />
      );

      assert.notOk(wrapper.find('CalendarToolbar').prop('prevMonth'));
    });

    it(`should initially disable the previous month button if the current month
      is before the minDate month prop`, () => {
      const initialDate = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      let minDate = new Date(initialDate.toDateString());
      minDate = addMonths(initialDate, 1);

      const wrapper = shallowWithContext(
        <Calendar
          initialDate={initialDate}
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          minDate={minDate}
        />
      );

      assert.notOk(wrapper.find('CalendarToolbar').prop('prevMonth'));
    });

    it('should initially enable the previous month button if the current month is after the minDate month prop', () => {
      const initialDate = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      let minDate = new Date(initialDate.toDateString());
      minDate = addMonths(initialDate, -1);

      const wrapper = shallowWithContext(
        <Calendar
          initialDate={initialDate}
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          minDate={minDate}
        />
      );

      assert.ok(wrapper.find('CalendarToolbar').prop('prevMonth'));
    });

    it('should enable the previous month button when the current month is after the minDate month prop', () => {
      const initialDate = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      const minDate = new Date(initialDate.toDateString());

      const wrapper = shallowWithContext(
        <Calendar
          initialDate={initialDate}
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          minDate={minDate}
        />
      );

      wrapper.instance().handleMonthChange(1);
      wrapper.update();

      assert.ok(wrapper.find('CalendarToolbar').prop('prevMonth'));
    });

    it('should disable the previous month button when the current month is the same as the minDate month prop', () => {
      const initialDate = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      let minDate = new Date(initialDate.toDateString());
      minDate = addMonths(minDate, -1);

      const wrapper = shallowWithContext(
        <Calendar
          initialDate={initialDate}
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          minDate={minDate}
        />
      );

      wrapper.instance().handleMonthChange(-1);
      wrapper.update();

      assert.notOk(wrapper.find('CalendarToolbar').prop('prevMonth'));
    });
  });

  describe('Date Display', () => {
    it('should be visible by default', () => {
      const wrapper = shallowWithContext(
        <Calendar
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          mode="landscape"
        />
      );

      assert.strictEqual(wrapper.find(DateDisplay).length, 1, 'should show date display');
      assert.strictEqual(wrapper.props().style.width, 479, 'should allow space for date display');
    });

    it('should be hidden when hideCalendarDate is set', () => {
      const wrapper = shallowWithContext(
        <Calendar
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          mode="landscape"
          hideCalendarDate={true}
        />
      );

      assert.strictEqual(wrapper.find(DateDisplay).length, 0, 'should hide date display');
      assert.strictEqual(wrapper.props().style.width, 310, 'should not allow space for date display');
    });
  });

  describe('initial state', () => {
    it('should display the month day pick view by default', () => {
      const wrapper = shallowWithContext(
        <Calendar
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
        />
      );

      assert.strictEqual(wrapper.find(CalendarMonth).length, 1, 'should have the calendar month select');
    });

    it('should display the year selection view when openToYearSelection is true', () => {
      const wrapper = shallowWithContext(
        <Calendar
          DateTimeFormat={dateTimeFormat}
          locale="en-US"
          openToYearSelection={true}
        />
      );

      assert.strictEqual(wrapper.find(CalendarYear).length, 1, 'should have the year select');
    });

    describe('ID handling', () => {
      it('should produce an ID when one has not been provided', () => {
        const wrapper = shallowWithContext(
          <Calendar
            DateTimeFormat={dateTimeFormat}
            locale="en-US"
          />
        );

        assert.ok(wrapper.prop('id'), 'an ID value should be generated');
      });

      it('should use the given ID', () => {
        const id = 'methuselah';
        const wrapper = shallowWithContext(
          <Calendar
            DateTimeFormat={dateTimeFormat}
            locale="en-US"
            id={id}
          />
        );

        assert.strictEqual(wrapper.prop('id'), id, `the provided id ${id} was not used`);
      });
    });

    describe('Year picker activation', () => {
      const year = (new Date()).getFullYear();
      const yearPickerId = 'displayYear';
      const wrapper = mountWithContext(<Calendar DateTimeFormat={dateTimeFormat} locale="en-US" />);

      it('should have the current year as the year picker label', () => {
        // the year div on the calendar should have an ID of displayYear
        const calendar = wrapper.find({id: `${yearPickerId}`});
        assert.ok(calendar.length > 0, 'Could not find the displayYear div on the Calendar Component');
        assert.ok(calendar.text() === `${year}`, 'The display year for the year picker should default to this year.');
      });

      it('should open the year picker when the year is clicked', () => {
        // attempt to activate the year selector
        const yearButton = () => wrapper.find({id: `${yearPickerId}`});
        yearButton().simulate('click');

        // there should be a button generated with the ID 'YearButton-2018' (if its still 2018)
        const yearSelector = wrapper.find({id: `YearButton-${year}`});
        assert.ok(yearSelector.length > 0, 'Could not find the current year in the list of years to pick from');
        assert.ok(yearSelector.text() === `${year}`, 'The displayed year for this year was not the value expected');
        assert.ok(yearSelector.type() === 'button', 'The selector for the current year is not a button');
      });

      it('should open the year picker when the year is pressed by the keyboad', () => {
        // attempt to activate the year selector
        const yearButton = () => wrapper.find({id: `${yearPickerId}`});
        yearButton().simulate('keyPress', 32);  // press space

        // there should be a button generated with the ID 'YearButton-2018' (if its still 2018) - same as mouse click
        const yearSelector = wrapper.find({id: `YearButton-${year}`});
        assert.ok(yearSelector.length > 0, 'Could not find the current year in the list of years to pick from');
        assert.ok(yearSelector.text() === `${year}`, 'The displayed year for this year was not the value expected');
        assert.ok(yearSelector.type() === 'button', 'The selector for the current year is not a button');
      });
    });
  });
});
