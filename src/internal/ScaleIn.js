import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactTransitionGroup from 'react-transition-group/TransitionGroup';
import ScaleInChild from './ScaleInChild';

class ScaleIn extends Component {
  static propTypes = {
    id: PropTypes.string,
    childStyle: PropTypes.object,
    children: PropTypes.node,
    enterDelay: PropTypes.number,
    maxScale: PropTypes.number,
    minScale: PropTypes.number,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
  };

  static defaultProps = {
    enterDelay: 0,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const uniqueId = `${this.constructor.name}-${Math.floor(Math.random() * 0xFFFF)}`;
    this.uniqueId = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
  }

  render() {
    const {
      id,
      children,
      childStyle,
      enterDelay,
      maxScale,
      minScale,
      style,
      ...other
    } = this.props;

    const baseId = id || this.uniqueId;
    const {prepareStyles} = this.context.muiTheme;

    const mergedRootStyles = Object.assign({}, {
      position: 'relative',
      height: '100%',
    }, style);

    const newChildren = React.Children.map(children, (child) => {
      const childId = baseId + '-ScaleInChild-'+ Math.floor(Math.random() * 0xFFFF);
      return (
        <ScaleInChild
          id={childId}
          key={child.key}
          enterDelay={enterDelay}
          maxScale={maxScale}
          minScale={minScale}
          style={childStyle}
        >
          {child}
        </ScaleInChild>
      );
    });

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

export default ScaleIn;
