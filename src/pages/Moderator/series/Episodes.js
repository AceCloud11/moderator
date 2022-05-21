import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Alert,
  AlertIcon,
  Button,
  useToast,
} from "@chakra-ui/react";
import Hosts from "../../../components/Hosts";

export default function Episodes() {
  const { token } = useContext(UserContext);

  const [episodes, setEpisodes] = useState([]);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState([]);
  const [vf, setVf] = useState(true);
  const [num, setNum] = useState("");
  const [src, setSrc] = useState("");
  const [epId, setEpId] = useState("");
  const [eps, setEps] = useState([]);
  const [hosts, setHosts] = useState([]);

  let { serieId } = useParams();

  const fillNumbers = () => {
    var arr = [];
    for (let index = 0; index < 100; index++) {
      arr.push(index + 1);
    }
    return arr;
  };

  const fetchEpisodes = async () => {
    await axios({
      url: "/moderator/episodes/" + serieId,
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        // console.log(res.data);
        await setTitle(res.data.title);
        // let eps = [];
        // res.data.episodes.forEach((ep) => {
        //   if (!eps.includes(ep.num)) {
        //     eps.push(ep.num);
        //   }
        // });
        await setEpisodes(res.data.episodes);
      })
      .catch((err) => {
        console.error(err);
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
  const toast = useToast();

  //   create new episode
  const createEpisode = async (e) => {
    // console.log(episodes);
    e.preventDefault();
    if (!src.includes("http://") && !src.includes("https://")) {
      await setErrors((old) => [...old, "veuillez entrer un lien valide"]);
      // setSrc("");
      return;
    }

    // extract name from the url
    let n = src.split("//")[1].split(".")[0];

    if (!hosts.includes(n)) {
      await setErrors((old) => [...old, `la source ${n} n'est pas autorisée`]);
      return;
    }

    const data = {
      num: parseInt(num),
      vf: vf,
      src: src,
      name: n
    };

    setErrors([]);
    await axios({
      url: "/moderator/episodes/" + serieId,
      method: "post",
      data,
      responseType: "json",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        // console.log(res.data);
        if (res.data.error) {
          await setErrors((old) => [...old, res.data.error]);
        } else {
          await setErrors([]);
          await setSrc("");
          await setNum("");
          await setVf(false);
          toast({
            title: res.data.message,
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top-right",
          });

          onCloseCreate();
          await fetchEpisodes();
        }
      })
      .catch(async (err) => {
        // console.log(err.response);
        await setErrors((old) => [...old, err.response.data.message]);
      });
  };

  //   update episode
  const updateEpisode = async () => {
    if (!src.includes("http://") && !src.includes("https://")) {
      await setErrors((old) => [...old, "veuillez entrer un lien valide"]);
      // setSrc("");
      return;
    }

    // extract name from the url
    let n = src.split("//")[1].split(".")[0];

    if (!hosts.includes(n)) {
      await setErrors((old) => [...old, `la source ${n} n'est pas autorisée`]);
      return;
    }

    const data = {
      num: parseInt(num),
      vf: vf,
      src: src,
      name: n,
    };

    setErrors([]);

    // if (src === "") {
    //   await setErrors((old) => [...old, "Enter a valid source"]);
    // }

    await axios({
      url: "/moderator/episodes/" + epId,
      method: "put",
      data,
      responseType: "json",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        // console.log(res.data);
        if (res.data.error) {
          await setErrors((old) => [...old, res.data.error]);
        } else {
          await setErrors([]);
          await setSrc("");
          await setNum("");
          await setVf(false);
          await setEpId("");
          toast({
            title: res.data.message,
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top-right",
          });

          onCloseEdit();
          fetchEpisodes();
        }
      })
      .catch(async (err) => {
        // console.log(err.response);
        await setErrors((old) => [...old, err.response.data.message]);
      });
  };

  // delete episode
  const deleteEpisode = async (e, id) => {
    e.preventDefault();
    await axios({
      url: "/moderator/episodes/" + id,
      method: "delete",
      responseType: "json",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        // console.log(res.data);
        if (res.data.error) {
          await setErrors((old) => [...old, res.data.error]);
        } else {
          await setEpId("");
          toast({
            title: res.data.message,
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top-right",
          });
          fetchEpisodes();
        }
      })
      .catch(async (err) => {
        // console.log(err.response);
        await setErrors((old) => [...old, err.response.data.message]);
      });
  };

  useEffect(async () => {
    await fetchEpisodes();
    setEps(fillNumbers());
    setHosts(['evoload', 'mystream', 'doodstream', 'upload'])
    // console.log(eps);

    return () => {};
  }, []);

  return (
    <div className="w-full">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="p-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-center text-xl font-bold hidden md:block">
            {title}
          </h1>

          <button
            className="block px-4 py-2 rounded-md bg-indigo-600 text-white"
            onClick={onOpenCreate}
          >
            Ajouter un épisode
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                IDENTIFIANT
              </th>

              <th scope="col" className="px-6 py-3">
                Numéro d'épisode
              </th>
              <th scope="col" className="px-6 py-3">
                Nom d'épisode
              </th>

              <th scope="col" className="p-4">
                SOURCE
              </th>
              <th scope="col" className="p-4">
                VF
              </th>

              <th scope="col" className="px-6 py-3 text-center">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {episodes.length
              ? episodes.map((ep) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={Math.random()}
                  >
                    <td className="w-4 p-4">{ep.id}</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {ep.num}
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {ep.name}
                    </th>
                    <td className="w-4 p-4 text-gray-900">{ep.src}</td>
                    <td className="w-4 p-4 text-gray-900">
                      {ep.vf == 1 ? "Yes" : "No"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={(e) => {
                          e.preventDefault();
                          setNum(ep.num);
                          setSrc(ep.src);
                          setEpId(ep.id);
                          setErrors([]);
                          if (ep.vf == true) {
                            setVf(true);
                          }
                          onOpenEdit();
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={(e) => deleteEpisode(e, ep.id)}
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
          await setNum("");
          setErrors([]);
          await setVf(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nouvel épisode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <form action="" className="space-y-4">
                <div className="flex gap-4">
                  {/* <input
                    type="number"
                    placeholder="Numéro d'épisode"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={num}
                    onChange={(e) => setNum(e.target.value)}
                  /> */}

                  <select
                    value={num}
                    onChange={(e) => setNum(e.target.value)}
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                  >
                    <option selected>choisir un épisode</option>
                    {eps.length
                      ? eps.map((el) => <option value={el}>{el}</option>)
                      : null}
                  </select>
                </div>

                <div className="flex gap-4">
                  <label className="label cursor-pointer space-x-2">
                    <span className="label-text">VF</span>
                    <input
                      type="checkbox"
                      value={vf}
                      onChange={(e) => {
                        setVf(!vf);
                      }}
                      className="checkbox"
                    />
                  </label>
                </div>

                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Source"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={src}
                    onChange={(e) => setSrc(e.target.value)}
                  />
                </div>
                <Hosts hosts={hosts}/>
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
                await setNum("");
                setErrors([]);
                await setVf(false);
              }}
            >
              Close
            </Button>
            <Button colorScheme="linkedin" onClick={createEpisode}>
              Add Episode
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Episode Modal */}
      <Modal
        isOpen={isOpenEdit}
        onClose={async () => {
          onCloseEdit();
          await setSrc("");
          await setNum("");
          setErrors([]);
          await setVf(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Episode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <form action="" className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Episode Number"
                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                    value={num}
                    readOnly
                  />
                </div>

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

                <div className="flex gap-4">
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
                await setSrc("");
                await setNum("");
                setErrors([]);
                await setVf(false);
              }}
            >
              Close
            </Button>
            <Button colorScheme="linkedin" onClick={updateEpisode}>
              Update Episode
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
