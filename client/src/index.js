import ReactDom from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App'
import './index.css'
import { SocketProvider } from './hooks/Socket'

const root = ReactDom.createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
    <SocketProvider>
    <App/>
    </SocketProvider>
    </BrowserRouter>
)