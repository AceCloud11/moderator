import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
} from "recharts";
import UserContext from "../../Context/UserContext";
export default function Index() {
  const { role, token } = useContext(UserContext);

  const [dashbaord, setDashbaord] = useState({});

  
  // get the hosts
  const getDashboard = async () => {
    axios({
      url: "/moderator/dashboard",
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        await setDashbaord(res.data);
        // console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  useEffect(() => {
    getDashboard();

    return () => {};
  }, []);

  const data = dashbaord.views
    ? dashbaord.views.map((el) => {
        return {
          short_name: el.title.split(" ")[0],
          name: el.title.split(" ")[0],
          vues: el.views_count,
        };
      })
    : [];

    

  const data2 = dashbaord.favs ? dashbaord.favs.map((el) => {
    return {
      name: el.title.split("-")[0],
      vues: el.total_favourites,
    };
  }): [];

  

  return (
    <>
      <div className="grid grid-cols-1 mt-8 md:mt-0  sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
        {/* Movie Count Card */}
        <div className="bg-green-400 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Films</h3>
          <span className="font-bold text-gray-200">{dashbaord.movies}</span>
        </div>
        {/* End Movie Count */}

        {/* Serie Count Card */}
        <div className="bg-blue-400 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Séries</h3>
          <span className="font-bold text-gray-200">{dashbaord.series}</span>
        </div>
        {/* End Serie Count */}

        {/* Categories Count Card */}
        <div className="bg-indigo-400 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Categories</h3>
          <span className="font-bold text-gray-200">
            {dashbaord.categories}
          </span>
        </div>
        {/* End Categories Count */}

        {/* Episodes Count Card */}
        <div className="bg-orange-400 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Épisodes</h3>
          <span className="font-bold text-gray-200">{dashbaord.episodes}</span>
        </div>
        {/* End Episodes Count */}

        {/* Users Count Card */}
        <div className="bg-purple-400 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Utilisateurs</h3>
          <span className="font-bold text-gray-200">{dashbaord.users}</span>
        </div>
        {/* End Users Count */}

        {/* Users Count Card */}
        <div className="bg-purple-600 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Utilisateurs bannis</h3>
          <span className="font-bold text-gray-200">
            {dashbaord.bannedUsers}
          </span>
        </div>
        {/* End Users Count */}

        {/* Users Count Card */}
        <div className="bg-purple-900 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Utilisateurs premium</h3>
          <span className="font-bold text-gray-200">
            {dashbaord.premiumUsers}
          </span>
        </div>
        {/* End Users Count */}

        {/* Users Actors Card */}
        <div className="bg-sky-400 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Acteurs</h3>
          <span className="font-bold text-gray-200">{dashbaord.actors}</span>
        </div>
        {/* End Actors Count */}

        {/* Users Directeurs Card */}
        <div className="bg-lime-400 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Directeurs</h3>
          <span className="font-bold text-gray-200">{dashbaord.directors}</span>
        </div>
        {/* End Directeurs Count */}

        {/* Users Reports Card */}
        <div className="bg-red-600 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Commentaires signalés</h3>
          <span className="font-bold text-gray-200">
            {dashbaord.reportedComments}
          </span>
        </div>
        {/* Users Reports Card */}
        <div className="bg-red-600 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Films/Séries signalés</h3>
          <span className="font-bold text-gray-200">
            {dashbaord.reportedPosts}
          </span>
        </div>
        {/* Users Reports Card */}
        <div className="bg-red-600 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Reports</h3>
          <span className="font-bold text-gray-200">{dashbaord.reports}</span>
        </div>
        {/* End Reports Count */}
      </div>
      {/* <h1 className="text-2xl font-bold my-8">Top 5 des films les plus vus</h1>
      <section className="space-y-4">
        {dashbaord.views
          ? dashbaord.views.map((el) => (
              <article className="flex justify-between p-2 bg-indigo-400 rounded-md text-white">
                <span>{el.title}</span>
                <span>{el.views_count}</span>
              </article>
            ))
          : null}
      </section> */}

      <section className="grid grid-cols-1 xl:grid-cols-1">
        {/* <div className="bg-white mt-12 overflow-auto no-scrollbar">
          <h1 className="font-bold my-4 text-center text-lg">
            Films les plus favoris
          </h1>
          <BarChart width={730} height={350} data={data} className="bg-white">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Bar dataKey="pv" fill="#8884d8" /> 
            <Bar dataKey="vues" fill="#8884d8" />
          </BarChart>
        </div> */}

        <div className="bg-white mt-12 overflow-auto no-scrollbar">
          <h1 className="font-bold my-4 text-center text-lg">
            Films les plus favoris
          </h1>
          <BarChart width={730} height={350} data={data2} className="bg-white">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Bar dataKey="pv" fill="#8884d8" /> */}
            <Bar dataKey="vues" fill="#8884d8" />
          </BarChart>
        </div>
      </section>
    </>
  );
}
