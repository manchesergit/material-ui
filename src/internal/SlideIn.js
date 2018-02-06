import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactTransitionGroup from 'react-transition-group/TransitionGroup';
import SlideInChild from './SlideInChild';
import makeUniqueIdForElement from '../utils/uniqueId';

class SlideIn extends Component {
  static propTypes = {
    childStyle: PropTypes.object,
    children: PropTypes.node,
    direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),
    enterDelay: PropTypes.number,
    id: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    enterDelay: 0,
    direction: 'left',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.uniqueId = makeUniqueIdForElement(this);
  }

  getLeaveDirection = () => {
    return this.props.direction;
  };

  render() {
    const {
      enterDelay,
      children,
      childStyle,
      direction,
      id,
      style,
      ...other
    } = this.props;

    const baseId = id || this.uniqueId;
    const {prepareStyles} = this.context.muiTheme;

    const mergedRootStyles = Object.assign({}, {
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
    }, style);

    const newChildren = React.Children.map(children, (child) => {
      const childId = `${baseId}-SlideInChild-${Math.floor(Math.random() * 0xFFFF)}`;
      return (
        <SlideInChild
          id={childId}
          key={child.key}
          direction={direction}
          enterDelay={enterDelay}
          getLeaveDirection={this.getLeaveDirection}
          style={childStyle}
        >
          {child}
        </SlideInChild>
      );
    }, this);

    return (
      <ReactTransitionGroup
        id={baseId}
        {...other}
        style={prepareStyles(mergedRootStyles)}
        component="div"
      >
        {newChildren}
      </ReactTransitionGroup>
    );
  }
}

export default SlideIn;
