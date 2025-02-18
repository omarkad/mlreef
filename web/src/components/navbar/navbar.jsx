import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import MDropdown from 'components/ui/MDropdown';
import { logout, resetInstructions } from 'store/actions/userActions';
import { toggleTutorial } from 'store/actions/tutorialActions';
import MGlobalMarker from 'components/ui/MGlobalMarker/MGlobalMarker';
import mlReefIcon01 from '../../images/MLReef_Logo_navbar.png';
import helpWhite from '../../images/help_white.png';
import AILibraryW from '../../images/navbar-options/AI_Lib_w.png';
import AILibraryB from '../../images/navbar-options/AI_Lib_b.png';
import MLProjectsW from '../../images/navbar-options/ML-Projects_w.png';
import MLProjectsB from '../../images/navbar-options/ML-Projects_b.png';
import HomeB from '../../images/navbar-options/Home_b.png';
import HomeW from '../../images/navbar-options/Home_w.png';
import { AIPaths, MLPaths } from 'dataTypes';

import './navbar.scss';
import AuthWrapper from 'components/AuthWrapper';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.toggleTutorial = this.toggleTutorial.bind(this);
    this.resetInstructions = this.resetInstructions.bind(this);
    this.state = {
      isMLProjects: false,
      isAILibrary: false,
      isHome: false
    };
  }

  activeMLProjects = () => {
    this.setState({
      isMLProjects: true,
      isAILibrary: false,
      isHome: false
    });
  };

  activeAILibrary = () => {
    this.setState({
      isMLProjects: false,
      isAILibrary: true,
      isHome: false
    });
  };

  activeHome = () => {
    this.setState({
      isMLProjects: false,
      isAILibrary: false,
      isHome: true
    });
  };

  getMLProjectsImage = () => this.state.isMLProjects ? MLProjectsB : MLProjectsW
  getAILibraryImage = () => this.state.isAILibrary ? AILibraryB : AILibraryW
  getHomeImage = () => this.state.isHome ? HomeB : HomeW

  handleSignOut() {
    const { actions } = this.props;
    actions.logout();
  }

  toggleTutorial() {
    const { actions } = this.props;
    actions.toggleTutorial();
  }

  resetInstructions() {
    const { actions } = this.props;
    actions.resetInstructions();
  }

  componentDidMount(){
    const currentPath = window.location.pathname;
    if(MLPaths.includes(currentPath)){
      return this.activeMLProjects();
    } else if (AIPaths.includes(currentPath)){
      return this.activeAILibrary();
    } else if (currentPath.includes('welcome')){
      return this.activeHome();
    }
  }

  render() {
    const { user, globalMarker, tutorialActive } = this.props;

    const MLProjectSrc = this.getMLProjectsImage();
    const AILibrarySrc = this.getAILibraryImage();
    const HomeSrc = this.getHomeImage();

    const avatarUrl = user.userInfo && user.userInfo.avatar_url;

    const docuLink = (
      <a target="_blank" rel="noopener noreferrer" href="https://doc.mlreef.com">
        Documentation
      </a>
    );

    const discordLink = (
      <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/draNC396CM">
        Discord Community
      </a>
    );

    return (
      <>
        <div className="navbar">
          <div className="w-100 px-3 d-flex">
            <div className="my-auto">
              <Link to={user.auth ? '/welcome' : '/welcome'} aria-label="Go to home" label="Go to home">
                <img className="logo" src={mlReefIcon01} alt="MLReef brand" />
              </Link>
            </div>
            {!user.auth &&
            <div className="my-auto">
              <Link to="/explore" className="btn btn-sm btn-dark mr-2 px-3">
                <span className="d-none d-lg-flex">Explore</span>
              </Link>
            </div>}
            <AuthWrapper norender>
              <div className="ml-3 my-auto d-lg-block" onClick={this.activeHome}>
                <NavLink
                  className="navbar-label"
                  activeClassName="active"
                  to={user.auth ? '/welcome' : '/welcome'}

                >
                  <img src={HomeSrc} alt="MLReef Home" />
                  <span>Home</span>
                </NavLink>
              </div>
            </AuthWrapper>

            <AuthWrapper norender>
              <div className="ml-3 my-auto d-lg-block" onClick={this.activeMLProjects}>
                <NavLink
                  className="navbar-label"
                  to={{ pathname: user.auth ? ('/dashboard/public/data_project') : '/welcome' }}
                  activeClassName="active"
                  isActive={(_, location) => MLPaths.includes(location.pathname)}
                >
                  <img src={MLProjectSrc} alt="MLReef ML Projects" />
                  <span>ML Projects</span>
                </NavLink>
              </div>
            </AuthWrapper>

            <AuthWrapper norender>
              <div className="ml-3 my-auto d-lg-block" onClick={this.activeAILibrary}>
                <NavLink
                  className="navbar-label"
                  to={{ pathname: user.auth ? '/dashboard/public/algorithm' : '/welcome' }}
                  activeClassName="active"
                  isActive={(_, location) => AIPaths.includes(location.pathname)}
                >
                  <img src={AILibrarySrc} alt="MLReef AI Library" />
                  <span>AI Library</span>
                </NavLink>
              </div>
            </AuthWrapper>

            {user.auth && (
              <>
                <MDropdown
                  align="right"
                  className="m-dropdown ml-auto my-auto"
                  buttonClasses="btn btn-dark d-flex p-2"
                  label={(
                    <img src={helpWhite} alt="" style={{ width: '1.8rem' }} />
                  )}
                  component={(
                    <div className="help-box">
                      {docuLink}
                      {discordLink}
                      <a target="_blank" rel="noopener noreferrer" href="https://about.mlreef.com">
                        About MLReef
                      </a>
                      <button onClick={this.toggleTutorial} type="button" className="btn t-dark" style={{ borderRadius: 0 }}>
                        {`${tutorialActive ? 'Hide' : 'Show'} Tutorial`}
                      </button>
                      <button onClick={this.resetInstructions} type="button" className="btn t-dark" style={{ borderRadius: 0 }}>
                        Show helpers
                      </button>
                    </div>
                  )}
                />
                <MDropdown
                  align="right"
                  className="ml-0 my-auto"
                  buttonClasses="btn btn-dark d-flex p-2"
                  label={(
                    <div
                      style={{ backgroundImage: `url(${avatarUrl})` }}
                      className="avatar-circle bg-image bg-cover"
                    />
                  )}
                  component={(
                    <div className="sign-box">
                      <div>
                        {'Signed in as '}
                        <b id="cy-username">{user.username}</b>
                      </div>
                      <p>
                        <Link to="/profile">Profile</Link>
                      </p>
                      <hr />
                      <p
                        onClick={this.handleSignOut}
                        onKeyDown={this.handleSignOut}
                      >
                        Sign Out
                      </p>
                    </div>
                  )}
                />
              </>
            )}

            {!user.auth && (
              <>
                <MDropdown
                  align="right"
                  className="m-dropdown ml-auto my-auto"
                  buttonClasses="btn btn-dark d-flex p-2"
                  label={(
                    <img src={helpWhite} alt="" style={{ width: '1.8rem' }} />
                  )}
                  component={(
                    <div className="help-box">
                      {docuLink}
                      {discordLink}
                      <a target="_blank" rel="noopener noreferrer" href="https://about.mlreef.com">
                        About MLReef
                      </a>
                    </div>
                  )}
                />
                <div className="ml-1 my-auto">
                  <Link to="/login?redirect=goback" className="btn btn-sm btn-dark mr-2 px-3">
                    <i className="fas fa-sign-in-alt d-lg-none" />
                    <span className="d-none d-lg-flex">Sign in</span>
                  </Link>
                  <Link to="/register" className="btn btn-sm btn-outline-secondary px-0 keep-border">
                    <i className="fas fa-user-plus d-lg-none px-2" />
                    <span className="d-none d-lg-flex px-3">Register</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        {globalMarker.color && (
          <MGlobalMarker
            isLoading={globalMarker.isLoading}
            globalColorMarker={globalMarker.color}
          />
        )}
      </>
    );
  }
}

Navbar.propTypes = {
  actions: PropTypes
    .shape({
      logout: PropTypes.func.isRequired,
      toggleTutorial: PropTypes.func.isRequired,
      resetInstructions: PropTypes.func.isRequired,
    })
    .isRequired,
  user: PropTypes
    .shape({
      auth: PropTypes.bool.isRequired,
      username: PropTypes.string,
      email: PropTypes.string,
      userInfo: PropTypes.shape({
        avatar_url: PropTypes.string,
      }),
    })
    .isRequired,
  globalMarker: PropTypes.shape({
    color: PropTypes.string,
    isLoading: PropTypes.bool,
  }).isRequired,
  tutorialActive: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    projectsList: state.projects,
    user: state.user,
    globalMarker: state.globalMarker,
    tutorialActive: state.tutorial.active,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      logout: bindActionCreators(logout, dispatch),
      toggleTutorial: bindActionCreators(toggleTutorial, dispatch),
      resetInstructions: bindActionCreators(resetInstructions, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
