import React, { Component } from "react";
import {
  Avatar,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  TableContainer,
  Input,
  Text,
  Textarea,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import axios from "axios";
import UserContext from "../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

export default class Profile extends Component {
  static contextType = UserContext;

  constructor() {
    super();

    this.state = {
      showPass: false,
      showOldPass: false,
      showConfirm: false,
      full_name: "",
      signature: "",
      bio: "",
      location: "",
      avatar: "",
      favorites: [],
      favid: "",
      comments: [],
      comment: "",
      commentid: "",
      info: [],
      profile: [],
      token: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
      errors: [],
      username: "",
      email: "",
      infoErrors: [],
      profErrors: [],
      editMode: false,
    };
  }

  handleClickConfirm = () => {
    this.setState({ showConfirm: !this.state.showConfirm });
  };
  handleClickPass = () => {
    this.setState({ showPass: !this.state.showPass });
  };
  handleClickOldPass = () => {
    this.setState({ showOldPass: !this.state.showOldPass });
  };

  fetchFavs = () => {
    // console.log("fav", this.state.token);
    axios
      .get("/favourites", {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })
      .then(async (res) => {
        const favs = res.data.data;

        // favs.map((element) => {
        //   element.img = "https://wiflix.biz/wfimages/" + element.img;
        // });

        await this.setState(
          {
            favorites: favs,
          }
        );
      })
      .catch(console.error);
  };

  fetchComments = async () => {
    // console.log("fav", this.state.token);
    await axios({
      method: "get",
      url: "/my-comments",
      responseType: "json",
      headers: {
        Authorization: `Bearer ${this.state.token}`,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then(async (res) => {
        const comms = res.data.data;
        // console.log(comms);
        await this.setState({
          comments: comms,
        });
      })
      .catch(console.error);
  };

  fetchProfile = async () => {
    axios
      .get("/profile", {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
          "Content-type": "application/json",
          Accept: "application/json",
        },
      })
      .then(async (res) => {
        const prof = res.data;
        const profiledata = prof.profile;
        // console.log('data' , profiledata);
        await this.setState({
          profile: {
            fullname: res.data.profile.full_name,
            location: res.data.profile.location,
            bio: res.data.profile.bio,
            avatar: res.data.profile.avatar,
            signature: res.data.profile.signature,
          },
          info: {
            username: prof.username,
            email: prof.email,
          },
          full_name: res.data.profile.full_name,
          location: res.data.profile.location,
          bio: res.data.profile.bio,
          avatar: res.data.profile.avatar,
          signature: res.data.profile.signature,
          email: prof.email,
          username: prof.username,
        });
      })
      .catch(console.error);
  };

  updateProfile = async () => {
    // console.log(profile);
    if (
      this.state.full_name !== "" &&
      this.state.signature !== "" &&
      this.state.location !== "" &&
      this.state.bio !== ""
    ) {
      const updated = {
        full_name: this.state.full_name,
        signature: this.state.signature,
        location: this.state.location,
        bio: this.state.bio,
      };
      // console.log(updated);

      axios({
        method: "put",
        url: "/profile",
        data: updated,
        responseType: "json",
        headers: {
          Authorization: `Bearer ${this.state.token}`,
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then(async (res) => {
          if (res.data.error) {
            await this.setState({
              profErrors: [...this.state.profErrors, res.data.error],
            });
          }

          if (res.data.message) {
            await this.setState({
              full_name: "",
              location: "",
              avatar: "",
              bio: "",
              signature: "",
              profErrors: [],
            });

            this.fetchProfile();
            toast.success(res.data.message);
          }
        })
        .catch(async (err) => {
          await this.setState({
            profErrors: [...this.state.profErrors, err.response.data.message],
          });
        });
    } else {
      await this.setState({
        profErrors: [
          ...this.state.profErrors,
          "please fill the required fields",
        ],
      });
    }
  };

  updatePassword = async (e) => {
    e.preventDefault();
    const passwords = {
      old_password: this.state.oldPassword,
      password: this.state.password,
      password_confirmation: this.state.confirmPassword,
    };

    if (passwords.old_password === passwords.password) {
      await this.setState({
        errors: [
          ...this.state.errors,
          "old password and new password must not be the same",
        ],
      });
    }

    if (passwords.password !== passwords.password_confirmation) {
      await this.setState({
        error: this.state.errors.push(
          "new password does not match confirmation"
        ),
      });
    }

    if (
      passwords.old_password !== passwords.password &&
      passwords.password === passwords.password_confirmation
    ) {
      await this.setState({ errors: [] });

      axios({
        method: "put",
        url: "/user/update-password",
        data: {
          old_password: passwords.old_password,
          password: passwords.password,
          password_confirmation: passwords.password_confirmation,
        },
        responseType: "json",
        headers: {
          Authorization: `Bearer ${this.state.token}`,
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then(async (res) => {
          if (res.data.error) {
            await this.setState({
              errors: [...this.state.errors, res.data.error],
            });
          }
          if (res.data.message) {
            await this.setState({
              password: "",
              oldPassword: "",
              confirmPassword: "",
              errors: [],
            });

            toast.success(res.data.message);
          }
        })
        .catch(async (err) => {
          await this.setState({
            errors: [...this.state.errors, err.response.data.message],
          });
        });
    }
  };

  updateInfo = async () => {
    const info = {
      username: this.state.username,
      email: this.state.email,
    };

    await axios({
      method: "put",
      url: "/user",
      data: info,
      responseType: "json",
      headers: {
        Authorization: `Bearer ${this.state.token}`,
        "Content-type": "application/json",
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        await this.setState({
          username: "",
          email: "",
          infoErrors: [],
        });
        this.fetchProfile();
        toast.success(res.data.message);
      })
      .catch(async (err) => {
        // console.error(err.response.data);
        await this.setState({
          infoErrors: [...this.state.infoErrors, err.response.data.message],
        });
      });
  };

  updateComment = async () => {
    let url = `/comments/${this.state.commentid}`;
    await axios({
      method: "put",
      url,
      data: {
        text: this.state.comment,
      },
      responseType: "json",
      headers: {
        Authorization: `Bearer ${this.state.token}`,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then(async (res) => {
        await this.fetchComments();
        await this.setState({
          comment: "",
          commentid: "",
          editMode: false,
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  deleteComment = async () => {
    let url = `/comments/${this.state.commentid}`;
    await axios({
      method: "delete",
      url,
      responseType: "json",
      headers: {
        Authorization: `Bearer ${this.state.token}`,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then(async (res) => {
        await this.fetchComments();
        await this.setState({
          commentid: "",
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  deleteFavourite = async () => {
    let url = `/favourites/${this.state.favid}`;
    await axios({
      method: "delete",
      url,
      responseType: "json",
      headers: {
        Authorization: `Bearer ${this.state.token}`,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then(async (res) => {
        await this.fetchFavs();
        await this.setState({
          favid: "",
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  componentDidMount() {
    const { token } = this.context;
    this.setState(
      {
        token: token,
      },
      () => {
        this.fetchFavs();
        this.fetchProfile();
        this.fetchComments();
      }
    );
  }

  logout = () => {
    Cookies.remove('role');  
    Cookies.remove("token");

    window.location.href = '/';
  }

  render() {
    return (
      <div className="grid grid-cols-1 gap-4 md:px-8 py-8 h-screen overflow-y-scroll">
        <ToastContainer />
        <div
          className=" flex items-center flex-col py-8 space-y-4 text-white rounded-md"
          style={{ backgroundColor: "#30365aa4" }}
        >
          <Avatar src={this.state.avatar} size="xl" />
          <h3 className="text-lg font-bold">{this.state.info.username}</h3>
          <button
            className="p-2 bg-red-500 text-white font-bold rounded-md"
            onClick={this.logout}
          >
            Se déconnecter
          </button>
          <ul className="w-full px-12">
            <li className="flex items-center justify-between border-t-2 border-gray-300 border-dashed py-2">
              <span>Commentaires</span>
              <Badge colorScheme="purple">{this.state.comments.length}</Badge>
            </li>
            <li className="flex items-center justify-between border-t-2 border-gray-300 border-dashed py-2">
              <span>Favoris</span>
              <Badge colorScheme="red">{this.state.favorites.length}</Badge>
            </li>
            {/* <li className="flex items-center justify-between border-t-2 border-gray-300 border-dashed py-2">
            <span>Comments</span> <Badge colorScheme="blue">New</Badge>
          </li> */}
          </ul>
        </div>
        <div
          className="text-white rounded-md p-4"
          style={{ backgroundColor: "#30365aa4" }}
        >

          <Tabs>
            <TabList>
              <Tab>Favoris</Tab>
              <Tab>Commentaires</Tab>
              <Tab>Réglages</Tab>
            </TabList>

            <TabPanels>
              <TabPanel className="">
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Nom du film / de la série</Th>
                        <Th>Type</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {this.state.favorites.length ? (
                        this.state.favorites.map((fav) => (
                          <Tr>
                            <Td className="flex gap-2 items-center">
                              <Avatar src={fav.img} size="sm"></Avatar>
                              {fav.title}
                            </Td>
                            <Td>{fav.type} </Td>

                            <Td className="space-x-3">
                              <Button
                                colorScheme="red"
                                size="sm"
                                onClick={async () => {
                                  await this.setState({
                                    favid: fav.id,
                                  });
                                  this.deleteFavourite();
                                }}
                              >
                                Supprimer
                              </Button>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Alert
                          status="warning"
                          className="text-black rounded-md my-4"
                        >
                          <AlertIcon />
                          Il semble que vous n'ayez pas de favoris
                        </Alert>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Nom du film / de la série</Th>
                        <Th>Commentaire</Th>
                        <Th>A approuvé</Th>
                        <Th>Aime</Th>
                        <Th>N'aime pas</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {this.state.comments.length ? (
                        this.state.comments.map((com) => (
                          <Tr>
                            <Td>{com.post_title}</Td>
                            <Td>
                              <p>{com.text}</p>
                            </Td>
                            <Td>
                              {com.is_approved ? (
                                <Badge colorScheme="green">Approved</Badge>
                              ) : (
                                <Badge colorScheme="red">Declined</Badge>
                              )}
                            </Td>
                            <Td>{com.likes}</Td>
                            <Td>{com.dislikes}</Td>

                            <Td className="space-x-3">
                              <Button
                                colorScheme="teal"
                                size="sm"
                                onClick={() =>
                                  this.setState({
                                    editMode: true,
                                    comment: com.text,
                                    commentid: com.id,
                                  })
                                }
                              >
                                Modifier
                              </Button>
                              <Button
                                colorScheme="red"
                                size="sm"
                                onClick={async () => {
                                  await this.setState({
                                    commentid: com.id,
                                  });
                                  this.deleteComment();
                                }}
                              >
                                Supprimer
                              </Button>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Alert
                          status="warning"
                          className="text-black rounded-md my-4"
                        >
                          <AlertIcon />
                          Il semble que vous n'ayez aucun commentaire
                        </Alert>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel className="space-y-4">
                <div className="space-y-4">
                  {this.state.infoErrors.length
                    ? this.state.infoErrors.map((el) => (
                        <Alert status="error" className="text-black rounded-md">
                          <AlertIcon />
                          {el}
                        </Alert>
                      ))
                    : null}
                </div>
                <div className="flex gap-4 flex-wrap lg:flex-nowrap">
                  <Input
                    placeholder={
                      this.state.info.username
                        ? this.state.info.username
                        : "Username"
                    }
                    value={this.state.username}
                    onChange={(e) =>
                      this.setState({ username: e.target.value })
                    }
                  />
                  <Input
                    placeholder={
                      this.state.info.email ? this.state.info.email : "Email"
                    }
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </div>
                <Button colorScheme="blue" onClick={this.updateInfo}>
                  Mise à jour
                </Button>
                <div className="space-y-4">
                  {this.state.errors.length
                    ? this.state.errors.map((el) => (
                        <Alert status="error" className="text-black rounded-md">
                          <AlertIcon />
                          {el}
                        </Alert>
                      ))
                    : null}
                </div>
                <div className="flex gap-4 flex-wrap lg:flex-nowrap">
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={this.state.showOldPass ? "text" : "password"}
                      placeholder="Old password"
                      value={this.state.oldPassword}
                      onChange={(e) =>
                        this.setState({ oldPassword: e.target.value })
                      }
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={this.handleClickOldPass}
                        colorScheme="telegram"
                        value={this.state.oldPassword}
                      >
                        {this.state.showOldPass ? "Cacher" : "Afficher"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={this.state.showPass ? "text" : "password"}
                      placeholder="New password"
                      value={this.state.password}
                      onChange={(e) =>
                        this.setState({ password: e.target.value })
                      }
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={this.handleClickPass}
                        colorScheme="telegram"
                      >
                        {this.state.showPass ? "Cacher" : "Afficher"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={this.state.showConfirm ? "text" : "password"}
                      placeholder="Confirm password"
                      value={this.state.confirmPassword}
                      onChange={(e) =>
                        this.setState({ confirmPassword: e.target.value })
                      }
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={this.handleClickConfirm}
                        colorScheme="telegram"
                      >
                        {this.state.showConfirm ? "Cacher" : "Afficher"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </div>
                <Button colorScheme="blue" onClick={this.updatePassword}>
                  Mettre à jour le mot de passe
                </Button>
                <div className="space-y-4">
                  {this.state.profErrors.length
                    ? this.state.profErrors.map((el) => (
                        <Alert status="error" className="text-black rounded-md">
                          <AlertIcon />
                          {el}
                        </Alert>
                      ))
                    : null}
                </div>
                <div className="flex gap-4 flex-wrap lg:flex-nowrap">
                  <Input
                    placeholder={
                      this.state.profile.fullname
                        ? this.state.profile.fullname
                        : "FullName"
                    }
                    onChange={(e) =>
                      this.setState({ full_name: e.target.value })
                    }
                    value={this.state.full_name}
                  />
                  <Input
                    placeholder={
                      this.state.profile.signature
                        ? this.state.profile.signature
                        : "Signature"
                    }
                    onChange={(e) =>
                      this.setState({ signature: e.target.value })
                    }
                    value={this.state.signature}
                  />
                </div>
                <div className="flex gap-4 flex-wrap lg:flex-nowrap">
                  <Textarea
                    placeholder={
                      this.state.profile.bio ? this.state.profile.bio : "Bio"
                    }
                    value={this.state.bio}
                    onChange={(e) => this.setState({ bio: e.target.value })}
                  ></Textarea>
                  <Input
                    placeholder={
                      this.state.profile.location
                        ? this.state.profile.location
                        : "Location"
                    }
                    value={this.state.location}
                    onChange={(e) =>
                      this.setState({ location: e.target.value })
                    }
                  />
                  <Input
                    type="file"
                    // value={avatar}
                    onChange={(e) =>
                      this.setState({ avatar: e.target.files[0] })
                    }
                  />
                </div>
                <Button colorScheme="blue" onClick={this.updateProfile}>
                  Mise à jour
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>

        <div
          className="bg-white absolute p-4 rounded-md space-y-4"
          style={{
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            zIndex: 200,
            display: this.state.editMode ? "block" : "none",
            maxWidth: 500,
          }}
        >
          <textarea
            name=""
            id=""
            rows="10"
            className="w-full border-2 border-gray-200 bg-transparent p-2 rounded-md"
            value={this.state.comment}
            onChange={(e) => this.setState({ comment: e.target.value })}
          ></textarea>
          <button
            className="p-2 rounded-md bg-teal-500 text-white font-bold"
            onClick={this.updateComment}
          >
            Mise à jour
          </button>
          <button
            className="p-2 rounded-md bg-gray-500 text-white font-bold ml-2"
            onClick={() => this.setState({ editMode: false })}
          >
            close
          </button>
        </div>
      </div>
    );
  }
}
