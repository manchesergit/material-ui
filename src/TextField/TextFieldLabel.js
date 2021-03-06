import React from 'react';
import PropTypes from 'prop-types';
import transitions from '../styles/transitions';
import makeUniqueIdForElement from '../utils/uniqueId';

function getStyles(props) {
  const defaultStyles = {
    position: 'absolute',
    lineHeight: '22px',
    top: 38,
    transition: transitions.easeOut(),
    zIndex: 1, // Needed to display label above Chrome's autocomplete field background
    transform: 'scale(1) translate(0, 0)',
    transformOrigin: 'left top',
    pointerEvents: 'auto',
    userSelect: 'none',
  };

  const shrinkStyles = props.shrink ? Object.assign({
    transform: 'scale(0.75) translate(0, -28px)',
    pointerEvents: 'none',
  }, props.shrinkStyle) : null;

  return {
    root: Object.assign(defaultStyles, props.style, shrinkStyles),
  };
}

const TextFieldLabel = (props) => {
  const {
    id,
    muiTheme,
    className,
    children,
    htmlFor,
    onClick,
  } = props;

  const {prepareStyles} = muiTheme;
  const styles = getStyles(props);
  const roleLabel = 'textbox';
  const baseId = id || makeUniqueIdForElement(this);

  // if we have a html for value then we are rendering an label to back refer
  // to an input other wise its a selectfield so make it a span to
  // prevent orphaned label errors on a11y tests
  const Container = htmlFor ? 'label' : 'span';

  return (
    <Container
      id={baseId}
      role={roleLabel}
      className={className}
      style={prepareStyles(styles.root)}
      htmlFor={htmlFor}
      onClick={onClick}
    >
      {children}
    </Container>
  );
};

TextFieldLabel.propTypes = {
  /**
   * The label contents.
   */
  children: PropTypes.node,
  /**
   * The css class name of the root element.
   */
  className: PropTypes.string,
  /**
   * Disables the label if set to true.
   */
  disabled: PropTypes.bool,
  /**
   * The id of the target element that this label should refer to.
   */
  htmlFor: PropTypes.string,
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
   * Callback function for when the label is selected via a click.
   *
   * @param {object} event Click event targeting the text field label.
   */
  onClick: PropTypes.func,
  /**
   * True if the floating label should shrink.
   */
  shrink: PropTypes.bool,
  /**
   * Override the inline-styles of the root element when shrunk.
   */
  shrinkStyle: PropTypes.object,
  /**
   * Override the inline-styles of the root element.
   */
  style: PropTypes.object,
};

TextFieldLabel.defaultProps = {
  disabled: false,
  shrink: false,
};

export default TextFieldLabel;
