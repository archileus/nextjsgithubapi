type ActionMap<M> = {
    [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
    }
    : {
        type: Key;
        payload: M[Key];
    }
};

export enum Types {
    SET_STATE = 'SET_STATE',
}

type Payload = {
    [Types.SET_STATE]: Partial<StateType>
}

export type Action = ActionMap<Payload>[keyof ActionMap<Payload>];

export const stateReducer = (state: StateType, action: Action) => {
    switch (action.type) {
        case Types.SET_STATE:
            return {
                ...state,
                ...action.payload
            }

        default:
            return state;
    }
}
