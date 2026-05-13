import * as React from 'react'

type ToastVariant = 'default' | 'success' | 'error'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

type ToastState = { toasts: Toast[] }
type Action =
  | { type: 'ADD'; toast: Toast }
  | { type: 'REMOVE'; id: string }

let count = 0
const listeners: Array<(state: ToastState) => void> = []
let memoryState: ToastState = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(l => l(memoryState))
}

function reducer(state: ToastState, action: Action): ToastState {
  switch (action.type) {
    case 'ADD':
      return { toasts: [action.toast, ...state.toasts].slice(0, 3) }
    case 'REMOVE':
      return { toasts: state.toasts.filter(t => t.id !== action.id) }
  }
}

export function toast({ title, description, variant = 'default' }: Omit<Toast, 'id'>) {
  const id = String(++count)
  dispatch({ type: 'ADD', toast: { id, title, description, variant } })
  setTimeout(() => dispatch({ type: 'REMOVE', id }), 4000)
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)
  React.useEffect(() => {
    listeners.push(setState)
    return () => { listeners.splice(listeners.indexOf(setState), 1) }
  }, [])
  return state
}
