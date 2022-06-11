import React, {Fragment} from "react";
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

export default function SourceTableRow( { source, token, hosts, fetch, makeToast }){

    const [vf, setVf] = React.useState(false);
    const [name, setName] = React.useState("");
    const [src, setSrc] = React.useState("");
    const [errors, setErrors] = React.useState([]);
    const [sourceId, setSourceId] = React.useState(null);

    const {
        isOpen: isOpenEditSource,
        onOpen: onOpenEditSource,
        onClose: onCloseEditSource,
    } = useDisclosure();

    //update source
    const updateEpisodeSource = async () => {
        if (src.includes("http://") || src.includes("https://")) {
            let n = src.split("//")[1].split("/")[0];
            if (!hosts.includes(n)) {
                await setErrors((old) => [...old, `la source ${n} n'est pas autorisée`]);
                return;
            }
            const data = {
                vf: vf,
                src: src,
                name: name
            };
            setErrors([]);
            await axios({
                url: "/moderator/movie-sources/" + sourceId,
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
                    } else if (res.data.message) {
                        await setErrors((old) => [...old, res.data.message]);
                    } else {
                        setErrors([]);
                        setSrc("");
                        setName('');
                        setSourceId(null);
                        setVf(false);
                        makeToast('success', res.data.success);
                        onCloseEditSource();
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

    //delete source
    const deleteEpisodeSource = async (id) => {
            await axios({
                url: "/moderator/movie-sources/" + id,
                method: "delete",
                responseType: "json",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then(async function (res) {
                    setSourceId(null);
                    makeToast('success', res.data.success);
                    fetch()
                })
                .catch(async (err) => {
                    // console.log(err.response);
                    await setErrors((old) => [...old, err.response.data.message]);
                });

    }
    return (
        <Fragment>
        <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            key={source.id}
        >
            <td className="w-4 p-4">{source.id}</td>
            <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
            >
                {source.name}
            </td>


            <td className="w-4 p-4 text-gray-900">{source.src}</td>

            <td className="w-4 p-4 text-gray-900">
                {source.vf == 1 ? "VF" : "VOSTFR"}
            </td>

            <td className="px-6 py-4 text-center">
                <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                    onClick={(e) => {
                        e.preventDefault();
                        setSrc(source.src);
                        setName(source.name)
                        setSourceId(source.id);
                        setErrors([]);
                        if (source.vf == 1) {
                            setVf(true);
                        }else {
                            setVf(false)
                        }
                        onOpenEditSource();
                    }}
                >
                    Éditer
                </button>
                <button
                    className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                    onClick={(e) => {
                        e.preventDefault();
                        deleteEpisodeSource(source.id);
                    }}
                >
                    Effacer
                </button>
            </td>
        </tr>

            {/*    edit source modal */}
            <Modal
                isOpen={isOpenEditSource}
                onClose={ () => {
                    onCloseEditSource();
                    setSrc("");
                    setName('');
                    setErrors([]);
                    setVf(false);
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modifier</ModalHeader>
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
                                onCloseEditSource();
                                setSrc("");
                                setName('');
                                setErrors([]);
                                setVf(false);
                            }}
                        >
                            Close
                        </Button>
                        <Button colorScheme="linkedin" onClick={updateEpisodeSource}>
                            Modifier
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Fragment>
    )
}