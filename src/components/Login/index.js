import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    se: false,
    em: '',
  }

  one = event => {
    this.setState({
      userId: event.target.value,
    })
  }
  two = event => {
    this.setState({
      pin: event.target.value,
    })
  }

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }
  fail = em => {
    this.setState({
      se: true,
      em,
    })
  }
  BankLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.success(data.jwt_token)
    } else {
      this.fail(data.error_msg)
    }
  }

  render() {
    const {userId, pin, se, em} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="main-container">
        <div className="content-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="image"
            />
          </div>
          <form className="form-element" onSubmit={this.BankLogin}>
            <h1 className="header">Welcome Back!</h1>
            <div className="input-container">
              <label htmlFor="user" className="label">
                User ID
              </label>
              <input
                id="user"
                placeholder="Enter User ID"
                className="input"
                type="text"
                value={userId}
                onChange={this.one}
              />
            </div>
            <div className="input-container">
              <label htmlFor="pin" className="label">
                PIN
              </label>
              <input
                id="pin"
                placeholder="Enter Pin"
                className="input"
                type="password"
                value={pin}
                onChange={this.two}
              />
            </div>
            <button className="button" type="submit">
              Login
            </button>
            <div className="content">
              {se === true && <p className="para">{em}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
