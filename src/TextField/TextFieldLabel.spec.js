/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import TextFieldLabel from './TextFieldLabel';
import getMuiTheme from '../styles/getMuiTheme';

describe('<TextFieldLabel>', () => {
  it('No children should render as span', () => {
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
  it('One child should render as span', () => {
    const wrapper = shallow(
      <TextFieldLabel
        muiTheme={getMuiTheme()}
        shrink={false}
        style={{color: 'regularcolor'}}
        shrinkStyle={{color: 'focuscolor'}}
      >
        test text for label
      </TextFieldLabel>
    );
    expect(wrapper.type()).to.equal('span');
  });
  it('Multiple children should render as label', () => {
    const wrapper = shallow(
      <TextFieldLabel
        muiTheme={getMuiTheme()}
        shrink={false}
        style={{color: 'regularcolor'}}
        shrinkStyle={{color: 'focuscolor'}}
      ><div /><div /></TextFieldLabel>
    );

    expect(wrapper.type()).to.equal('label');
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
});
