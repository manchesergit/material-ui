import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactTransitionGroup from 'react-transition-group/TransitionGroup';
import ExpandTransitionChild from './ExpandTransitionChild';
import makeUniqueIdForElement from '../utils/uniqueId';

class ExpandTransition extends Component {
  static propTypes = {
    children: PropTypes.node,
    enterDelay: PropTypes.number,
    expandTransitionChildStyle: PropTypes.object,
    id: PropTypes.string,
    loading: PropTypes.bool,
    open: PropTypes.bool,
    style: PropTypes.object,
    transitionDelay: PropTypes.number,
    transitionDuration: PropTypes.number,
  };

  static defaultProps = {
    enterDelay: 0,
    transitionDelay: 0,
    transitionDuration: 450,
    loading: false,
    open: false,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.uniqueId = makeUniqueIdForElement(this);
  }

  renderChildren(children, idBase) {
    const {enterDelay, transitionDelay, transitionDuration, expandTransitionChildStyle} = this.props;
    return React.Children.map(children, (child) => {
      const expandTransitionChildId = `${idBase}-ExpandTransitionChild-${Math.floor(Math.random() * 0xFFFF)}`;
      return (
        <ExpandTransitionChild
          id={expandTransitionChildId}
          enterDelay={enterDelay}
          transitionDelay={transitionDelay}
          transitionDuration={transitionDuration}
          key={child.key}
          style={expandTransitionChildStyle}
        >
          {child}
        </ExpandTransitionChild>
      );
    }, this);
  }

  render() {
    const {
      id,
      children,
      enterDelay, // eslint-disable-line no-unused-vars
      loading,
      open,
      style,
      transitionDelay, // eslint-disable-line no-unused-vars
      transitionDuration, // eslint-disable-line no-unused-vars
      expandTransitionChildStyle, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    const baseId = id || this.uniqueId;
    const reactTransitionGroupId = `${baseId}-reactTransitionGroup`;
    const {prepareStyles} = this.context.muiTheme;

    const mergedRootStyles = Object.assign({}, {
      position: 'relative',
      overflow: 'hidden',
      height: 'auto',
    }, style);

    const newChildren = loading ? [] : this.renderChildren(children);

    return (
      <ReactTransitionGroup
        id={reactTransitionGroupId}
        style={prepareStyles(mergedRootStyles)}
        component="div"
        {...other}
      >
        {open && newChildren}
      </ReactTransitionGroup>
    );
  }
}

export default ExpandTransition;
