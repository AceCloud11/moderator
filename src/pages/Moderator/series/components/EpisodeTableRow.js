import React, {Fragment, useContext, useState} from 'react';
import EpisodeSourceTable from "./EpisodeSourceTable";
import {
    Alert,
    AlertIcon, Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, useDisclosure
} from "@chakra-ui/react";
import axios from "axios";

import {useParams} from "react-router-dom";
import UserContext from "../../../../Context/UserContext";

export default function EpisodeTableRow( { ep, hosts, fetch, makeToast, token }){


    const [showSources, setShowSources] = React.useState(false);
    const [num, setNum] = React.useState(null);
    const [vf, setVf] = React.useState(true);
    const [name, setName] = React.useState("");
    const [src, setSrc] = React.useState("");
    const [errors, setErrors] = React.useState([]);


    const {
        isOpen: isOpenCreateSource,
        onOpen: onOpenCreateSource,
        onClose: onCloseCreateSource,
    } = useDisclosure();



    let { serieId } = useParams();

    //create new source
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
                        fetch();

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

    //delete episode
    const deleteEpisode = async (id) => {
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
                makeToast('success', res.data.success);
                await fetch();
            })
            .catch(async (err) => {
                // console.log(err.response);
                await setErrors((old) => [...old, err.response.data.message]);
            });
    }





    // React.useEffect(() => {
    // }, []);

    return(
      <Fragment>
          <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              key={ep.id}
          >
              <td className="w-4 p-4">{ep.id}</td>
              <td
                  className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
              >
                  {ep.num}
              </td>


              <td className="px-6 py-4 text-center">
                  <button
                      className="font-medium text-slate-400 hover:underline mr-3"
                      onClick={() => setShowSources(!showSources)}
                  >
                      Lecteurs
                  </button>
                  <button
                      className="font-medium text-green-400 hover:underline mr-3"
                      onClick={() => {
                          setNum(ep.num);
                          onOpenCreateSource()
                      }}
                  >
                      Ajouter un Lecteurs
                  </button>
                  <button
                      className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                      onClick={(e) => {
                          e.preventDefault();
                          deleteEpisode(ep.id);
                      }}
                  >
                      Delete
                  </button>
              </td>
          </tr>
          {
              showSources ? (
                  <tr>
                      <td colSpan="3">
                          <EpisodeSourceTable
                              sources={ep.sources}
                              ep={ep}
                              makeToast={makeToast}
                              token={token}
                              hosts={hosts}
                              fetch={fetch}
                          />
                      </td>
                  </tr>
              )
                  : null
          }


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



      </Fragment>
    );
}