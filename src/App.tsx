import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/AppRoutes";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <div>
      <WebSocketProvider>
        <UserProvider>
          <Router>
            <AppRoutes />
          </Router>
        </UserProvider>
      </WebSocketProvider>
    </div>
  );
}

export default App;
