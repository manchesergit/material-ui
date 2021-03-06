/* eslint-env mocha */
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import {mount, shallow} from 'enzyme';
import {assert} from 'chai';

import RaisedButton from './RaisedButton';
import ActionAndroid from '../svg-icons/action/android';
import getMuiTheme from '../styles/getMuiTheme';
import mute from 'mute';

describe('<RaisedButton />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const mountWithContext = (node) => mount(node, {context: {muiTheme}});
  const testChildren = <span className="unique">Hello World</span>;

  it('renders an enhanced button inside paper', () => {
    const wrapper = shallowWithContext(
      <RaisedButton>Button</RaisedButton>
    );
    assert.ok(wrapper.is('Paper'));
    assert.ok(wrapper.childAt(0).is('EnhancedButton'));
  });

  it('renders children', () => {
    const wrapper = shallowWithContext(
      <RaisedButton>{testChildren}</RaisedButton>
    );
    assert.ok(wrapper.contains(testChildren), 'should contain the children');
  });

  it('passes props to the enhanced button', () => {
    const props = {
      ariaLabel: 'Say hello world',
      disabled: true,
      href: 'http://google.com',
      name: 'Hello World',
    };

    const wrapper = shallowWithContext(
      <RaisedButton {...props}>Button</RaisedButton>
    );

    assert.ok(wrapper.childAt(0).is('EnhancedButton'));
    assert.ok(wrapper.childAt(0).is(props));
  });

  it('renders a label with an icon', () => {
    const wrapper = shallowWithContext(
      <RaisedButton
        icon={<span className="test-icon" />}
        label={<span className="test-label">Hello</span>}
      />
    );
    const icon = wrapper.find('.test-icon');
    const label = wrapper.find('.test-label');
    assert.ok(icon.is('span'));
    assert.strictEqual(label.children().node, 'Hello', 'says hello');
  });

  it('renders a hover overlay of equal height to the button', () => {
    const wrappers = [
      () => mountWithContext(
        <RaisedButton>Hello World</RaisedButton>
      ),
      () => mountWithContext(
        <RaisedButton
          backgroundColor="#a4c639"
          icon={<ActionAndroid />}
        />
      ),
    ];

    wrappers.forEach((createWrapper) => {
      const wrapper = createWrapper();
      wrapper.simulate('mouseEnter');

      const overlay = wrapper.ref('overlay');
      const button = ReactDOM.findDOMNode(
        TestUtils.findRenderedDOMComponentWithTag(
          wrapper.instance(),
          'button'
        )
      );

      assert.strictEqual(
        overlay.node.clientHeight,
        button.clientHeight,
        'overlay height should match the button height'
      );
    });
  });

  it('inherits fontSize from theme', () => {
    const wrapper = shallowWithContext(
      <RaisedButton label="test" />
    );

    assert.strictEqual(wrapper.contains('test'), true);
    assert.equal(
      wrapper.find('[children="test"]').prop('style').fontSize,
      muiTheme.raisedButton.fontSize
    );
  });

  it('if an svg icon is provided, renders the icon with the correct color', () => {
    const icon = <svg color="red" />;
    const wrapper = shallowWithContext(
      <RaisedButton icon={icon} />
    );

    const svgIcon = wrapper.find('svg');
    assert.strictEqual(svgIcon.length, 1, 'should have an svg icon');
    assert.strictEqual(svgIcon.node.props.color, 'red', 'should have color set as the prop');
  });

  describe('validateLabel', () => {
    const validateLabel = RaisedButton.propTypes.label;

    it('should throw when using wrong label', () => {
      assert.strictEqual(validateLabel({}, 'label', 'RaisedButton').message,
        'Required prop label or children or icon was not specified in RaisedButton.',
        'should return an error'
      );
    });

    it('should not throw when using a valid label', () => {
      assert.strictEqual(validateLabel({
        label: 0,
      }, 'label', 'RaisedButton'), undefined);
    });
  });

  describe('hover state', () => {
    it('should reset the hover state when disabled', () => {
      const wrapper = shallowWithContext(
        <RaisedButton label="foo" />
      );

      wrapper.children().simulate('mouseEnter');
      assert.strictEqual(wrapper.state().hovered, true, 'should respond to the event');
      wrapper.setProps({
        disabled: true,
      });
      assert.strictEqual(wrapper.state().hovered, false, 'should reset the state');
    });
  });

  describe('prop: icon', () => {
    it('should keep the style set on the icon', () => {
      const wrapper = shallowWithContext(
        <RaisedButton icon={<ActionAndroid style={{foo: 'bar'}} />} />
      );

      assert.strictEqual(wrapper.find(ActionAndroid).props().style.foo, 'bar');
    });
  });

  describe('a11y warning checks', () => {
    it('throws an error if no for attribute on input', () => {
      const inputId = 'test-input-htmlFor';
      const buttonId = 'test-button-htmlFor';
      const unmute = mute(); // turn off the stdout and stderr so the warning isn't shown on the console output

      assert.throws(() => mountWithContext(
        <RaisedButton label="test-button" id={buttonId}>
          <input type="text" id={inputId} />
        </RaisedButton>
      ), Error);

      unmute(); // stdout and error back on again
    });

    it('throws error for no aria-labelledby', () => {
      const inputId = 'test-input-labbelledby';
      const buttonId = 'test-button-labbelledby';
      const unmute = mute(); // turn off the stdout and stderr so the warning isn't shown on the console output

      assert.throws(() => mountWithContext(
        <RaisedButton label="test-button" id={buttonId} htmlFor={inputId}>
          <input type="text" id={inputId} />
        </RaisedButton>
      ), Error);

      unmute(); // stdout and error back on again
    });

    it('throws error for no aria-describedby', () => {
      const inputId = 'test-input-describedby';
      const buttonId = 'test-button-describedby';
      const unmute = mute(); // turn off the stdout and stderr so the warning isn't shown on the console output

      assert.throws(() => mountWithContext(
        <RaisedButton label="test-button" id={buttonId} htmlFor={inputId}>
          <input type="text" id={inputId} aria-labelledby={buttonId} />
        </RaisedButton>
      ), Error);

      unmute(); // stdout and error back on again
    });

    it('No a11y check errors', () => {
      const inputId = 'test-input-noError';
      const buttonId = 'test-button-noError';
      const wrapper = mountWithContext(
        <RaisedButton label="test-button" id={buttonId} htmlFor={inputId}>
          <input
            type="text"
            id={inputId}
            aria-labelledby={buttonId}
            aria-describedby={buttonId}
          />
        </RaisedButton>
      );

      assert.ok(wrapper.find(buttonId));
    });
  });

  describe('ID handeling and generation', () => {
    it('should use the supplied id without overriding', () => {
      const id = '12345';
      const wrapper = shallowWithContext(
        <RaisedButton id={id} label="idPassthrough" />
      );
      // we have to go to the children of the RaisedButton as the button is constructed with paper at the top
      // and the button somewhere after that
      assert.strictEqual(wrapper.children().prop('id'), id, 'should use provided id');
    });

    it('should generate an id if one not supplied', () => {
      const classname = 'abcde';
      const wrapper = mountWithContext(
        <RaisedButton name={classname} label="idGeneration" />
      );

      assert.ok(wrapper.children().prop('id'), 'should generate an id if not supplied');
    });
  });
});
