import React from "react";
import { Link, Route, Switch } from "wouter";
import About from "./features/About";
import Discography from "./features/FullDiscography";
import Home from "./features/Home";
import Releases from "./features/Releases";
import Videos from "./features/Videos";
import Footer from "./molecules/Footer";
import Header from "./molecules/Header";
import UpcomingEvents from "./molecules/UpcomingEvents";
import { Theme } from "./organisms/Theme";
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

const App = () => (
  <Theme>
    <Header />
    <main>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/releases" component={Releases} />
        <Route path="/videos" component={Videos} />
        <Route path="/shows" component={UpcomingEvents} />
        <Route path="/discography" component={Discography} />
        <Route>This is rendered when nothing above has matched</Route>
      </Switch>
    </main>
    <Footer />
  </Theme>
);

export default App;
