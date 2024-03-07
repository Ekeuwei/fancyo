import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './components/Home';
import { StyleWrapper } from "./theme/ThemeStyle";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Dashboard from "./components/dashboard";
import Deal from "./components/dashboard/deal";
import Cashout from "./components/dashboard/cashout";
import FundWallet from "./components/dashboard/fundwallet";
import Settings from "./components/dashboard/settings";
import ProfileSettings from "./components/dashboard/settings/ProfileSettings";
import Manager from "./components/dashboard/manager/ProjectManager";
import PunterDashboard from "./components/dashboard/punter/PunterDashboard";
import ProjectDetails from "./components/dashboard/punter/ProjectDetails";
import { ThemeProvider } from "./theme/ThemeProvider";
import { store } from "./store";
import { useEffect } from "react";
import { api } from "./common/api";
import ForgotPassword from "./components/user/ForgotPassword";
import TransacrionReceipt from "./components/dashboard/fundwallet/TransacrionReceipt";
import ProtectedRoute from "./app/route/ProtectedRoute";
import Toast from "./components/user/layout/Toast";
import Disclaimer from "./components/dashboard/modals/Disclaimer";
import Transactions from "./components/dashboard/transactions";
    
export const appName = import.meta.env.VITE_APP_NAME

function App() {

  useEffect(() => {
    store.dispatch(api.loadUser());
  }, []);

  return (
    <ThemeProvider>
      <StyleWrapper>
          <Toast />
          <Router>
              <Route path="/" component={Home} exact />
              <Route path="/login" component={Login} exact />
              <Route path="/register" component={Register} exact />
              <Route path="/password/forgot" component={ForgotPassword} exact />
              <Route path="/disclaimer" component={Disclaimer} exact />
              <Route path="/transactions" component={Transactions} exact />
              <ProtectedRoute path="/dashboard" component={Dashboard} exact />
              <ProtectedRoute path="/deal" component={Deal} exact />
              <ProtectedRoute path="/cashout" component={Cashout} exact />
              <ProtectedRoute path="/deposit" component={FundWallet} exact />
              <ProtectedRoute path="/receipt" component={TransacrionReceipt} exact />
              <ProtectedRoute path="/settings" component={Settings} exact />
              <ProtectedRoute path="/settings/profile" component={ProfileSettings} exact />
              
              <ProtectedRoute path="/project/details/:id" component={ProjectDetails} exact />
              <ProtectedRoute path="/project/punter/:id" component={Manager} exact />
              <ProtectedRoute path="/dashboard/punter" component={PunterDashboard} exact />
              <ProtectedRoute path="/dashboard/punter/project/details" component={ProjectDetails} exact />
          </Router>
      </StyleWrapper>
    </ThemeProvider>
  )
}

export default App
