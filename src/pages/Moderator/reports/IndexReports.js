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
  Stack,
  RadioGroup,
  Radio,
  useToast,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import UserContext from "../../../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../../../components/Pagination";
import {logoutUnAuthenticatedUsers} from "../../../helpers/helpers";

export default function IndexReports() {
  const data = useContext(UserContext);

  const [reports, setReports] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState("general");
  const [report, setReport] = useState("");
  const [conetent, setContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);


  const { token } = useContext(UserContext);
  // const toast = useToast();



  const fetchReportsGeneral = async (page) => {
    if (page !== 1) {
      window.location.search = "page=" + page;
    }
    let pg = new URLSearchParams(window.location.search).get("page") || 1;

    await axios({
      url: "/moderator/reports?page=" + pg,
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
        await setReports(res.data.data);
        await setLastPage(res.data.last_page);
        await setCurrentPage(res.data.current_page);
      })
      .catch((err) => {
        console.error(err);
        logoutUnAuthenticatedUsers(err.response.status);
      });
  };

  const fetchReportsComments = async (page) => {
    if (page !== 1) {
      window.location.search = "page=" + page;
    }
    let pg = new URLSearchParams(window.location.search).get("page") || 1;

    await axios({
      url: "/moderator/reports/comments?page=" + pg,
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
        await setComments(res.data.data);
        await setLastPage(res.data.last_page);
        await setCurrentPage(res.data.current_page);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchReportsPosts = async (page) => {
    if (page !== 1) {
      window.location.search = "page=" + page;
    }
    let pg = new URLSearchParams(window.location.search).get("page") || 1;

    await axios({
      url: "/moderator/reports/posts?page=" + pg,
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
        await setPosts(res.data.data);
        await setLastPage(res.data.last_page);
        await setCurrentPage(res.data.current_page);
  
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteReport = async (reportId, type) => {
    let url = '';
    if (type == 'general') {
      url = "/moderator/reports/" + reportId;
    }else if (type == 'comment'){
      url = "/moderator/reports/comments/" + reportId;
    }else if (type == 'post'){
      url = "/moderator/reports/posts/" + reportId;
    }
    await axios({
      url,
      method: "DELETE",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
    .then(async (res) => {
      await fetchReportsGeneral(1);
      await fetchReportsPosts(1);
      await fetchReportsComments(1);
      toast.success(res.data.success);
      })
      .catch((err) => {
        console.error(err);
      });
  };


  

  useEffect(async () => {
    await fetchReportsGeneral(1);
    await fetchReportsPosts(1);
    await fetchReportsComments(1);

  
    return () => {};
  }, [type]);

  // const { isOpenCreate, onOpenCreate, onCloseCreate } = useDisclosure();
  // const { isOpenEedit, onOpenEedit, onCloseEedit } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Tabs>
      <ToastContainer />
      <TabList>
        <Tab>Rapports généraux</Tab>
        <Tab>Commentaires Rapports</Tab>
        <Tab>Rapports de Films </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <div className="w-full">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div className="p-4 flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-center text-xl font-bold hidden md:block">
                  Rapports généraux
                </h1>
              </div>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                   
                    <th scope="col" className="px-6 py-3">
                      Texte du rapport
                    </th>

                    <th scope="col" className="px-6 py-3 text-center">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length
                    ? reports.map((rep) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          key={rep.id}
                        >
                          
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 dark:text-white"
                          >
                            {rep.text}
                          </th>

                          <td className="px-6 py-4 text-center">
                            <button
                              className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                              onClick={async () => {
                                // await setReportId(rep.id);
                                deleteReport(rep.id, "general");
                              }}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
                {lastPage > 1 ? (
                  <tfoot>
                    <tr>
                      <th colSpan="4">
                        <Pagination
                          currentPage={currentPage}
                          lastPage={lastPage}
                          handleClick={fetchReportsGeneral}
                        />
                      </th>
                    </tr>
                  </tfoot>
                ) : null}
              </table>
            </div>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Report Text</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <p>{report}</p>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  {/* <Button colorScheme="teal" onClick={createCategory}>
              Create
            </Button> */}
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="w-full">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div className="p-4 flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-center text-xl font-bold hidden md:block">
                  Commentaires Rapports
                </h1>
              </div>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                   
                    <th scope="col" className="px-6 py-3">
                      texte du rapport
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Identifiant du commentaire
                    </th>

                    <th scope="col" className="px-6 py-3 text-center">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comments.length
                    ? comments.map((com) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          key={com.id}
                        >
                         
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 dark:text-white"
                            // dangerouslySetInnerHTML={{ __html: com.comment.text }}
                          >
                            {com.text}
                          </th>
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 dark:text-white"
                            // dangerouslySetInnerHTML={{ __html: com.comment.text }}
                          >
                            {com.comment_id}
                          </th>

                          <td className="px-6 py-4 text-center">
                            {/* <button
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                              onClick={() => {
                                setReport(com.text);
                                onOpen();
                              }}
                            >
                              Show
                            </button> */}
                            <button
                              className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                              onClick={async () => {
                                // await setReportId(rep.id);
                                deleteReport(com.id, "comment");
                              }}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
                {lastPage > 1 ? (
                  <tfoot>
                    <tr>
                      <th colSpan="4">
                        <Pagination
                          currentPage={currentPage}
                          lastPage={lastPage}
                          handleClick={fetchReportsComments}
                        />
                      </th>
                    </tr>
                  </tfoot>
                ) : null}
              </table>
            </div>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Rapport</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <p>{report}</p>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  {/* <Button colorScheme="teal" onClick={createCategory}>
              Create
            </Button> */}
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="w-full">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div className="p-4 flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-center text-xl font-bold hidden md:block">
                  Films Reportages
                </h1>
              </div>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                   
                    <th scope="col" className="px-6 py-3">
                      Texte du rapport
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Identifiant de publication
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Type de publication
                    </th>

                    <th scope="col" className="px-6 py-3 text-center">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.length
                    ? posts.map((post) => (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          key={post.id}
                        >
                          
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 dark:text-white"
                          >
                            {post.text}
                          </th>

                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 dark:text-white"
                          >
                            {post.post_id}
                          </th>

                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 dark:text-white"
                          >
                            {post.type}
                          </th>
                          <td className="px-6 py-4 text-center">
                            {/* <button
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                              onClick={() => {
                                setReport(post.text);
                                onOpen();
                              }}
                            >
                              Show
                            </button> */}
                            <button
                              className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                              onClick={async () => {
                                // await setReportId(rep.id);
                                deleteReport(post.id, "post");
                              }}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
                {lastPage > 1 ? (
                  <tfoot>
                    <tr>
                      <th colSpan="4">
                        <Pagination
                          currentPage={currentPage}
                          lastPage={lastPage}
                          handleClick={fetchReportsPosts}
                        />
                      </th>
                    </tr>
                  </tfoot>
                ) : null}
              </table>
            </div>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Texte du rapport</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <p>{report}</p>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Fermer
                  </Button>
                  {/* <Button colorScheme="teal" onClick={createCategory}>
              Create
            </Button> */}
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
