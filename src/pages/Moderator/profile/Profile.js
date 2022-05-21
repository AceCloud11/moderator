import axios from "axios";
import React from "react";
import { FaEdit } from 'react-icons/fa';
import UserContext from '../../../Context/UserContext';

export default function Profile() {
    const { token } = React.useContext(UserContext);
    const [editMode, setEditMode] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const fetchInfo = async () =>  {
        await axios
      .get("moderator/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
          Accept: "application/json",
        },
      })
      .then(async (res) => {
        setUsername(res.data.username);
        setEmail(res.data.email);
      })
      .catch(console.error);
    }

    const updateInfo = () => {
        axios
          .put("moderator/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
              Accept: "application/json",
            },
           
          })
          .then(async (res) => {
            console.log(res.data);
          })
          .catch(console.error);
    }

    React.useEffect(() => {
        fetchInfo();
    })
    return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <label htmlFor="" className="text-lg font-bold">
            Info
          </label>
          <FaEdit
            size={28}
            color="blue"
            onClick={() => setEditMode(!editMode)}
          />
        </div>
        <input
          type="text"
          placeholder="username"
          readOnly={!editMode}
          className={`w-full p-2 rounded-md border-2 focus:outline-none border-gray-300 ${
            editMode ? "" : "bg-gray-200"
          }`}
            value={username}
          //   onChange={(e) => this.setState({ tags: e.target.value })}
        />
        <input
          type="email"
          placeholder="email"
          readOnly={!editMode}
          className={`w-full p-2 rounded-md border-2 focus:outline-none border-gray-300 ${
            editMode ? "" : "bg-gray-200"
          }`}
            value={email}
          //   onChange={(e) => this.setState({ tags: e.target.value })}
        />

        <input
          type="password"
          placeholder={`${ editMode ? "old" : ''} password`}
          readOnly={!editMode}
          className={`w-full p-2 rounded-md border-2 focus:outline-none border-gray-300 ${
            editMode ? "" : "bg-gray-200"
          }`}
          //   value={this.state.tags}
          //   onChange={(e) => this.setState({ tags: e.target.value })}
        />
        <input
          type="password"
          placeholder="confirm password"
          readOnly={!editMode}
          className={`w-full p-2 rounded-md border-2 focus:outline-none border-gray-300 ${
            editMode ? "block" : "hidden"
          }`}
          //   value={this.state.tags}
          //   onChange={(e) => this.setState({ tags: e.target.value })}
        />

        <button className="p-2 rounded-md bg-blue-700 text-white"
            onClick={() => editMode ? updateInfo() : ''}
        >
          change password
        </button>
      </div>
    </div>
  );
}
