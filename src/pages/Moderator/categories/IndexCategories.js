import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure
} from "@chakra-ui/react";
import UserContext from '../../../Context/UserContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function IndexCategories() {
    const data = useContext(UserContext);

    

    const [cats, setCats] = useState([]);
    const [category, setCategory] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categoryNew, setCategoryNew] = useState('');

    const notify = (text) => toast.success(text);

    const fetchCats = async () => {
      await axios({
        url: "/categories",
        method: "GET",
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Authorization: "Bearer " + this.state.token,
        },
      })
        .then(async (res) => {
          await setCats(res.data)
        //   console.log(cats);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    const createCategory = async () => {
        axios({
          url: '/moderator/categories',
          method: "post",
          responseType: "json",
          data: {
              'name': categoryNew
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + data.token,
          },
        })
          .then(async (res) => {
            //   console.log(res.data);
            await setCategoryNew('');
            onCloseCreate();
            fetchCats();
            notify(res.data.message);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    const updateCategory = async () => {
        axios({
          url: '/moderator/categories/' + categoryId,
          method: "put",
          responseType: "json",
          data: {
              'name': category
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + data.token,
          },
        })
          .then(async (res) => {
            //   console.log(res.data);
            await setCategory('');
            await setCategoryId('');
            onCloseEdit();
            fetchCats();
            notify(res.data.message);
          })
          .catch((error) => {
            console.log(error);
          });
    }

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

  
    useEffect( async () => {
      await fetchCats();
    
      return () => {
        
      }
    }, [])

    // const { isOpenCreate, onOpenCreate, onCloseCreate } = useDisclosure();
    // const { isOpenEedit, onOpenEedit, onCloseEedit } = useDisclosure();
    const { isOpen:isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
    const { isOpen:isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
    
  return (
    <div className="w-full">
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="p-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-center text-xl font-bold hidden md:block">
            Categories
          </h1>

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
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Nom du category
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
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {cat.name}
                    </th>

                    <td className="px-6 py-4 text-center">
                      <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={() => {
                          setCategory(cat.name);
                          setCategoryId(cat.id);
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

      <Modal isOpen={isOpenCreate} onClose={onCloseCreate}>
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
                className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseCreate}>
              Fermer
            </Button>
            <Button colorScheme="teal" onClick={createCategory}>
              Créer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
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
                className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseEdit}>
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
