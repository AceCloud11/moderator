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

export default function IndexCategories() {
  const data = useContext(UserContext);

  const [cats, setCats] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryNew, setCategoryNew] = useState("");
  const [errors, setErrors] = useState([]);
  const [first, setFirst] = useState(false);

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
        is_first: first,
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
        setFirst(false);
        await fetchCats();
        notify(res.data.success);
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
        is_first: first
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
        setFirst(false);
        await fetchCats();
        notify(res.data.success);
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
        await fetchCats();
        notify(res.data.success);
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
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>

              <th scope="col" className="px-6 py-3">
                Nom du category
              </th>

              <th scope="col" className="px-6 py-3">
                Afficher En Premier
              </th>

              <th scope="col" className="px-6 py-3 text-center">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {cats.length
              ? cats.map((cat) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={cat.id}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap "
                    >
                      {cat.id}
                    </th>

                    <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap capitalize"
                    >
                      {cat.name}
                    </th>

                    <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {cat.is_first == 1 ? "Oui" : "Non"}
                    </th>

                    <td className="px-6 py-4 text-center">
                      <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={() => {
                          setCategory(cat.name);
                          setCategoryId(cat.id);
                          setFirst(cat.is_first == 1 ? true : false);
                          onOpenEdit();
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={() => {
                          deleteCategory(cat.id);
                        }}
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
            <label className="label cursor-pointer space-x-2 flex items-center justify-start mt-4">
              <input
                  type="checkbox"
                  checked={first}
                  value={first}
                  className="checkbox"
                  onChange={e => {
                    setFirst(e.target.checked);
                  }}
              />
              <span className="label-text">Afficher En Premier</span>
            </label>
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
            <label className="label cursor-pointer space-x-2 flex items-center justify-start mt-4">
              <input
                  type="checkbox"
                  checked={first}
                  value={first}
                  className="checkbox"
                  onChange={e => {
                    setFirst(e.target.checked);
                  }}
              />
              <span className="label-text">Afficher En Premier</span>
            </label>
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
