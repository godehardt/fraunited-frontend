import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink as Link,
  Redirect
} from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import logo from './fra-united.png' // Tell webpack this JS file uses this image

import MatchView from './components/views/match-view'

import { Navbar, Row, Col, Nav, Collapse } from 'react-bootstrap'

import ProtocolCreator from './components/form/protocol-creator'
import ProtocolResults from './components/request/protocol-results'
import LogfileInspector from './components/form/logfile-inspector'
import AllCommitsView from './components/views/all-commits-view'
import TeamsView from './components/views/teams-view'
import AboutPage from './components/views/about-page'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  }
})

const App = () => {
  const [change] = useState()

  useEffect(() => {
  }, [change])

  const [showNavigation, setShowNavigation] = useState(false)
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar bg='dark' variant='dark' expand='lg'>
          <Navbar.Brand className='px-3'><Link to='/' className='link-light text-decoration-none'>RoboCup <img style={{ verticalAlign: 'bottom' }} src={logo} height='50' alt='Fra-UNIted team logo' /> 1001 Games a Night</Link></Navbar.Brand>
          <Navbar.Text id='navbar-portal' className='d-flex flex-grow-1' />
          <Navbar.Toggle className='mx-3' aria-controls='basic-navbar-nav' onClick={() => setShowNavigation(!showNavigation)} />
        </Navbar>
        <Row className='min-vh-100 '>
          <Collapse in={showNavigation}>
            <Col lg={2} className='sidebar bg-light d-lg-block'>
              <div className='position-sticky top-0 px-3 py-2 bg-light'>
                <Nav variant='pills' className='flex-column mb-auto'>
                  <Nav.Item>
                    <Nav.Link
                      className='link-dark'
                      as={Link}
                      to={`${process.env.PUBLIC_URL}/allCommitsOverview`}
                    >
                      ALL COMMITS OVERVIEW
                    </Nav.Link>
                    <Nav.Link
                      className='link-dark'
                      as={Link}
                      to={`${process.env.PUBLIC_URL}/protocolResults`}
                    >
                      PROTOCOL RESULTS
                    </Nav.Link>
                    <Nav.Link
                      className='link-dark'
                      as={Link}
                      to={`${process.env.PUBLIC_URL}/match/`}
                    >
                      SPECIFIC MATCH
                    </Nav.Link>
                    <Nav.Link
                      className='link-dark'
                      as={Link}
                      to={`${process.env.PUBLIC_URL}/interestingMatches`}
                    >
                      INTERESTING MATCHES
                    </Nav.Link>
                    <Nav.Link
                      className='link-dark'
                      as={Link}
                      to={`${process.env.PUBLIC_URL}/protocolCreator`}
                    >
                      PROTOCOL CREATOR
                    </Nav.Link>
                    <Nav.Link
                      className='link-dark'
                      as={Link}
                      to={`${process.env.PUBLIC_URL}/teams`}
                    >
                      TEAMS
                    </Nav.Link>
                    <Nav.Link
                      className='link-dark'
                      as={Link}
                      to={`${process.env.PUBLIC_URL}/about`}
                    >
                      About
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </Col>
          </Collapse>
          <Col lg={10} className='px-md-4 ms-sm-auto'>
            <Switch>
              <Route exact path={`${process.env.PUBLIC_URL}/`}>
                <Redirect to={`${process.env.PUBLIC_URL}/allCommitsOverview`} />
              </Route>
              <Route path={`${process.env.PUBLIC_URL}/allCommitsOverview`}>
                <AllCommitsView />
              </Route>
              <Route path={`${process.env.PUBLIC_URL}/protocolResults`}>
                <ProtocolResults />
              </Route>
              <Route path={`${process.env.PUBLIC_URL}/test`}>
                <ProtocolResults />
              </Route>
              <Route exact path={`${process.env.PUBLIC_URL}/match`}>
                <MatchView />
              </Route>
              <Route path={`${process.env.PUBLIC_URL}/match/:matchId?`}>
                <MatchView />
              </Route>
              <Route path={`${process.env.PUBLIC_URL}/protocolCreator`}>
                <ProtocolCreator update={change} />
              </Route>

              <Route path={`${process.env.PUBLIC_URL}/teams`}>
                <TeamsView />
              </Route>
              <Route path={`${process.env.PUBLIC_URL}/interestingMatches`}>
                <LogfileInspector />
              </Route>
              <Route path={`${process.env.PUBLIC_URL}/about`}>
                <AboutPage />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
