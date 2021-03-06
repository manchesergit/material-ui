import React, {Component} from 'react';
import PropTypes from 'prop-types';
import makeUniqueIdForElement from '../utils/uniqueId';

/**
 *  BeforeAfterWrapper
 *    An alternative for the ::before and ::after css pseudo-elements for
 *    components whose styles are defined in javascript instead of css.
 *
 *  Usage: For the element that we want to apply before and after elements to,
 *    wrap its children with BeforeAfterWrapper. For example:
 *
 *                                            <Paper>
 *  <Paper>                                     <div> // See notice
 *    <BeforeAfterWrapper>        renders         <div/> // before element
 *      [children of paper]       ------>         [children of paper]
 *    </BeforeAfterWrapper>                       <div/> // after element
 *  </Paper>                                    </div>
 *                                            </Paper>
 *
 *  Notice: Notice that this div bundles together our elements. If the element
 *    that we want to apply before and after elements is a HTML tag (i.e. a
 *    div, p, or button tag), we can avoid this extra nesting by passing using
 *    the BeforeAfterWrapper in place of said tag like so:
 *
 *  <p>
 *    <BeforeAfterWrapper>   do this instead   <BeforeAfterWrapper elementType='p'>
 *      [children of p]          ------>         [children of p]
 *    </BeforeAfterWrapper>                    </BeforeAfterWrapper>
 *  </p>
 *
 *  BeforeAfterWrapper features spread functionality. This means that we can
 *  pass HTML tag properties directly into the BeforeAfterWrapper tag.
 *
 *  When using BeforeAfterWrapper, ensure that the parent of the beforeElement
 *  and afterElement have a defined style position.
 */

const styles = {
  box: {
    boxSizing: 'border-box',
  },
};

class BeforeAfterWrapper extends Component {
  static propTypes = {
    afterElementType: PropTypes.string,
    afterStyle: PropTypes.object,
    beforeElementType: PropTypes.string,
    beforeStyle: PropTypes.object,
    children: PropTypes.node,
    elementType: PropTypes.string,
    id: PropTypes.string,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
  };

  static defaultProps = {
    beforeElementType: 'div',
    afterElementType: 'div',
    elementType: 'div',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.uniqueId = makeUniqueIdForElement(this);
  }

  render() {
    const {
      id,
      beforeStyle,
      afterStyle,
      beforeElementType, // eslint-disable-line no-unused-vars
      afterElementType, // eslint-disable-line no-unused-vars
      elementType, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const baseId = id || this.uniqueId;

    let beforeElement;
    let afterElement;

    if (beforeStyle) {
      beforeElement = React.createElement(this.props.beforeElementType,
        {
          style: prepareStyles(Object.assign({}, styles.box, beforeStyle)),
          key: '::before',
          id: `${baseId}-before`,
        });
    }

    if (afterStyle) {
      afterElement = React.createElement(this.props.afterElementType,
        {
          style: prepareStyles(Object.assign({}, styles.box, afterStyle)),
          key: '::after',
          id: `${baseId}-after`,
        });
    }

    const children = [beforeElement, this.props.children, afterElement];

    const props = other;
    props.style = prepareStyles(Object.assign({}, this.props.style));

    return React.createElement(this.props.elementType, props, children);
  }
}

export default BeforeAfterWrapper;
