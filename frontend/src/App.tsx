import Home from "./pages/home"
import Styles from "./components/effects/Grig_bg"

export default function App() {


  return (
    <>
    
	<Styles/>
      {/* Page content */}
      <div className="relative min-h-screen">
        <Home />
      </div>
    </>
  )
}