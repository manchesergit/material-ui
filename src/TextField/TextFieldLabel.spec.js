/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import TextFieldLabel from './TextFieldLabel';
import getMuiTheme from '../styles/getMuiTheme';

describe('<TextFieldLabel>', () => {
  it('With htmlFor back reference should render as label', () => {
    const wrapper = shallow(
      <TextFieldLabel
        muiTheme={getMuiTheme()}
        shrink={false}
        style={{color: 'regularcolor'}}
        shrinkStyle={{color: 'focuscolor'}}
        htmlFor="someid" // simulate usage on a textfield rendered as input
      />                 // so that label and input can be tied by the for attribute
    );
    expect(wrapper.type()).to.equal('label');
  });
  it('No htmlFor back reference should render span', () => {
    const wrapper = shallow(
      <TextFieldLabel
        muiTheme={getMuiTheme()}
        shrink={false}
        style={{color: 'regularcolor'}}
        shrinkStyle={{color: 'focuscolor'}}
      />
    );

    expect(wrapper.type()).to.equal('span');
  });
  it('uses focus styles', () => {
    const wrapper = shallow(
      <TextFieldLabel
        muiTheme={getMuiTheme()}
        shrink={false}
        style={{color: 'regularcolor'}}
        shrinkStyle={{color: 'focuscolor'}}
      ><div /></TextFieldLabel>
    );

    expect(wrapper.prop('style').color).to.equal('regularcolor');

    wrapper.setProps({shrink: true});
    expect(wrapper.prop('style').color).to.equal('focuscolor');
  });

  describe('ID handeling and generation', () => {
    it('should use the supplied id without overriding', () => {
      const id = '12345';
      const wrapper = shallow(
        <TextFieldLabel id={id} muiTheme={getMuiTheme()}/>
      );
      expect(wrapper.prop('id')).to.equal(id);
    });

    it('should generate an id if one not supplied', () => {
      const classname = 'abcde';
      const wrapper = shallow(
        <TextFieldLabel name={classname} muiTheme={getMuiTheme()}/>
      );
      expect(wrapper.prop('id')).to.exist;
      expect(wrapper.prop('id').length).to.be.above('TextFieldLabel'.length);
    });
  });
});
