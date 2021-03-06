/* @flow */

import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { MKButton } from 'react-native-material-kit';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showModalAdding } from 'actions';
import { Color } from '../common';
import WriteImage from './img/write.png';

const PlainFab = MKButton.plainFab().withBackgroundColor('rgba(255, 255, 255, 0)').build();

class PomodoroButtonAdd extends Component
{
  props: {
    showModalAdding: (visible: boolean) => Object,
    buttonEnabled: boolean
  };

  render() {
    const { writeImageStyle, buttonStyle } = styles;
    const { buttonEnabled, showModalAdding } = this.props;

    if (buttonEnabled) {
      return (
        <PlainFab style={buttonStyle} onPress={ ()=>showModalAdding(true) }>
          <Image source={WriteImage} style={writeImageStyle} />
        </PlainFab>
      );
    } else {
      return <View style={buttonStyle} />;
    }
  }
}

const styles = {
  buttonStyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeImageStyle: {
    tintColor: Color.White,
    transform: [{ scale: .6 }],
  },
};

const mapDispatchToProps = dispatch => bindActionCreators({
  showModalAdding,
}, dispatch);

export default connect(null, mapDispatchToProps)(PomodoroButtonAdd);
