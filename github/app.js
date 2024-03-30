// Redux actions
const ADD_TASK = 'ADD_TASK';
const DELETE_TASK = 'DELETE_TASK';
const TOGGLE_TASK = 'TOGGLE_TASK';

// Action creators
const addTask = (text) => ({ type: ADD_TASK, payload: { id: Math.random().toString(36).substr(2, 9), text, completed: false } });
const deleteTask = (id) => ({ type: DELETE_TASK, payload: id });
const toggleTask = (id) => ({ type: TOGGLE_TASK, payload: id });

// Redux reducer
const initialState = { tasks: [] };
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case DELETE_TASK:
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case TOGGLE_TASK:
      return { ...state, tasks: state.tasks.map(task => task.id === action.payload ? { ...task, completed: !task.completed } : task) };
    default:
      return state;
  }
};

// Create Redux store
const store = Redux.createStore(reducer);

// React components
const TaskInput = ({ addTask }) => {
  const [task, setTask] = React.useState('');

  const handleAddTask = () => {
    if (task.trim() !== '') {
      addTask(task);
      setTask('');
    }
  };

  return React.createElement(
    'div',
    null,
    React.createElement('input', { type: 'text', value: task, onChange: (e) => setTask(e.target.value) }),
    React.createElement('button', { onClick: handleAddTask }, 'Add Task')
  );
};

const TaskList = ({ tasks, deleteTask, toggleTask }) => (
  React.createElement(
    'ul',
    null,
    tasks.map(task => React.createElement(
      'li',
      { key: task.id, className: task.completed ? 'completed' : '' },
      task.text,
      React.createElement('button', { onClick: () => toggleTask(task.id) }, 'Toggle'),
      React.createElement('button', { onClick: () => deleteTask(task.id) }, 'Delete')
    ))
  )
);

// Connect React components to Redux store
const mapStateToProps = (state) => ({ tasks: state.tasks });
const mapDispatchToProps = { addTask, deleteTask, toggleTask };

const ConnectedTaskInput = ReactRedux.connect(null, mapDispatchToProps)(TaskInput);
const ConnectedTaskList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TaskList);

// Render the app
ReactDOM.render(React.createElement(
  ReactRedux.Provider,
  { store: store },
  React.createElement(
    'div',
    { className: 'App' },
    React.createElement('h1', null, 'React To-Do App'),
    React.createElement(ConnectedTaskInput, null),
    React.createElement(ConnectedTaskList, null)
  )
), document.getElementById('root'));