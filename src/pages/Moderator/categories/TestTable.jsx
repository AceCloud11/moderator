import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import UserContext from "../../../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Error from "../../../components/Error";
import {logoutUnAuthenticatedUsers} from "../../../helpers/helpers";
import Table from '../../../components/Table';

export default function IndexCategories() {
    const data = useContext(UserContext);

    const [cats, setCats] = useState([]);
    const [category, setCategory] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categoryNew, setCategoryNew] = useState("");
    const [errors, setErrors] = useState([]);
    const [fields, setFields] = useState(['id', 'name']);
    const [attr, setAttr] = useState([]);

    const [search, setSearch] = useState('');

    const notify = (text) => toast.success(text);

    const fetchCats = async () => {
        await axios({
            url: "moderator/categories",
            method: "GET",
            responseType: "json",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + data.token,
            },
        })
            .then(async (res) => {
                await setCats(res.data);
                //   console.log(cats);
            })
            .catch((err) => {
                console.error(err);
                logoutUnAuthenticatedUsers(err.response.status);
            });
    };

    const createCategory = async () => {
        axios({
            url: "/moderator/categories",
            method: "post",
            responseType: "json",
            data: {
                name: categoryNew,
                bg: null,
            },
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + data.token,
            },
        })
            .then(async (res) => {
                //   console.log(res.data);
                await setCategoryNew("");
                onCloseCreate();
                setErrors([]);
                fetchCats();
                notify(res.data.message);
            })
            .catch((error) => {
                setErrors((old) => [...old, error.response.data.message]);
            });
    };

    const updateCategory = async () => {
        axios({
            url: "/moderator/categories/" + categoryId,
            method: "put",
            responseType: "json",
            data: {
                name: category,
            },
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + data.token,
            },
        })
            .then(async (res) => {
                //   console.log(res.data);
                await setCategory("");
                await setCategoryId("");
                onCloseEdit();
                setErrors([]);
                fetchCats();
                notify(res.data.message);
            })
            .catch((error) => {
                setErrors((old) => [...old, error.response.data.message]);
            });
    };

    const deleteCategory = async (id) => {
        axios({
            url: "/moderator/categories/" + id,
            method: "delete",
            responseType: "json",
            data: {
                name: category,
            },
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + data.token,
            },
        })
            .then(async (res) => {
                fetchCats();
                notify(res.data.message);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const searchCats = (val) => {
        const filteredCats = cats.filter((el) => el.name.includes(val, 0));
        setCats(filteredCats);

    }

    useEffect(async () => {
        await fetchCats();
        cats.map(async cat => {
            const obj = [cat.id,cat.name]
            await setAttr(old => [...old, obj]);
        })
        return () => {};
    }, []);

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

    return (
        <div className="w-full">
            <ToastContainer />
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="p-4 flex flex-wrap justify-between items-center gap-4 space-y-4">
                    <h1 className="text-center text-xl font-bold">Categories</h1>

                    <div className="flex gap-2">
                        <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex justify-between">
                            <input
                                type="text"
                                className="flex-grow bg-gray-50 focus:outline-none"
                                placeholder="rechercher dans les catégories ..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCats((old) => [
                                        ...old.filter((el) => el.name.includes(e.target.value)),
                                    ]);
                                }}
                                onKeyUp={e => {
                                    if (e.key == "Enter") {
                                        setSearch(e.target.value);
                                        setCats((old) => [
                                            ...old.filter((el) => el.name.includes(e.target.value)),
                                        ]);
                                    }
                                }}
                            />
                            <i
                                className="fa fa-trash text-xl cursor-pointer"
                                title="clear search"
                                onClick={() => {
                                    setSearch("");
                                    fetchCats(1);
                                }}
                            ></i>
                        </div>
                    </div>
                    <button
                        className="block px-4 py-2 rounded-md bg-indigo-600 text-white"
                        onClick={onOpenCreate}
                    >
                        Ajouter un Category
                    </button>
                </div>

            {/*    Table component */}
                <Table fields={fields} data={attr} actions={[]}/>

            </div>

            <Modal
                isOpen={isOpenCreate}
                onClose={() => {
                    onCloseCreate();
                    setCategoryNew("");
                    setErrors([]);
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Créer une nouvelle catégorie</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div>
                            <input
                                type="text"
                                value={categoryNew}
                                onChange={(e) => setCategoryNew(e.target.value)}
                                placeholder="Nom"
                                autoFocus={true}
                                className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                            />
                        </div>
                        <Error errors={errors} />
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => {
                                onCloseCreate();
                                setCategoryNew("");
                                setErrors([]);
                            }}
                        >
                            Fermer
                        </Button>
                        <Button colorScheme="teal" onClick={createCategory}>
                            Créer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenEdit}
                onClose={() => {
                    onCloseEdit();
                    setCategory("");
                    setErrors([]);
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Mettre à jour la catégorie</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Nom"
                                autoFocus={true}
                                className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                            />
                        </div>
                        <Error errors={errors} />
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => {
                                onCloseEdit();
                                setCategory("");
                                setErrors([]);
                            }}
                        >
                            Fermer
                        </Button>
                        <Button colorScheme="teal" onClick={updateCategory}>
                            Modifier
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
