import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
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
import UserContext from '../../Context/UserContext';
export default function Index() {

   
  const { role, token } = useContext(UserContext);

  const [dashbaord, setDashbaord] = useState({});

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
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDashboard();

    return () => {};
  }, []);

  const data = [
    {
      name: "Janvier",
      vues: 4000,
    },
    {
      name: "Février",
      vues: 3000,
    },
    {
      name: "Mars",
      vues: 500,
    },
    {
      name: "Avril",
      vues: 1200,
    },
    {
      name: "Mai",
      vues: 5600,
    },
    {
      name: "Juin",
      vues: 9000,
    },
    {
      name: "Juillet",
      vues: 400,
    },
    {
      name: "Août",
      vues: 4090,
    },
    {
      name: "September",
      vues: 8000,
    },
    {
      name: "Octobre",
      vues: 4000,
    },
    {
      name: "Novembre",
      vues: 4000,
    },
    {
      name: "Décembre",
      vues: 4000,
    },
  ];

  const data2 = [
    {
      name: "Movie 1",
      vues: 4000,
    },
    {
      name: "Movie 2",
      vues: 3000,
    },
    {
      name: "Movie 3",
      vues: 500,
    },
    {
      name: "Movie 4",
      vues: 1200,
    },
  ];

  const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];
  const data02 = [
    { name: "A1", value: 100 },
    { name: "A2", value: 300 },
    { name: "B1", value: 100 },
    { name: "B2", value: 80 },
    { name: "B3", value: 40 },
    { name: "B4", value: 30 },
    { name: "B5", value: 50 },
    { name: "C1", value: 100 },
    { name: "C2", value: 200 },
    { name: "D1", value: 150 },
    { name: "D2", value: 50 },
  ];


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
          <span className="font-bold text-gray-200">{dashbaord.bannedUsers}</span>
        </div>
        {/* End Users Count */}

        {/* Users Count Card */}
        <div className="bg-purple-900 text-white p-4 rounded-md shadow-md flex justify-between">
          <h3 className="font-semibold">Utilisateurs premium</h3>
          <span className="font-bold text-gray-200">{dashbaord.premiumUsers}</span>
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

      <section className="grid grid-cols-1 xl:grid-cols-2">
        <div className="bg-white mt-12 overflow-auto no-scrollbar">
          <h1 className="font-bold my-4 text-center text-lg">Vues par mois</h1>
          <BarChart width={730} height={350} data={data} className="bg-white">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Bar dataKey="pv" fill="#8884d8" /> */}
            <Bar dataKey="vues" fill="#82ca9d" />
          </BarChart>
        </div>

        <div className="bg-white mt-12 overflow-auto no-scrollbar">
          <h1 className="font-bold my-4 text-center text-lg">
            Films les plus regardés
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

        <div className="bg-white mt-12 overflow-auto no-scrollbar">
          <h1 className="font-bold my-4 text-center text-lg">
            Films les plus regardés
          </h1>
          <PieChart width={730} height={400}>
            <Pie
              data={data01}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
            />
            <Pie
              data={data02}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#82ca9d"
              label
            />
          </PieChart>
        </div>
      </section>
    </>
  );
}
