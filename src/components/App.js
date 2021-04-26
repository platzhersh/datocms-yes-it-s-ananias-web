import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './Header'
import About from './About'
import Home from './Home'
import Footer from './Footer'

const App = () => (
  <Router>
    <Header />
    <main>
      <Route exact path='/' component={Home} />
      <Route path='/about' component={About} />
    </main>
    <Footer />
  </Router>
)

export default App
