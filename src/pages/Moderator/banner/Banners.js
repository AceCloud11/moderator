import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../../../Context/UserContext";



import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {logoutUnAuthenticatedUsers} from "../../../helpers/helpers";

export default function Banners() {
  const { token } = useContext(UserContext);
  const [banners, setBanners] = useState([]);
  const [banner, setBanner] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState([]);
  const [idBanner, setId] = useState('');

  const fetchBanners = () => {
    axios({
      url: "/moderator/banners",
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        await setBanners(res.data);
      })
      .catch((err) => {
        console.error(err);
        logoutUnAuthenticatedUsers(err.response.status);
      });
  };

  const deleteBanner = (id) => {
    setErrors([]);
    axios({
      url: "/moderator/banners/" + id,
      method: "delete",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        toast.success(res.data.message);
        fetchBanners();
      })
      .catch((err) => {
        setErrors((old) => [...old, err.response.data.message]);
      });
  };

  const updateBanner = () => {
    axios({
      url: "/moderator/banners/" + idBanner,
      method: "put",
      responseType: "json",
      data: {
        text: banner,
        url: link,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        if (res.data.success) {
          toast.success(res.data.success);
          setBanner("");
          setLink("");
          onCloseEdit();
          fetchBanners();
        } else {
          setErrors((old) => [...old, res.data.error]);
        }
      })
      .catch((err) => {
         if (err.response.data.message) {
           setErrors((old) => [...old, err.response.data.message]);
         } else {
           setErrors((old) => [...old, err.response.data.error]);
         }
      });
  };

  const addBanner = () => {
    setErrors([]);
    axios({
      url: "/moderator/banners/",
      method: "post",
      responseType: "json",
      data: {
        text: banner,
        url: link,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        if (res.data.success) {
          toast.success(res.data.success);
          setBanner("");
          setLink('');
          onCloseCreate();
          fetchBanners();
        } else {
          setErrors((old) => [...old, res.data.error]);
        }
      })
      .catch((err) => {
        if (err.response.data.message) {
          setErrors((old) => [...old, err.response.data.message]);
        } else {
          setErrors((old) => [...old, err.response.data.error]);
        }
      });
  };

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  useEffect(() => {
    fetchBanners();

    return () => {};
  }, []);

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="p-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-center text-xl font-bold hidden md:block">
            {/* {title} */}
          </h1>

          <button
            className="block px-4 py-2 rounded-md bg-indigo-600 text-white"
            onClick={onOpenCreate}
          >
            Ajouter un Bannière
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                IDENTIFIANT
              </th>

              <th scope="col" className="px-6 py-3">
                Text
              </th>

              <th scope="col" className="px-6 py-3 text-center">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {banners.length
              ? banners.map((banner) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={banner.id}
                  >
                    <td className="w-4 p-4">{banner.id}</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {banner.text}
                    </th>

                    <td className="px-6 py-4 text-center">
                      <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={(e) => {
                          e.preventDefault();
                          setBanner(banner.text)
                          setLink(banner.url);
                          setId(banner.id);
                          onOpenEdit();
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={(e) => deleteBanner(banner.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      {/* Create Banner */}
      <Modal
        isOpen={isOpenCreate}
        onClose={async () => {
          onCloseCreate();
          await setBanner("");
          await setLink("");
          await setErrors([]);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bannièr</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <form action="" className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <input
                    type="text"
                    placeholder="text"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="lien"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>

                <div className="space-y-4 my-4">
                  {errors.length
                    ? errors.map((error) => (
                        <Alert
                          status="error"
                          className="rounded-md"
                          key={error}
                        >
                          <AlertIcon />
                          {error}
                        </Alert>
                      ))
                    : null}
                </div>
              </form>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                onCloseCreate();
                await setBanner("");
                await setLink("");
                setErrors([]);
              }}
            >
              Close
            </Button>
            <Button colorScheme="linkedin" onClick={addBanner}>
              Ajouter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Banner */}

      {/* Update Banner */}
      <Modal
        isOpen={isOpenEdit}
        onClose={async () => {
          onCloseEdit();
          await setBanner("");
          await setLink("");
          await setErrors([]);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Source</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <form action="" className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <input
                    type="text"
                    placeholder="text"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="lien"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>

                <div className="space-y-4 my-4">
                  {errors.length
                    ? errors.map((error) => (
                        <Alert
                          status="error"
                          className="rounded-md"
                          key={error}
                        >
                          <AlertIcon />
                          {error}
                        </Alert>
                      ))
                    : null}
                </div>
              </form>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                onCloseEdit();
                await setBanner("");
                await setLink("");
                setErrors([]);
              }}
            >
              Close
            </Button>
            <Button colorScheme="linkedin" onClick={updateBanner}>
              Modifier
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Banner */}
    </div>
  );
}
