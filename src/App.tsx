import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/AppRoutes";
import { AuthInitializer } from "./components/AuthInitializer";
import { WebSocketInitializer } from "./components/WebSocketInitializer";

function App() {
  return (
    <div>
      <WebSocketInitializer />
      <AuthInitializer />
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
