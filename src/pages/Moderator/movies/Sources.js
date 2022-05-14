import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function Sources() {
  const [sources, setSources] = useState([]);
  const [title, setTitle] = useState("");
  const [name, setName] = useState('');
  const [src, setSrc] = useState('');
  const [errors, setErrors] = useState([]);
  const [srcId, setSrcId] = useState(null);

  const { token } = useContext(UserContext);

  const { id } = useParams();

  const fetchSources = async () => {
    await axios({
      url: "/moderator/movie-sources/" + id,
      method: "get",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        setTitle(res.data.title);
        setSources(res.data.movieSources);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const addSources = async () => {
      setErrors([]);
    if (name === '' || src === '') {
        setErrors((old) => [...old, "Tout les champs est obligatoire"]);
      return;
    }

    await axios({
      url: "/moderator/movie-sources/" + id,
      method: "post",
      responseType: "json",
      data: {
        name,
        src
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (response) => {
        toast.success(response.data.message);
       setSrc('');
       setErrors([]);
       setName('');
       onCloseCreate();
       fetchSources();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

const updateSources = async () => {
    setErrors([]);
    if (name === "" || src === "") {
    setErrors((old) => [...old, "Tout les champs est obligatoire"]);
    return;
    }

    await axios({
    url: "/moderator/movie-sources/" + srcId,
    method: "put",
    responseType: "json",
    data: {
        name,
        src,
    },
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
    },
    })
    .then(async (response) => {
        toast.success(response.data.message);
        setSrc("");
        setErrors([]);
        setName("");
        onCloseEdit();
        fetchSources();
    })
    .catch((error) => {
        toast.error(error.response.data.message);
    });
};

const deleteSources = async (srcid) => {
  await axios({
    url: "/moderator/movie-sources/" + srcid,
    method: "delete",
    responseType: "json",
    data: {
      name,
      src,
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then(async (response) => {
      toast.success(response.data.message);
      fetchSources();
    })
    .catch((error) => {
      toast.error(error.response.data.message);
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
    fetchSources();

    return () => {};
  }, []);

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="p-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-center text-xl font-bold hidden md:block">
            {title}
          </h1>

          <button
            className="block px-4 py-2 rounded-md bg-indigo-600 text-white"
            onClick={onOpenCreate}
          >
            Ajouter un lien
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                IDENTIFIANT
              </th>

              <th scope="col" className="px-6 py-3">
                Nom
              </th>

              <th scope="col" className="p-4">
                SOURCE
              </th>
              {/* <th scope="col" className="p-4">
                VF
              </th> */}

              <th scope="col" className="px-6 py-3 text-center">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sources.length
              ? sources.map((src) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={Math.random()}
                  >
                    <td className="w-4 p-4">{src.id}</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {src.name}
                    </th>
                    <td className="w-4 p-4 text-gray-900">{src.src}</td>

                    <td className="px-6 py-4 text-center">
                      <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={(e) => {
                          e.preventDefault();
                          setName(src.name);
                          setSrc(src.src);
                          setSrcId(src.id);
                          onOpenEdit();
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={(e) => deleteSources(src.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      {/* Create Episode Modal */}
      <Modal
        isOpen={isOpenCreate}
        onClose={async () => {
          onCloseCreate();
          await setSrc("");
          await setName("");
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
                    placeholder="Nom du lecteur"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="lien"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={src}
                    onChange={(e) => setSrc(e.target.value)}
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
                await setSrc("");
                await setName("");
              }}
            >
              Close
            </Button>
            <Button colorScheme="linkedin" onClick={addSources}>
              Ajouter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Episode Modal */}
      <Modal
        isOpen={isOpenEdit}
        onClose={() => {
          onCloseEdit();
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
                    placeholder="Nom"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Source"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={src}
                    onChange={(e) => setSrc(e.target.value)}
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
                setName('');
                setSrc('');
                setSrcId(null);
              }}
            >
              Close
            </Button>
            <Button colorScheme="linkedin" onClick={updateSources}>
              Modifier
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
