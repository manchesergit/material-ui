/* eslint-env mocha */
import React from 'react';
import {mount, shallow} from 'enzyme';
import {assert} from 'chai';

import FlatButton from './FlatButton';
import getMuiTheme from '../styles/getMuiTheme';
import ActionAndroid from '../svg-icons/action/android';
import mute from 'mute';

describe('<FlatButton />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const mountWithContext = (node) => mount(node, {context: {muiTheme}});
  const flatButtonTheme = muiTheme.flatButton;
  const testChildren = <div className="unique">Hello World</div>;

  it('renders an enhanced button', () => {
    const wrapper = shallowWithContext(
      <FlatButton>Button</FlatButton>
    );
    assert.ok(wrapper.is('EnhancedButton'));
  });

  it('renders children', () => {
    const wrapper = shallowWithContext(
      <FlatButton>{testChildren}</FlatButton>
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
      <FlatButton {...props}>Button</FlatButton>
    );

    assert.ok(wrapper.is('EnhancedButton'));
    assert.ok(wrapper.is(props));
  });

  it('renders a label with an icon before', () => {
    const wrapper = shallowWithContext(
      <FlatButton
        icon={<span className="test-icon" />}
        label="Hello"
      />
    );
    const icon = wrapper.children().at(0);
    const label = wrapper.children().at(1);
    assert.ok(icon.is('span'));
    assert.ok(icon.hasClass('test-icon'));
    assert.ok(label.is('FlatButtonLabel'));
    assert.strictEqual(label.node.props.label, 'Hello', 'says hello');
  });

  it('renders a label with an icon after', () => {
    const wrapper = shallowWithContext(
      <FlatButton
        icon={<span className="test-icon" />}
        label="Hello"
        labelPosition="before"
      />
    );
    const icon = wrapper.children().at(1);
    const label = wrapper.children().at(0);
    assert.ok(icon.is('span'));
    assert.ok(icon.hasClass('test-icon'));
    assert.ok(label.is('FlatButtonLabel'));
    assert.strictEqual(label.node.props.label, 'Hello', 'says hello');
  });

  it('colors the button the primary theme color', () => {
    const wrapper = shallowWithContext(
      <FlatButton
        label="Button"
        icon={<span className="test-icon" />}
        primary={true}
      />
    );
    const icon = wrapper.children().at(0);
    assert.ok(wrapper.is('EnhancedButton'));
    assert.ok(wrapper.is({
      style: {
        color: flatButtonTheme.primaryTextColor,
      },
    }));
    assert.ok(icon.is('span'));
    assert.ok(icon.is({color: flatButtonTheme.primaryTextColor}));
  });

  it('colors the icon with the passed color in prop', () => {
    const color = 'white';
    const wrapper = shallowWithContext(
      <FlatButton
        backgroundColor="#a4c639"
        hoverColor="#8AA62F"
        icon={<ActionAndroid color={color} />}
      />
    );
    const icon = wrapper.find('ActionAndroid');
    assert.strictEqual(icon.prop('color'), color, 'icon should have same color as that of color prop');
  });

  it('colors the button the secondary theme color', () => {
    const wrapper = shallowWithContext(
      <FlatButton secondary={true} icon={<span className="test-icon" />}>Button</FlatButton>
    );
    assert.ok(wrapper.is('EnhancedButton'));
    assert.ok(wrapper.is({
      style: {
        color: flatButtonTheme.secondaryTextColor,
      },
    }));
  });

  it('overrides hover and background color styles via props', () => {
    const wrapper = shallowWithContext(
      <FlatButton
        backgroundColor="rgba(159,159,159)"
        hoverColor="yellow"
        label="Button"
      />
    );

    assert.ok(wrapper.is({
      style: {
        backgroundColor: 'rgba(159,159,159)',
      },
    }), 'should have the custom background color');

    wrapper.setState({hovered: true});

    assert.ok(wrapper.is({
      style: {
        backgroundColor: 'yellow',
      },
    }), 'should have the custom hover background color');
  });

  it('overrides the ripple color via props', () => {
    const wrapper = shallowWithContext(
      <FlatButton rippleColor="yellow" label="Button" />
    );
    assert.strictEqual(wrapper.node.props.focusRippleColor, 'yellow', 'should be yellow');
    assert.strictEqual(wrapper.node.props.touchRippleColor, 'yellow', 'should be yellow');
  });

  describe('validateLabel', () => {
    const validateLabel = FlatButton.propTypes.label;

    it('should throw when using wrong label', () => {
      assert.strictEqual(validateLabel({}, 'label', 'FlatButton').message,
        'Required prop label or children or icon was not specified in FlatButton.',
        'should return an error'
      );
    });

    it('should not throw when using a valid label', () => {
      assert.strictEqual(validateLabel({
        label: 0,
      }, 'label', 'FlatButton'), undefined);
    });
  });

  describe('hover state', () => {
    it('should reset the hover state when disabled', () => {
      const wrapper = shallowWithContext(
        <FlatButton label="foo" />
      );

      wrapper.simulate('mouseEnter');
      assert.strictEqual(wrapper.state().hovered, true, 'should respond to the event');
      wrapper.setProps({
        disabled: true,
      });
      assert.strictEqual(wrapper.state().hovered, false, 'should reset the state');
    });
  });

  describe('props: icon', () => {
    it('should keep the style set on the icon', () => {
      const wrapper = shallowWithContext(
        <FlatButton icon={<ActionAndroid style={{foo: 'bar'}} />} />
      );

      assert.strictEqual(wrapper.find(ActionAndroid).props().style.foo, 'bar');
    });
  });

  describe('props: other', () => {
    it('should spread other properties to the root element', () => {
      const wrapper = shallowWithContext(
        <FlatButton target="_blank" label="Button" />
      );

      assert.strictEqual(wrapper.props().target, '_blank', 'should be _blank');
    });
  });

  describe('a11y warning checks', () => {
    it('throws an error if no for attribute on input', () => {
      const inputId = 'test-input-htmlFor';
      const buttonId = 'test-button-htmlFor';
      const unmute = mute(); // turn off the stdout and stderr so the warning isn't shown on the console output

      assert.throws(() => mountWithContext(
        <FlatButton label="test-button" id={buttonId}>
          <input type="text" id={inputId} />
        </FlatButton>
      ), Error);

      unmute(); // stdout and error back on again
    });

    it('throws error for no aria-labelledby', () => {
      const inputId = 'test-input-labbelledby';
      const buttonId = 'test-button-labbelledby';
      const unmute = mute(); // turn off the stdout and stderr so the warning isn't shown on the console output

      assert.throws(() => mountWithContext(
        <FlatButton label="test-button" id={buttonId} htmlFor={inputId}>
          <input type="text" id={inputId} />
        </FlatButton>
      ), Error);

      unmute(); // stdout and error back on again
    });

    it('throws error for no aria-describedby', () => {
      const inputId = 'test-input-describedby';
      const buttonId = 'test-button-describedby';
      const unmute = mute(); // turn off the stdout and stderr so the warning isn't shown on the console output

      assert.throws(() => mountWithContext(
        <FlatButton label="test-button" id={buttonId} htmlFor={inputId}>
          <input type="text" id={inputId} aria-labelledby={buttonId} />
        </FlatButton>
      ), Error);

      unmute(); // stdout and error back on again
    });

    it('No a11y check errors', () => {
      const inputId = 'test-input-noError';
      const buttonId = 'test-button-noError';
      const wrapper = mountWithContext(
        <FlatButton label="test-button" id={buttonId} htmlFor={inputId}>
          <input
            type="text"
            id={inputId}
            aria-labelledby={buttonId}
            aria-describedby={buttonId}
          />
        </FlatButton>
      );

      assert.ok(wrapper.find(buttonId));
    });
  });

  describe('ID handeling and generation', () => {
    it('should use the supplied id without overriding', () => {
      const id = '12345';
      const wrapper = shallowWithContext(
        <FlatButton id={id} label="idPassthough"  />
      );
      assert.strictEqual(wrapper.prop('id'), id, 'should use provided id');
    });

    it('should generate an id if one not supplied', () => {
      const classname = 'abcde';
      const wrapper = shallowWithContext(
        <FlatButton name={classname} label="idGeneration" />
      );
      assert.ok(wrapper.prop('id'), 'should generate an id if not supplied');
    });
  });
});
