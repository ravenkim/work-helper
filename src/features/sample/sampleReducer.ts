import { AsyncRequest, reduxMaker } from '../../core/store/reduxMaker'
import { PayloadAction } from '@reduxjs/toolkit'

const prefix = 'sample'

const asyncRequests = [
    {
        action: 'getPokemon',
        state: 'pokemon',
        initialState: {
            name: 'pokemon',
            id: 1,
        },
        api: () => fetch('https://pokeapi.co/api/v2/pokemon/ditto'),
    } as const satisfies AsyncRequest<{ name: string; id: number }, void>,

    {
        action: 'getTest',
        state: 'test',
        initialState: [{ success: true, message: 'asd' }],
        api: (
            param = {
                param1: 'string',
                param2: 111,
            },
        ) => fetch('https://test.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(param),
        }),
    } as const satisfies AsyncRequest<
        { success: boolean; message: string }[],
        { param1: string; param2: number }
    >,
] as const

const localState = {
    value: 0,
}

const localReducers = {
    decrement: (state: typeof localState) => {
        state.value -= 1
    },
    setValue: (state: typeof localState, action: PayloadAction<number>) => {
        state.value = action.payload
    },
}

const sampleModule = reduxMaker(prefix, asyncRequests, localState, localReducers)
export const {
    slice: sampleSlice,
    actions: sampleActions,
    saga: sampleSaga,
} = sampleModule 