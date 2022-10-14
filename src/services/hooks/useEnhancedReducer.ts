import { useCallback, useReducer, useRef } from "react"

export const useEnhancedReducer = (
	reducer: Parameters<typeof useReducer>[0],
	initState: Parameters<typeof useReducer>[1],
	initializer: Parameters<typeof useReducer>[2]
) => {
	const lastState = useRef<ReturnType<typeof reducer>>(initState)
	const getState = useCallback(() => lastState.current, [])
	return [
		...useReducer(
			(state: Parameters<typeof reducer>[0], action: Parameters<typeof reducer>[1]) => lastState.current = reducer(state, action),
			initState,
			initializer
		),
		getState
	]
}