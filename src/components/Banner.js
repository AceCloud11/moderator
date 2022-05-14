import axios from "axios";
import React, { useState, useEffect } from "react";

export default function Banner() {
  const [banners, setBanners] = useState([]);

  const fetchBanners = () => {
    axios({
      url: "/banners",
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Authorization: "Bearer " + this.state.token,
      },
    })
      .then(async (res) => {
        await setBanners(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchBanners();
    return () => {};
  }, []);

  return (
    <div
      style={{
        margin: "1rem 0",
        padding: 10,
        backgroundColor: "rgba(48, 54, 90, 0.643)",
      }}
      className="rounded-md"
    >
      <marquee
        behavior="scroll"
        id="mar"
        direction="left"
        onMouseOver={() => document.getElementById("mar").stop()}
        onMouseOut={() => document.getElementById("mar").start()}
      >
        <div className="flex">
          {banners.length
            ? banners.map((banner) => (
                <p className="mr-96" key={banner.id}>
                  <span>{banner.text + "  "} </span>
                  {banner.url ? (
                    <a
                      href={banner.url}
                      className="text-blue-300"
                      target="_blank"
                    >
                      link
                    </a>
                  ) : null}
                </p>
              ))
            : null}
        </div>
      </marquee>
    </div>
  );
}
