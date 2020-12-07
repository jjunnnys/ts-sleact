import { Dispatch, SetStateAction, useCallback, useState } from 'react';

const useInput = <T = any>(initialValue: T): [T, (e: any) => void, Dispatch<SetStateAction<T>>] => {
    const [value, setValue] = useState(initialValue);
    const handler = useCallback((e) => {
        const { value } = e.target;
        setValue(() => value);
    }, []);
    return [value, handler, setValue];
};

export default useInput;
