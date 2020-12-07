import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';

// 코드 스플릿팅
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
// const Workspace = loadable(() => import('@pages/Workspace'));

function App() {
    return (
        <Switch>
            <Route path="/login" component={LogIn} />
            <Route path="/signup" component={SignUp} />
            {/* <Route path="/workspace/:workspace" component={Workspace} /> */}
            <Redirect exact path="/" to="/login" /> {/* '/' 주소 일 경우 로그인 페이지로 */}
        </Switch>
    );
}

export default App;
