const initialState = {
  show: false,
  renderer: null,
  userMayExit: true,
}

export default function modal(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case 'MODAL_SET':
      return Object.assign({}, state, payload)
      break
    default:
      return state
  }
}
