import './App.css'
import {Routes,Route} from 'react-router-dom'
import LobbyScreen from './../screens/Lobby';
import RoomScreen from './../screens/Room';
function App() {

  return (
    <>
      <div className="App">
        <Routes>
          <Route>
            <Route path='/' element = {<LobbyScreen/>} />
            <Route path='/room/:roomId' element = {<RoomScreen/>} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
