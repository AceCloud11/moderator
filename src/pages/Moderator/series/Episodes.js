import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import UserContext from "../../../Context/UserContext";
import {ToastContainer, toast} from "react-toastify";
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
import {addSources, deleteSources, updateSources, validateDomain} from "../../../helpers/helpers";
import Error from "../../../components/Error";

export default function Episodes() {
    const {token} = useContext(UserContext);

    const [episodes, setEpisodes] = useState([]);
    const [title, setTitle] = useState("");
    const [errors, setErrors] = useState([]);
    const [vf, setVf] = useState(true);
    const [num, setNum] = useState("");
    const [src, setSrc] = useState("");
    const [name, setName] = useState("");
    const [hosts, setHosts] = useState([]);
    const [childErr, setChildErr] = useState([]);


    let {serieId} = useParams();

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
                setHosts(res.data);

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
    const createEpisodeSource = async (arr, num) => {
        await axios({
            url: "/moderator/episodes/" + serieId,
            method: "post",
            data: {
                num,
                sources: arr,
            },
            responseType: "json",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                // console.log(res.data);
                if (res.data.error) {
                    setErrors((old) => [...old, res.data.error]);
                    setChildErr(old => [...old, res.data.error])
                } else {
                    setErrors([]);
                    setSrc("");
                    setNum("");
                    setVf(false);
                    makeToast('success', res.data.success);

                    onCloseCreateSource();
                    fetchEpisodes();

                }
            })
            .catch((err) => {
                // console.log(err.response);
                setErrors((old) => [...old, err.response.data.message]);
                setChildErr(old => [...old, err.response.data.message])
            });
        return childErr;
    }


    const makeToast = (type, text) => {
        if (type === 'success') {
            toast.success(text);
        } else {
            toast.error(text);
        }

    }

    const handleAdd = async (e, src, num, vf) => {
        e.preventDefault();
        setErrors([]);
        setChildErr([]);
        let sepeatedSources = src.split('\n');
        let arr = validateDomain(sepeatedSources, hosts, vf);
        if (arr[0].length) {
            setErrors(arr[0]);
            return arr[0];
        } else {
            return createEpisodeSource(arr[1], num);
            // return childErr;
        }
    }





    useEffect(async () => {
        await fetchEpisodes();
        //   setEps(fillNumbers());
        await getHosts();
        //   // console.log(eps);
        //
        return () => {
        };
    }, []);

    return (
        <div className="w-full">
            <ToastContainer/>
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
                                handleAdd={handleAdd}
                                clearErrors={() => {
                                    setChildErr([]);
                                }}
                            />
                        ))
                        : null}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isOpenCreateSource}
                onClose={() => {
                    onCloseCreateSource();
                    setSrc("");
                    setNum("");
                    setName('');
                    setErrors([]);
                    setVf(false);
                }}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Nouvel épisode</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <div>
                            <form action="" className="space-y-4">
                                <div className="flex gap-4">
                                    <input
                                        type="number"
                                        placeholder="Numéro d'épisode"
                                        className="w-full p-2 rounded-md border focus:outline-none focus:border-purple-400 border-gray-300"
                                        value={num}
                                        onChange={(e) => setNum(e.target.value)}
                                    />
                                </div>
                                <textarea
                                    rows="10"
                                    className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:border-purple-400"
                                    value={src}
                                    onChange={e => {
                                        setSrc(e.target.value)
                                    }}
                                ></textarea>
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

                                <Error errors={errors}></Error>
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
                        <Button colorScheme="linkedin" onClick={(e) => handleAdd(e, src, num, vf)}>
                            Ajouter
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
