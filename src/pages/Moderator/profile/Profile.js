import axios from "axios";
import React from "react";
import { FaEdit } from 'react-icons/fa';
import Error from "../../../components/Error";
import UserContext from '../../../Context/UserContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
    const { token } = React.useContext(UserContext);
    const [editMode, setEditMode] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [usernameEdit, setUsernameEdit] = React.useState('');
    const [emailEdit, setEmailEdit] = React.useState('');
    const [oldPassword, setOldPassword] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [errors, setErrors] = React.useState('');

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
      setErrors([]);

      let data = {
        username: usernameEdit,
        email: emailEdit,
        old_password: oldPassword,
        password,
        confirm_password: passwordConfirm,
      };

      // console.log(data);
        axios({
            url: "/moderator/profile",
            method: "put",
            data,
            responseType: "json",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
            .then((res) => { 
              if (res.data.error) {
                setErrors(old => [...old, res.data.error]);
                return;
              }
              else{
                toast.success(res.data.success);
                setEditMode(false);
                setEmailEdit('');
                setUsernameEdit('');
                setErrors([]);
                setPassword('');
                setOldPassword('');
                setPasswordConfirm(''); 
              }
            })
            .catch(err => {
              setErrors(old => [...old, err.response.data.message]);
            })
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
              onClick={() => { setEditMode(!editMode); setUsernameEdit(username); setEmailEdit(email);}}
            />
          </div>
          <input
            type="text"
            placeholder="username"
            readOnly={!editMode}
            className={`w-full p-2 rounded-md border-2 focus:outline-none border-gray-300 ${
              editMode ? "" : "bg-gray-200"
            }`}
            value={editMode ? usernameEdit : username}
            onChange={(e) => setUsernameEdit(e.target.value)}
          />
          <input
            type="email"
            placeholder="email"
            readOnly={!editMode}
            className={`w-full p-2 rounded-md border-2 focus:outline-none border-gray-300 ${
              editMode ? "" : "bg-gray-200"
            }`}
            value={editMode ? emailEdit : email}
            onChange={(e) => setEmailEdit(e.target.value)}
          />

          <input
            type="password"
            placeholder={`${editMode ? "old" : ""} password`}
            readOnly={!editMode}
            className={`w-full p-2 rounded-md border-2 focus:outline-none border-gray-300 ${
              editMode ? "" : "bg-gray-200"
            }`}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            readOnly={!editMode}
            className={`w-full p-2 rounded-md border-2 focus:outline-none border-gray-300 ${
              editMode ? "block" : "hidden"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="confirm password"
            readOnly={!editMode}
            className={`w-full p-2 rounded-md border-2 focus:outline-none border-gray-300 ${
              editMode ? "block" : "hidden"
            }`}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          <Error errors={errors} />
 
          <button
            className="p-2 rounded-md bg-blue-700 text-white"
            onClick={() => (editMode ? updateInfo() : "")}
          >
            change password
          </button>
        </div>
      </div>
    );
}
