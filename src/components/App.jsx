import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './molecules/Header'
import Footer from './molecules/Footer'

import About from './features/About'
import Home from './features/Home'
import Releases from './features/Releases'
import Events from './features/Events'
import Videos from './features/Videos'
import Discography from './features/FullDiscography'
import { Theme } from './organisms/Theme'

const App = () => (
  <Theme>
    <Router>
      <Header />
      <main>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/releases" component={Releases} />
        <Route path="/videos" component={Videos} />
        <Route path="/events" component={Events} />
        <Route path="/discography" component={Discography} />
      </main>
      <Footer />
    </Router>
  </Theme>
)

export default App
