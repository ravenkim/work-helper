import { createRoot } from 'react-dom/client'
import App from 'src/App'
import { Provider } from 'react-redux'
import store from 'src/app/store/redux/reduxStore.jsx'

import 'src/styles/index.css'
import 'src/assets/locales/i18n.tsx'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>,
)
