import React, { Component } from 'react';
import GoogleAnalytics from 'react-ga';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';
import ListPage from './pages/ListPage';
import RunPage from './pages/RunPage';
import config from './utils/config';
import { handleError } from './utils/utils';
import './App.scss';

interface AppProps {}

interface AppState {
    error: Error | null;
}

class App extends Component<AppProps, AppState, any> {
    constructor(props: AppProps | Readonly<AppProps>) {
        super(props);
        this.state = { error: null };
        if (config.GOOGLE_ANALYTICS_CODE) {
            GoogleAnalytics.initialize(config.GOOGLE_ANALYTICS_CODE);
        }
    }

    componentDidCatch(error: any, errorInfo: any) {
        this.setState({ error });
        handleError(error, errorInfo);
    }

    recordPageview = ({ location }: RouteComponentProps) => {
        GoogleAnalytics.pageview(location.pathname);
        return null;
    };

    render() {
        if (this.state.error) {
            return (
                <div className="container my-4">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            Oops - there has been an error. It has been logged to the console.
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <BrowserRouter>
                <div className="App">
                    <Route exact path="/" component={ListPage} />
                    <Route exact path="/run" component={RunPage} />
                    <Route exact path="/run/:slug" component={RunPage} />
                    <Route path="/" render={this.recordPageview} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
