import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import EpisodeTableRow from "./components/EpisodeTableRow";

export default function Episodes() {
  const { token } = useContext(UserContext);

  const [episodes, setEpisodes] = useState([]);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState([]);
  const [vf, setVf] = useState(true);
  const [num, setNum] = useState("");
  const [src, setSrc] = useState("");
  const [name, setName] = useState("");
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
        await setTitle(res.data.title);
        await setEpisodes(res.data.episodes);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
          // await setDashbaord(res.data);
          setHosts(res.data.map((el) => el.domain_name));

          // console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  const {
    isOpen: isOpenCreateSource,
    onOpen: onOpenCreateSource,
    onClose: onCloseCreateSource,
  } = useDisclosure();

  //create new episode
  const createEpisodeSource = async () => {

    if (src.includes("http://") || src.includes("https://")) {
      let n = src.split("//")[1].split("/")[0];
      if (!hosts.includes(n)) {
        await setErrors((old) => [...old, `la source ${n} n'est pas autorisée`]);
        return;
      }
      const data = {
        num: parseInt(num),
        vf: vf,
        src: src,
        name: name
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
              setErrors([]);
              setSrc("");
              setNum("");
              setName('');
              setVf(false);
              makeToast('success', res.data.success);

              onCloseCreateSource();
              await fetchEpisodes();

            }
          })
          .catch(async (err) => {
            // console.log(err.response);
            await setErrors((old) => [...old, err.response.data.message]);
          });
    } else {
      await setErrors((old) => [...old, "veuillez entrer un lien valide"]);
      // setSrc("");
      return;
    }

    // extract name from the url
  }



  const makeToast = (type, text) => {
   if (type === 'success') {
     toast.success(text);
   }else{
     toast.error(text);
   }

  }

  useEffect(async () => {
    await fetchEpisodes();
  //   setEps(fillNumbers());
    await getHosts();
  //   // console.log(eps);
  //
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
            onClick={onOpenCreateSource}
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
              <th scope="col" className="px-6 py-3 text-center">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {episodes.length
              ? episodes.map((ep) => (
                  <EpisodeTableRow
                      ep={ep}
                      key={ep.id}
                      hosts={hosts}
                      fetch={fetchEpisodes}
                      makeToast={makeToast}
                      token={token}
                  />
                ))
              : null}
          </tbody>
        </table>
      </div>

      <Modal
          isOpen={isOpenCreateSource}
          onClose={ () => {
            onCloseCreateSource();
            setSrc("");
            setNum("");
            setName('');
            setErrors([]);
            setVf(false);
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
                  <input
                      type="number"
                      placeholder="Numéro d'épisode"
                      className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                      value={num}
                      onChange={(e) => setNum(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <input
                      type="text"
                      placeholder="nom de lecteur"
                      className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      placeholder="lien de lecteur"
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
                onClick={() => {
                  onCloseCreateSource();
                  setSrc("");
                  setNum("");
                  setName('');
                  setErrors([]);
                  setVf(false);
                }}
            >
              Close
            </Button>
            <Button colorScheme="linkedin" onClick={createEpisodeSource}>
              Ajouter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
