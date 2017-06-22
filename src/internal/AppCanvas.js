import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AppCanvas extends Component {
  static propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
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
      baseTheme,
      prepareStyles,
    } = this.context.muiTheme;

    const styles = {
      height: '100%',
      color: baseTheme.palette.textColor,
      backgroundColor: baseTheme.palette.canvasColor,
      direction: 'ltr',
    };

    const newChildren = React.Children.map(this.props.children, (currentChild) => {
      if (!currentChild) { // If undefined, skip it
        return null;
      }

      switch (currentChild.type.muiName) {
        case 'AppBar' :
          return React.cloneElement(currentChild, {
            style: Object.assign({}, currentChild.props.style, {
              position: 'fixed',
            }),
          });
        default:
          return currentChild;
      }
    }, this);

    const baseId = id || this.uniqueId;

    return (
      <div id={baseId} style={prepareStyles(styles)}>
        {newChildren}
      </div>
    );
  }
}

export default AppCanvas;
