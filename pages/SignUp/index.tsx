import React, { ReactElement, useCallback, useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';

import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import { Redirect } from 'react-router';

interface Props {}

function SignUP({}: Props): ReactElement {
    const { data: userData, error, revalidate, mutate } = useSWR('/api/user', fetcher);

    const [signUpError, setSignUpError] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [mismatchError, setMismatchError] = useState(false);

    const [email, onChangeEmail] = useInput('');
    const [nickname, onChangeNickname] = useInput('');
    const [password, _1, setPassword] = useInput('');
    const [passwordCheck, _2, setPasswordCheck] = useInput('');

    // useCallback : 함수 자체를 캐싱 -> 함수 자리에 그대로 넣으면 됩 (이벤트 리스너 같은)
    // useMemo : 함수의 리턴 값을 캐싱 -> useMemo(()=> 값,[])

    const onChangePassword = useCallback(
        (e) => {
            const { value } = e.target;
            setPassword(() => value);
            setMismatchError(() => passwordCheck !== e.target.value);
        },
        [passwordCheck],
    );

    const onChangePasswordCheck = useCallback(
        (e) => {
            const { value } = e.target;
            setPasswordCheck(() => value);
            setMismatchError(() => password !== e.target.value);
        },
        [password],
    );

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (!nickname || !nickname.trim()) {
                // 닉네임 빈칸 입력 시
                setSignUpError(() => '닉네임을 입력해주세요');
                return;
            }
            if (!mismatchError) {
                setSignUpError('');
                setSignUpSuccess(false);
                axios
                    .post('/api/user', { email, nickname, password })
                    .then(() => {
                        setSignUpSuccess(true);
                    })
                    .catch((error) => {
                        console.error(error.response);
                        setSignUpError(error.response?.data);
                    });
            }
        },
        [nickname, email, password, mismatchError],
    );

    if (userData) {
        return <Redirect to="/workspace/sleact/channel/일반" />;
    }

    return (
        <div id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
                    </div>
                </Label>
                <Label id="nickname-label">
                    <span>닉네임</span>
                    <div>
                        <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChangePassword}
                        />
                    </div>
                </Label>
                <Label id="password-check-label">
                    <span>비밀번호 확인</span>
                    <div>
                        <Input
                            type="password"
                            id="password-check"
                            name="password-check"
                            value={passwordCheck}
                            onChange={onChangePasswordCheck}
                        />
                    </div>
                    {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
                    {signUpError && <Error>{signUpError}</Error>}
                    {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
                </Label>
                <Button type="submit">회원가입</Button>
            </Form>
            <LinkContainer>
                이미 회원이신가요?&nbsp;
                <a href="/login">로그인 하러가기</a>
            </LinkContainer>
        </div>
    );
}

export default SignUP;
