import { combineReducers } from 'redux';
import TodosStateReducer from './TodosStateReducer';
import NavigationStateReducer from './NavigationStateReducer';
import NavigatingPositionReducer from './NavigatingPositionReducer';
import PomodoroStateReducer from './PomodoroStateReducer';
import TypingStateReducer from './TypingStateReducer';
import ModalVisibleReducer from './ModalVisibleReducer';

export default combineReducers({
  todosState: TodosStateReducer,
  typingState: TypingStateReducer,
  navigationState: NavigationStateReducer,
  navigatingPosition: NavigatingPositionReducer,
  pomodoroState: PomodoroStateReducer,
  modalVisible: ModalVisibleReducer,
});
