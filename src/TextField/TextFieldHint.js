import React from 'react';
import PropTypes from 'prop-types';
import transitions from '../styles/transitions';

function getStyles(props) {
  const {
    muiTheme: {
      textField: {
        hintColor,
      },
    },
    show,
  } = props;

  return {
    root: {
      position: 'absolute',
      opacity: show ? 1 : 0,
      color: hintColor,
      transition: transitions.easeOut(),
      bottom: 12,
    },
  };
}

const TextFieldHint = (props) => {
  const {
    id,
    muiTheme: {
      prepareStyles,
    },
    style,
    text,
  } = props;

  const styles = getStyles(props);

  const uniqueId = `TextFieldHint-${text}-${Math.floor(Math.random() * 0xFFFF)}`;
  const baseId = id || uniqueId.replace(/[^A-Za-z0-9-]/gi, '');

  return (
    <div id={baseId} style={prepareStyles(Object.assign(styles.root, style))}>
      {text}
    </div>
  );
};

TextFieldHint.propTypes = {
  /**
   * The id value used for the component.
   * This will be used as a base for all child components also.
   * If not provided the class name along with appropriate properties and a random number will be used.
   */
  id: PropTypes.string,
  /**
   * @ignore
   * The material-ui theme applied to this component.
   */
  muiTheme: PropTypes.object.isRequired,
  /**
   * True if the hint text should be visible.
   */
  show: PropTypes.bool,
  /**
   * Override the inline-styles of the root element.
   */
  style: PropTypes.object,
  /**
   * The hint text displayed.
   */
  text: PropTypes.node,
};

TextFieldHint.defaultProps = {
  show: true,
};

export default TextFieldHint;
