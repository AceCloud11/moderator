import React, { useContext, useEffect, useState } from "react";
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
  Select,
  Textarea,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import axios from "axios";
import UserContext from "../Context/UserContext";

import Noty from "noty";

export default function User() {
  const [showPass, setShowPass] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fullname, setFullName] = useState("");
  const [signature, setSignature] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState("");

  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState([]);
  const [profile, setProfile] = useState([]);

  const handleClickConfirm = () => {
    setShowConfirm(!showConfirm);
  };
  const handleClickPass = () => {
    setShowPass(!showPass);
  };
  const handleClickOldPass = () => {
    setShowOldPass(!showOldPass);
  };

  const data = useContext(UserContext);

  const fetchFavs = () => {
    axios
      .get("/favourites", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      .then((res) => {
        const favs = res.data.data;

        favs.map((element) => {
          element.img = "https://wiflix.biz/wfimages/" + element.img;
        });
        setFavorites(favs);
      })
      .catch(console.error);
  };

  const fetchProfile = () => {
    axios
      .get("http://192.168.3.7:8001/api/profile", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      .then((res) => {
        const prof = res.data;

        setProfile(res.data);
        
      })
      .catch(console.error);
  };



  useEffect(() => {
    fetchFavs();

    fetchProfile();

    // console.log(data);

    return () => {};
  }, []);

  const updateProfile = () => {
    // console.log(profile);
    if (
      fullname !== "" &&
      signature !== "" &&
      location !== "" &&
      avatar !== "" &&
      bio !== ""
    ) {
      const updated = {
        full_name: fullname,
        signature,
        location,
        avatar,
        bio,
      };

      axios
        .put("http://192.168.3.7:8001/api/profile", updated, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        })
        .then((res) => {
          fetchProfile();
          setFullName('');
          setLocation('');
          setBio('');
          setSignature('');
          setAvatar('');
          new Noty({
            text: "Profile updated",
            type: 'success',
            timeout: 3000
          }).show();
        });
    }else{
      console.log(profile);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:px-8 py-8">
      <div
        className=" flex items-center flex-col py-8 space-y-4 text-white rounded-md"
        style={{ backgroundColor: "#30365aa4" }}
      >
        {/* <Avatar src={profile.profile.avatar} size="xl" /> */}
        <h3 className="text-lg font-bold">John Doe</h3>
        <ul className="w-full px-12">
          <li className="flex items-center justify-between border-t-2 border-gray-300 border-dashed py-2">
            <span>Comments</span>
            <Badge colorScheme="purple">{comments.length}</Badge>
          </li>
          <li className="flex items-center justify-between border-t-2 border-gray-300 border-dashed py-2">
            <span>Favourites</span>
            <Badge colorScheme="red">{favorites.length}</Badge>
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
            <Tab>Favorites</Tab>
            <Tab>Comments</Tab>
            <Tab>Settings</Tab>
          </TabList>

          <TabPanels>
            <TabPanel className="">
              <ul className="w-full space-y-2">
                {favorites.length ? (
                  favorites.map((fav) => (
                    <li
                      className="flex items-center gap-3 bg-gray-100 p-2 rounded-md"
                      key={fav.id}
                    >
                      <Avatar src={fav.img} size="sm" />
                      <a href="" className="text-indigo-800 font-mono">
                        {fav.title}
                      </a>
                    </li>
                  ))
                ) : (
                  <Alert status="warning" className="text-black rounded-md">
                    <AlertIcon />
                    Seems that you don't have any favorites
                  </Alert>
                )}
              </ul>
            </TabPanel>
            <TabPanel>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Movie / Serie Name</Th>
                      <Th>Comment</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Crown</Td>
                      <Td>That is a beautiful movie</Td>
                      <Td className="space-x-3">
                        <Button colorScheme="teal" size="sm">
                          Edit
                        </Button>
                        <Button colorScheme="red" size="sm">
                          delete
                        </Button>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Crown</Td>
                      <Td>That is a beautiful movie</Td>
                      <Td className="space-x-3">
                        <Button colorScheme="teal" size="sm">
                          Edit
                        </Button>
                        <Button colorScheme="red" size="sm">
                          delete
                        </Button>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Crown</Td>
                      <Td>That is a beautiful movie</Td>
                      <Td className="space-x-3">
                        <Button colorScheme="teal" size="sm">
                          Edit
                        </Button>
                        <Button colorScheme="red" size="sm">
                          delete
                        </Button>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel className="space-y-4">
              <div className="flex gap-4 flex-wrap lg:flex-nowrap">
                <Input
                  placeholder={profile.username ? profile.username : "Username"}
                />
                <Input placeholder={profile.email ? profile.email : "Email"} />
              </div>
              <Button colorScheme="blue">Update Info</Button>
              <div className="flex gap-4 flex-wrap lg:flex-nowrap">
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={showPass ? "text" : "password"}
                    placeholder="Old password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleClickOldPass}
                      colorScheme="telegram"
                    >
                      {showOldPass ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={showPass ? "text" : "password"}
                    placeholder="New password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleClickPass}
                      colorScheme="telegram"
                    >
                      {showPass ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleClickConfirm}
                      colorScheme="telegram"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </div>
              <Button colorScheme="blue">Update Password</Button>

              <div className="flex gap-4 flex-wrap lg:flex-nowrap">
                <Input
                  placeholder={profile.length ? profile.profile.full_name : null}
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullname}
                />
                <Input
                  // placeholder={profile.profile.signature}
                  onChange={(e) => setSignature(e.target.value)}
                  value={signature}
                />
              </div>
              <div className="flex gap-4 flex-wrap lg:flex-nowrap">
                <Textarea
                  // placeholder={profile.profile.bio}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <Input
                  // placeholder={profile.profile.location}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Input
                  type="file"
                  // value={avatar}
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
              </div>
              <Button colorScheme="blue" onClick={updateProfile}>
                Update Info
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}
