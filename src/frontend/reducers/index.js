const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FAVORITE':
      return {
        ...state,
        myList: [...state.myList, action.payload],
      };
    case 'DELETE_FAVORITE':
      return {
        ...state,
        myList: state.myList.filter((items) => items.id !== action.payload),
      };
    case 'LOGIN_REQUEST':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT_REQUEST':
      return {
        ...state,
        user: action.payload,
      };
    case 'REGISTER_REQUEST':
      return {
        ...state,
        user: action.payload,
      };
    case 'GET_VIDEOS_SOURCE':
      return {
        ...state,
        playing: state.trends.find((item) => item.id === action.payload) ||
          state.originals.find((item) => item.id === action.payload) ||
          [],
      };
    case 'GET_VIDEO_SEARCH':
      return {
        ...state,
        search: action.payload !== '' ?
          state.trends.filter((item) => item.title.includes(action.payload)).concat(
            state.originals.filter((item) => item.title.includes(action.payload)),
          ) :
          [],
      };

    default:
      return state;
  }

};

export default reducer;
