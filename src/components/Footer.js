import React from "react";
import "./css/nav.scss";

export default function Footer() {
  return (
    <footer
      style={{
        position: "absolute",
        bottom: "-250px",
        width: "100%",
        height: "250px",
        zIndex: 1000,
        backgroundColor: "#1b2142",
      }}
      className="flex flex-col gap-4 items-center justify-center py-4 px-4  md:px-24"
    >
      <div className="flex justify-around w-full mt-4">
        <div>
          <h3 className="font-bold text-lg my-4 text-gray-200">Liens utiles</h3>
          <ul className="space-y-4">
            <li>
              <a href="/report" className="text-white">
                Signaler un problème
              </a>
            </li>
            {/* <li>
              <a href="" className="text-white">
                Link
              </a>
            </li>
            <li>
              <a href="" className="text-white">
                Link
              </a> 
            </li>*/}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg my-4 text-gray-200">Suivez nous</h3>
          <ul className="space-y-4">
            <li>
              <a
                href="https://www.facebook.com/groups/271782331082443/"
                target="_blank"
                className="text-white"
              >
                <i className="fa-brands fa-facebook"></i>
                {"  "} Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/wiflix2021"
                target="_blank"
                className="text-white"
              >
                <i className="fa-brands fa-twitter"></i>
                {"  "} Twitter
              </a>
            </li>
            {/* <li>
              <a href="" className="text-white">
                <i className="fa-brands fa-youtube"></i>
                {"  "} Youtube
              </a>
            </li> */}
          </ul>
        </div>
      </div>

      <p className="text-gray-300 text-md pb-4">
        Tous les droits sont réservés{" "}
        <a href="" className="text-blue-500">
          Wiflix
        </a>
      </p>
    </footer>
  );
}
