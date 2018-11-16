import React, {Component, Children, isValidElement} from 'react';
import PropTypes from 'prop-types';
import Subheader from '../Subheader';
import makeUniqueIdForElement from '../utils/uniqueId';

class List extends Component {
  static propTypes = {
    /**
     * These are usually `ListItem`s that are passed to
     * be part of the list.
     */
    children: PropTypes.node,
    /**
     * The ID to set on the list item and its children.
     */
    id: PropTypes.string,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.uniqueId = makeUniqueIdForElement(this);
  }

  render() {
    const {
      children,
      id,
      style,
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;

    let hasSubheader = false;

    const firstChild = Children.toArray(children)[0];
    if (isValidElement(firstChild) && firstChild.type === Subheader) {
      hasSubheader = true;
    }

    const styles = {
      root: {
        padding: `${hasSubheader ? 0 : 8}px 0px 8px 0px`,
      },
    };

    const baseId = id || this.uniqueId;

    return (
      <div id={baseId} role="list" {...other} style={prepareStyles(Object.assign(styles.root, style))}>
        {children}
      </div>
    );
  }
}

export default List;
