const initialState = {
  loading: false,
  currentTokenID: 0,
  cost: 0,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        currentTokenID: action.payload.currentTokenID,
        // cost: action.payload.cost,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    case "UPDATE_TOTAL_SUPPLY":
      return {
        ...state,
        currentTokenID: action.payload.currentTokenID
      };
    default:
      return state;
  }
};

export default dataReducer;
