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
import Hosts from "../../../components/Hosts";
import {addSources, deleteSources, getNameFromUrl, updateSources, validateDomain} from "../../../helpers/helpers";
import Source from "./components/Source";
import log from "tailwindcss/lib/util/log";
import Error from "../../../components/Error";

export default function Sources() {
  const [sources, setSources] = useState([]);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [src, setSrc] = useState("");
  const [errors, setErrors] = useState([]);
  const [srcId, setSrcId] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [vf, setVf] = useState(false);
  const [canAdd, setCanAdd] = useState(false);

  // change demain name
  const [lecteurs, setLecteurs] = useState([]);


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
        setSources(res.data.sources);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  // const addSources = async (arr) => {
  //   await axios({
  //     url: "/moderator/movie-sources/" + id,
  //     method: "post",
  //     responseType: "json",
  //     data: {
  //       sources: arr
  //     },
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       Authorization: "Bearer " + token,
  //     },
  //   })
  //     .then(async (response) => {
  //       toast.success(response.data.success);
  //       setSrc("");
  //       setErrors([]);
  //       setName("");
  //       onCloseCreate();
  //       await fetchSources();
  //     })
  //     .catch((error) => {
  //       toast.error(error.response.data.message);
  //     });
  // };




  const getHosts = async () => {
    axios({
      url: "/moderator/hosts",
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        setHosts(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrors([]);
    let sepeatedSources = src.split('\n');
    let arr = validateDomain(sepeatedSources, hosts, vf);
    if (arr[0].length){
      setErrors(arr[0]);
      return;
    }else{
      await addSources(arr[1], token, id);
      onCloseCreate();
      setVf(false);
      setSrc('');
      await fetchSources();
    }
  }

const handleDelete = async (id) => {
    await deleteSources(id, token);
    await fetchSources();
}

  const handleEdit = async () => {
    let err = await updateSources(name, src,srcId, token, hosts, vf);
    if (err.length){
      setErrors(err);
      return ;
    }
    setSrc('');
    setVf(false);
    setSrcId('');
    setName('');
    onCloseEdit();
    await fetchSources();
  }

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
    // setHosts(["evoload", "mystream", "doodstream", "upload"]);
    getHosts();

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

              <th scope="col" className="px-6 py-3">
                Version
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

                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {src.vf ? "VF" : "VOSTFR"}
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
                          setVf(src.vf == 1 ? true : false);
                          onOpenEdit();
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={(e) => handleDelete(src.id)}
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

      {/* Create Episode Modal */}
      <Modal

        isOpen={isOpenCreate}
        onClose={async () => {
          onCloseCreate();
          await setSrc("");
          await setName("");
          await setVf(true);
          setLecteurs([])
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lecteur</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <textarea
                  rows="10"
                  className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-purple-400"
                  value={src}
                  onChange={e => {
                    setSrc(e.target.value)
                  }}
              ></textarea>
              <div className="flex gap-4 w-full">
                <label className="label cursor-pointer space-x-2">
                  <span className="label-text">VF</span>
                  <input
                      type="checkbox"
                      checked={vf}
                      value={vf}
                      onChange={(e) => {
                        setVf(!vf);
                        console.log(vf)
                      }}
                      className="checkbox"
                  />
                </label>
              </div>
              <Error errors={errors}></Error>
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
                setVf(true);
                setErrors([]);
                setLecteurs([])
              }}
            >
              Close
            </Button>
            <Button colorScheme="linkedin" onClick={handleAdd}>
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
          setName("");
          setErrors([]);
          setSrc("");
          setSrcId(null);
          setVf(true);
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
                    readOnly
                    onChange={(e) => setName(e.target.value)}
                  />

                  {/* vf */}
                  <div className="flex gap-4">
                    <label className="label cursor-pointer space-x-2">
                      <span className="label-text">VF</span>
                      <input
                        type="checkbox"
                        checked={vf}
                        value={vf}
                        onChange={(e) => {
                          setVf(!vf);
                        }}
                        className="checkbox"
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder="Source"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={src}
                    onChange={(e) => setSrc(e.target.value)}
                  />

                  {/* <Hosts hosts={hosts} /> */}
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
                setName("");
                setErrors([]);
                setSrc("");
                setSrcId(null);
                setVf(true);
              }}
            >
              Close
            </Button>
            <Button colorScheme="linkedin" onClick={handleEdit}>
              Modifier
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );


}
