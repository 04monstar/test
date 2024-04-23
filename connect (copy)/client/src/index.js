import ReactDOM from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import {SocketProvider} from './context/socketProvider'; 

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
    <BrowserRouter>
        <SocketProvider> 
            <App />
        </SocketProvider>
    </BrowserRouter>
);
