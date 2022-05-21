import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function IndexSlider() {
  const data = useContext(UserContext);

  const [slides, setSlides] = useState([]);

  const notify = (text) => toast.success(text);

  const fetchSlides = async () => {
    await axios({
      url: "moderator/posts/slider",
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + data.token,
      },
    })
      .then(async (res) => {
        console.log(res.data);
        setSlides(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };


  const deleteSlide = async (id) => {
   await axios({
     url: "/moderator/featured/" + id,
     method: "delete",
     responseType: "json",
     headers: {
       "Content-Type": "application/json",
       Accept: "application/json",
       Authorization: "Bearer " + data.token,
     },
   })
     .then(async (response) => {
       //  await this.fetchMovies(1);
       if (response.data.message) {
         fetchSlides();
         toast.success(response.data.message);
       } else {
         toast.error(response.data.error);
       }
     })
     .catch((error) => {
       console.log(error);
     });
  };

  useEffect(async () => {
    await fetchSlides();

    return () => {};
  }, []);


  return (
    <div className="w-full">
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="p-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-center text-xl font-bold hidden md:block">
            En vedette
          </h1>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
             
              <th scope="col" className="px-6 py-3">
                Nom du Film / Serie
              </th>

              <th scope="col" className="px-6 py-3">
                Type
              </th>

              <th scope="col" className="px-6 py-3 text-center">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {slides.length
              ? slides.map((slide) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={slide.id}
                  >
                    
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {slide.title}
                    </th>

                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white "
                    >
                      {slide.type}
                    </th>

                    <td className="px-6 py-4 text-center">
                      <button
                        className="font-medium text-red-600 dark:text-blue-500 hover:underline mr-3"
                        onClick={() => {
                          deleteSlide(slide.id);
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
    </div>
  );
}
