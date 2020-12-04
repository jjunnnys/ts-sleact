import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import LogIn from '@pages/LogIn';
import SignUp from '@pages/SignUp';

function App() {
    return (
        <Switch>
            <Route path="/login" component={LogIn} />
            <Route path="/signup" component={SignUp} />
            <Redirect exact path="/" to="/login" /> {/* '/' 주소 일 경우 로그인 페이지로 */}
        </Switch>
    );
}

export default App;
