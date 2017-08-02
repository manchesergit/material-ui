/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import Snackbar from './Snackbar';
import SnackbarBody from './SnackbarBody';
import getMuiTheme from '../styles/getMuiTheme';

describe('<Snackbar />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});

  describe('prop: open', () => {
    it('should be hidden when open is false', () => {
      const wrapper = shallowWithContext(
        <Snackbar open={false} message="Message" />
      );

      assert.strictEqual(
        wrapper.find('div').at(0).node.props.style.visibility,
        'hidden',
        'The element should be hidden.'
      );
    });

    it('should be hidden when open is true', () => {
      const wrapper = shallowWithContext(
        <Snackbar open={true} message="Message" />
      );

      assert.strictEqual(
        wrapper.find('div').at(0).node.props.style.visibility,
        'visible',
        'The element should be hidden.'
      );
    });
  });

  it('should show the next message after an update', (done) => {
    const wrapper = shallowWithContext(
      <Snackbar open={true} message="First message" />
    );

    wrapper.setProps({
      message: 'Second message',
    });
    assert.strictEqual(wrapper.state('message'), 'First message');

    setTimeout(() => {
      assert.strictEqual(wrapper.state('message'), 'Second message',
        'Should take into account the next message');
      done();
    }, 500);
  });

  it('should show the latest message of consecutive updates', (done) => {
    const wrapper = shallowWithContext(
      <Snackbar open={false} message="First message" />
    );

    wrapper.setProps({
      open: true,
      message: 'Second message',
    });
    assert.strictEqual(wrapper.state('message'), 'Second message');
    wrapper.setProps({
      open: true,
      message: 'Third message',
    });
    assert.strictEqual(wrapper.state('message'), 'Second message');

    setTimeout(() => {
      assert.strictEqual(wrapper.state('message'), 'Third message',
        'Should take into account the latest message');
      done();
    }, 500);
  });

  describe('prop: contentStyle', () => {
    it('should apply the style on the right element', () => {
      const contentStyle = {};
      const wrapper = shallowWithContext(
        <Snackbar open={false} message="" contentStyle={contentStyle} />
      );

      assert.strictEqual(
        wrapper.find(SnackbarBody).props().contentStyle,
        contentStyle
      );
    });
  });

  describe('ID handling', () => {
    let Id = '';
    it('should have a unique value in ID field', () => {
      const wrapper = shallowWithContext(
        <Snackbar open={true} message="" />
          );
      Id = wrapper.find(SnackbarBody).props('div > div > span').contentId;
    });
    it('should have a unique value in ID field', () => {
      const wrapper = shallowWithContext(
        <Snackbar open={true} message="" />
          );
      const secondID = wrapper.find(SnackbarBody).props('div > div > span').contentId;
      assert.notEqual(Id, secondID, 'These IDs are not equal');
    });

    it('should use the supplied ID without overriding', () => {
      const id = '12345';
      const wrapper = shallowWithContext(
        <Snackbar contentId={id} open={true} message="" />
      );
      assert.strictEqual(wrapper.props().children.props.contentId, id, 'should use provided ID');
    });
  });
});
