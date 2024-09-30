import { Component } from "react";
import "./index.css";

class UserForm extends Component {
  state = {
    name: "",
    address: "",
    message: "",
    users: [],
    showNameError: false,
    showAddressError: false,
    isFormSubmitted: false,
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    const apiUrl = "https://backend-id7d.onrender.com/users";
    const response = await fetch(apiUrl);
    const usersData = await response.json();

    this.setState({ users: usersData });
  };

  validateName = () => {
    const { name } = this.state;
    return name !== "";
  };

  validateAddress = () => {
    const { address } = this.state;
    return address !== "";
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const isValidName = this.validateName();
    const isValidAddress = this.validateAddress();

    if (isValidName && isValidAddress) {
      const { name, address } = this.state;
      const apiUrl = "https://backend-id7d.onrender.com/register";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, address }),
      });

      const result = await response.json();

      // Update the message and reset the form fields
      this.setState({
        message: result.message,
        name: "",
        address: "",
        showNameError: false,
        showAddressError: false,
        isFormSubmitted: true,
      });

      // Fetch the updated list of users after successful submission
      this.fetchUsers();
    } else {
      this.setState({
        showNameError: !isValidName,
        showAddressError: !isValidAddress,
      });
    }
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onBlurName = () => {
    const isValidName = this.validateName();

    this.setState({ showNameError: !isValidName });
  };

  renderNameField = () => {
    const { name, showNameError } = this.state;

    const className = showNameError ? "input-field error-field" : "input-field";

    return (
      <div className="form-group">
        <label htmlFor="name">Enter Your Name:</label>
        <input
          id="name"
          type="text"
          name="name"
          className={className}
          value={name}
          onChange={this.handleInputChange}
          onBlur={this.onBlurName}
          placeholder="Enter your name"
        />
        {showNameError && <p className="error-message">Required</p>}
      </div>
    );
  };

  onBlurAddress = () => {
    const isValidAddress = this.validateAddress();

    this.setState({ showAddressError: !isValidAddress });
  };

  renderAddressField = () => {
    const { address, showAddressError } = this.state;

    const className = showAddressError
      ? "input-field error-field"
      : "input-field";

    return (
      <div className="form-group">
        <label htmlFor="address">Enter Your Address:</label>
        <input
          id="address"
          type="text"
          name="address"
          className={className}
          value={address}
          onChange={this.handleInputChange}
          onBlur={this.onBlurAddress}
          placeholder="Enter your address"
        />
        {showAddressError && <p className="error-message">Required</p>}
      </div>
    );
  };

  render() {
    const { message, users } = this.state;

    return (
      <div className="app-container">
        <h1 className="app-title">User Registration</h1>

        <form onSubmit={this.handleFormSubmit} className="form-container">
          {this.renderNameField()}
          {this.renderAddressField()}
          <button type="submit" className="submit-btn">
            Submit
          </button>
          {message && <p className="message">{message}</p>}
        </form>

        <h2 className="section-title">Registered Users</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th className="table-header">UserId</th>
              <th className="table-header">Name</th>
              <th className="table-header">Address</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="table-row">
                <td className="table-data">{index + 1}</td>
                <td className="table-data">{user.name}</td>
                <td className="table-data">{user.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default UserForm;
