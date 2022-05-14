import React, { useEffect, useState } from "react";
import "./css/home.scss";
import axios from "axios";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Movies from "./Movies";
import LeftMenu from "../components/LeftMenu";
import Series from "./Series";
import Actor from "./Actor";
import Category from "./Category";
import Filter from "../components/Filter";
import Home from "./Home";
import Search from "./Search";
import Banner from "../components/Banner";

export default function HomePage({ menuState }) {
  const [slides, setSlides] = useState([]);
  const [search, setSearch] = useState("");
  const [banners, setBanners] = useState([]);

  const { path, url } = useRouteMatch();

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
    axios
      .get("http://192.168.3.7:8001/api/posts/slider")
      .then((res) => {
        let data = res.data;
        // data.map((el) => {
        //   el.img = "https://wiflix.biz/wfimages/" + el.img;
        // });
        setSlides(data);
      })
      .catch((err) => {
        console.error(err);
      });

      fetchBanners();

    return () => {
      setSlides([]);
    };
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleclick = (e) => {
    if (search === "") {
      return;
    }
    window.location.href = "/search?q=" + search;
  };

  return (
    <div className="">
      <main className="text-white">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={10}
          // slidesPerView={5}
          navigation
          pagination={{ clickable: true }}
          onSlideChange={() => console.log()}
          onSwiper={(swiper) => console.log()}
          breakpoints={{
            640: {
              width: 640,
              slidesPerView: 1,
            },
            760: {
              width: 760,
              slidesPerView: 2,
            },
          }}
        >
          {slides.map((slide) => (
            <SwiperSlide style={{ height: 400 }} key={slide.id}>
              <a
                href={
                  slide.type == "movie"
                    ? `/movie/${slide.id}/${slide.slug}`
                    : `/serie/${slide.id}/${slide.slug}`
                }
                className="absolute top-0 left-0 w-full h-full"
              >
                <img
                  src={slide.img}
                  alt=""
                  className="w-full h-full rounded-md"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        {
          banners.length ? <Banner /> : null
        }

        <Filter
          search={search}
          setSearch={handleSearch}
          handleClick={handleclick}
        />

        <section className="container mx-auto my-8">
          <Switch>
            <Route path="/series">
              <Series />
            </Route>
            <Route path="/movies">
              <Movies />
            </Route>
            <Route path="/search">
              <Search />
            </Route>
            <Route path={`/actor/:id/:name`}>
              <Actor />
            </Route>
            <Route path={`/categories/:id/:name`}>
              <Category />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </section>
      </main>
    </div>
  );
}
