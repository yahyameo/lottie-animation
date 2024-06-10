import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import client from './apollo/client';
import  store  from './redux/store';
import AnimationList from './components/AnimationList';

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <div className="App card card-body">
        <h1>Lottie Animation Management</h1>
        <AnimationList />
      </div>
    </Provider>
  </ApolloProvider>
);

export default App;
