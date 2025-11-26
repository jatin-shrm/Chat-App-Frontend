import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/AppRoutes";
import { WebSocketProvider } from "./contexts/WebSocketContext";

function App() {
  return (
    <div>
      <WebSocketProvider>
        <Router>
          <AppRoutes />
        </Router>
      </WebSocketProvider>
    </div>
  );
}

export default App;
