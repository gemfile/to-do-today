import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Card, CardSection, Input, Button } from './common';
import * as actions from './actions';
import PomodoroImage from './PomodoroImage';

class Writing extends Component {
  state = {
    inputIsFocused: false,
    inputValue: ''
  }

  onFocus() {
    this.setState({ inputIsFocused: true });
  }

  onChangeText(text) {
    this.setState({ inputValue: text });
  }

  onSubmitEditing() {
    const savedValue = this.state.inputValue;
    this.setState({
      inputIsFocused: false,
      inputValue: ''
    });
    this.input.clear();

    if (savedValue !== '') {
      this.props.addTodo(savedValue);
    }

    console.log(`onSubmitEditing : ${savedValue}`);
  }

  renderButton() {
    if (this.state.inputIsFocused || this.state.inputValue !== '') {
      return (
        <View style={styles.lowerContainerStyle}>
          <Button
            onPress={this.onSubmitEditing.bind(this)}
            disabled={this.state.inputValue === ''}
          >
            Add
          </Button>
        </View>
      );
    }
  }

  render() {
    const {
      wholeContainerStyle,
      upperContainerStyle,
      imageContainerStyle,
      imageStyle,
      inputContainerStyle,
    } = styles;

    return (
      <Card>
        <CardSection>
          <View style={wholeContainerStyle}>

            <View style={upperContainerStyle}>
              <PomodoroImage
                imageContainerStyle={imageContainerStyle}
                imageStyle={imageStyle}
              />
              <View style={inputContainerStyle}>
                <Input
                  placeholder={'What will you do today?'}
                  onFocus={this.onFocus.bind(this)}
                  onChangeText={this.onChangeText.bind(this)}
                  onSubmitEditing={this.onSubmitEditing.bind(this)}
                  value={this.state.inputValue}
                  editable={this.state.inputIsFocused}
                  ref={(component) => { this.input = component; }}
                />
              </View>
            </View>

            { this.renderButton() }

          </View>
        </CardSection>
      </Card>
    );
  }
}

const styles = {
  wholeContainerStyle: {
    flex: 1,
    flexDirection: 'column',
  },

  upperContainerStyle: {
    height: 48,
    flex: 1,
    flexDirection: 'row',
  },
  imageContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    width: 36,
    height: 36,
  },
  inputContainerStyle: {
    flex: 6,
    marginRight: 7
  },

  lowerContainerStyle: {
    height: 40,
    width: 150,
    alignSelf: 'flex-end',
    padding: 6,
  }
};

export default connect(null, actions)(Writing);
