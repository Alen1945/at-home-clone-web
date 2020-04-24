import React from 'react'
import socketClient from 'socket.io-client'
import axios from 'axios'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
let socket = null

function App (props) {
  return (
    <Router basename={process.env.PUBLIC_URL || '/'}>
      <Switch>
        <Route exact path='/' component={All} />

        <Route exact path='/detail/:id' component={Detail} />
      </Switch>
    </Router>
  )
}

function All (props) {
  const [dataMessage, setDataMessage] = React.useState([])
  const getDataMessage = async () => {
    const dataMsg = await axios.get(process.env.REACT_APP_API_URL + '/api/messages')
    if (dataMsg.data.success) {
      setDataMessage(dataMsg.data.data)
    }
  }
  React.useEffect(() => {
    getDataMessage()
    socket = socketClient(process.env.REACT_APP_API_URL)
    socket.on('newMessage', (data) => {
      setDataMessage((prev) => [...prev, JSON.parse(data)])
    })
  }, [])
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>All Message</h1>
      <div style={{ width: 500, margin: '0 auto' }}>
        {dataMessage.length > 0 &&
          dataMessage
            .map((msg, i) => (
              <div style={{}} key={i}>
                <h3>
                  <Link to={`/detail/${msg.id}`}>
                    {dataMessage.length - i}. Message
                  </Link>
                </h3>
                <p>
                  on: {new Date(msg.createdAt).toDateString()} &nbsp;&nbsp;{' '}
                  {new Date(msg.createdAt).getHours()}:
                  {new Date(msg.createdAt).getMinutes()}
                </p>
              </div>
            ))
            .reverse()}
      </div>
    </div>
  )
}
function Detail (props) {
  const [detailMessage, setDetailMessage] = React.useState(false)
  const getDetailMessage = async () => {
    const detailMessage = await axios.get(
      process.env.REACT_APP_API_URL + '/api/messages/' + props.match.params.id
    )
    if (detailMessage.data.success) {
      setDetailMessage(detailMessage.data.data)
    }
  }
  React.useEffect(() => {
    getDetailMessage()
  }, [])
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Detail Message</h1>
      {detailMessage && (
        <>
          <h3 style={{ textAlign: 'center' }}>
            on: {new Date(detailMessage.createdAt).toDateString()} &nbsp;&nbsp;{' '}
            {new Date(detailMessage.createdAt).getHours()}:
            {new Date(detailMessage.createdAt).getMinutes()}
          </h3>
          <div style={{ width: '80%', margin: '0 auto', display: 'flex' }}>
            {detailMessage.content.map((image, i) => (
              <div
                style={{
                  width: 200,
                  height: 200,
                  overflow: 'hidden',
                  margin: 20,
                  borderWidth: 1,
                  borderColor: '#333',
                  borderStyle: 'solid'
                }}
                key={i}
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}${image.pathContent}`}
                  width='100%'
                  height='auto'
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
export default App
