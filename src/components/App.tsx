import React, { lazy, Suspense } from "react";
import { Link, Route, Switch } from "wouter";
import Footer from "./molecules/Footer";
import Header from "./molecules/Header";
import { Theme } from "./organisms/Theme";
import { LoadingPlaceholder } from "./atoms/LoadingPlaceholder/LoadingPlaceholder";
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

// Lazy load route components for better performance
const Home = lazy(() => import("./features/Home"));
const About = lazy(() => import("./features/About"));
const Releases = lazy(() => import("./features/Releases"));
const Videos = lazy(() => import("./features/Videos"));
const UpcomingEvents = lazy(() => import("./molecules/UpcomingEvents"));
const Discography = lazy(() => import("./features/FullDiscography"));

const App = () => (
  <Theme>
    <Header />
    <main>
      <Suspense fallback={<LoadingPlaceholder />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/releases" component={Releases} />
          <Route path="/videos" component={Videos} />
          <Route path="/shows" component={UpcomingEvents} />
          <Route path="/discography" component={Discography} />
          <Route>This is rendered when nothing above has matched</Route>
        </Switch>
      </Suspense>
    </main>
    <Footer />
  </Theme>
);

export default App;
