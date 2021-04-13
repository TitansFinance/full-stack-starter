const initialState = {
  mobile: false,
  tablet: false,
  desktop: false,
  type: null,
  showSidebar: false,
}

export default function layout(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case 'LAYOUT_UPDATE_TYPE':
      return Object.assign({}, state, {
        mobile: payload.type === 'mobile',
        tablet: payload.type === 'tablet',
        desktop: payload.type === 'desktop',
        type: payload.type,
      })
      break
    case 'LAYOUT_SHOW_SIDEBAR':
      return Object.assign({}, state, {
        showSidebar: payload,
      })
      break
    default:
      return state
  }
}
