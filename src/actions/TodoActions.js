/* @flow */
import Firestack from 'react-native-firestack';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import LocalStorage from '../util/LocalStorage';
import {
  LOADING_TODOS,
  FETCH_TODOS,
  TYPING,
  FOCUS,
  LOADING_POMODORO,
  FETCH_POMODORO,
  START_POMODORO,
  STOP_POMODORO,
  PREPARE_POMODORO,
  CLEAR_POMODORO,
  COMPLETE_POMODORO,
  GET_POMODORO,
  SET_VIAIBLE_OF_CONFIRM_ADDING
} from './ActionType';

const localStorage = new LocalStorage();
const firestack = new Firestack({
  debug: true,
});

// firestack.database.setPersistence(true);
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
    onRegister: (token) => {
      console.log( 'TOKEN:', token );
    },
    // (required) Called when a remote or local notification is opened or received
    onNotification: (notification) => {
        console.log( 'NOTIFICATION:', notification );
    },
    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    // senderID: "YOUR GCM SENDER ID",
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});

const TODOS = 'todos';

const uid = DeviceInfo.getUniqueID();
const rootRefKey = `/users/${uid}`;
const rootRef = firestack.database.ref(rootRefKey);

type Dispatch = (action: Object) => void;
export const fetchTodos = () => (
  (dispatch: Dispatch) => {
    localStorage.getItem(`${rootRefKey}/${TODOS}`, (data) => {
      dispatchFetchingOfTodos(dispatch, {[TODOS]: data}, true);
    })
    .then( () => {
      rootRef.child(`${TODOS}`).on('value', snapshot => {
        dispatchFetchingOfTodos(dispatch, {[TODOS]: snapshot.val()}, false);
      });
    });
  }
);

const dispatchFetchingOfTodos = (dispatch: Dispatch, value: Object, isLocal: boolean) => {
  dispatch({ type: LOADING_TODOS, payload: isLocal });

  if (value !== null) {
    dispatch({ type: FETCH_TODOS, payload: {rootRefKey, value} });
  }
};

export const addTodo = (title: string) => () => {
  rootRef.child(`${TODOS}`).push({
    title,
    count: 0,
    pomodoro: {
      currentState: '',
      nextState: 'start',
    }
  });
};

export const deleteTodo = (todo: Object) => () => {
  let updates = {};
  const { id, title, count, pomodoro } = todo;
  updates[`/${TODOS}/${id}`] = null;
  updates[`/deletes/${id}`] = { title, count, pomodoro };
  rootRef.update(updates);
}

export const archiveTodos = (todos: Array<Object>) => () => {
  let updates = {};
  todos.forEach(todo => {
    const { id, title, count, pomodoro } = todo;
    updates[`/${TODOS}/${id}`] = null;
    updates[`/archives/${id}`] = { title, count, pomodoro };
  });
  rootRef.update(updates);
};

export const deleteTodos = (todos: Array<Object>) => () => {
  let updates = {};
  todos.forEach(todo => {
    const { id, title, count, pomodoro } = todo;
    updates[`/${TODOS}/${id}`] = null;
    updates[`/deletes/${id}`] = { title, count, pomodoro };
  });
  rootRef.update(updates);
};

export const typing = (text: string) => ({
  type: TYPING,
  payload: text
});

export const focus = (isFocused: boolean) => ({
  type: FOCUS,
  payload: isFocused
});

export const fetchPomodoro = () => (
  (dispatch: Dispatch) => {
    localStorage.getItem(`${rootRefKey}/pomodoro`, (data) => {
      dispatchFetchingOfPomodoro(dispatch, {pomodoro: data}, true);
    })
    .then( () => {
      rootRef.child('pomodoro').on('value', snapshot => {
        dispatchFetchingOfPomodoro(dispatch, {pomodoro: snapshot.val()}, false);
      });
    });
  }
);

const dispatchFetchingOfPomodoro = (dispatch: Dispatch, value: Object, isLocal: boolean) => {
  dispatch({ type: LOADING_POMODORO, payload: isLocal });

  if (value !== null) {
    dispatch({ type: FETCH_POMODORO, payload: {rootRefKey, value} });
  }
};

export const startPomodoro = (todo: Object) => {
  const payload = {
    nextState: 'stop',
    currentState: 'started'
  };

  updatePomodoro(todo, payload, new Date().getTime());

  // notifyTickOfPomodoro();
  return { type: START_POMODORO, payload };
}

export const stopPomodoro = (todo: Object) => {
  const payload = {
    nextState: 'start',
    currentState: 'stopped'
  };

  updatePomodoro(todo, payload);

  // PushNotification.cancelAllLocalNotifications();
  return { type: STOP_POMODORO, payload };
};

export const clearPomodoro = () => ({
  type: CLEAR_POMODORO,
});

export const completePomodoro = (todo: Object) => {
  const payload = {
    nextState: 'get',
    currentState: 'completed'
  };
  updatePomodoro(todo, payload);

  return { type: COMPLETE_POMODORO, payload };
};

export const getPomodoro = (todo: Object) => {
  const payload = {
    nextState: 'start',
    currentState: 'got'
  };
  updatePomodoro(todo, payload);

  return { type: GET_POMODORO, payload };
};

const updatePomodoro = (todo, payload, startTime = -1) => {
    const { index, id } = todo;

    const pomodoro = {
      startTime,
      currentPage: index,
      ...payload
    };

    let updates = {};
    updates[`/pomodoro`] = pomodoro
    updates[`/${TODOS}/${id}/pomodoro`] = pomodoro;
    rootRef.update(updates);
};

export const preparePomodoro = (currentPage: number, pomodoroState: Object) => {
  let updates = {};
  updates['/pomodoro'] = {
    ...pomodoroState,
    currentPage,
  };
  rootRef.update(updates);

  return { type: PREPARE_POMODORO, payload: currentPage };
};

export const setVislbleOfConfirmAdding = (visible: boolean) => ({
  type: SET_VIAIBLE_OF_CONFIRM_ADDING,
  payload: visible
});

const notifyTickOfPomodoro = () => {
  PushNotification.localNotification({
    /* Android Only Properties */
    id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
    // ticker: "My Notification Ticker", // (optional)
    autoCancel: true, // (optional) default: true
    largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
    smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
    // bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
    subText: "This is a subText", // (optional) default: none
    color: "red", // (optional) default: system default
    vibrate: false, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    tag: 'some_tag', // (optional) add tag to message
    group: "group", // (optional) add group to message
    ongoing: false, // (optional) set whether this is an "ongoing" notification

    /* iOS and Android properties */
    title: "My Notification Title", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
    message: "My Notification Message", // (required)
    playSound: false, // (optional) default: true
    // soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    // repeatType: 'minute', // (Android only) Repeating interval. Could be one of `week`, `day`, `hour`, `minute, `time`. If specified as time, it should be accompanied by one more parameter 'repeatTime` which should the number of milliseconds between each interval
    // repeatTime: 1000,
    actions: '["Stop"]',  // (Android only) See the doc for notification actions to know more
  });
};
