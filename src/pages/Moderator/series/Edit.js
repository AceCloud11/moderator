import {Alert, AlertIcon} from "@chakra-ui/alert";
import axios from "axios";
import React, {Component} from "react";
import {act} from "react-dom/test-utils";
import {withRouter} from "react-router-dom";
import UserContext from "../../../Context/UserContext";

class Edit extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            name: "",
            imdb: "",
            page: 1,
            totalPages: 1,
            duration: "",
            year: "",
            overview: "",
            title: "",
            image: "",
            language: "",
            origin: "",
            quality: "",
            tags: "",
            categoriesM: [],
            categories: [],
            cats: [],
            actorsM: [],
            actors: [],
            actor: "",
            season: null,
            directorsM: [],
            directors: [],
            director: "",
            errors: [],
            token: "",
            first: false,
            allowComments: false,
            approved: false,
            isLocal: false,
            file: null,
        };
    }

    sendImage = async () => {
        await this.setState({
            errors: [],
        });

        const fd = new FormData();
        if (this.state.file) {
            fd.append('image', this.state.file);
        }


        await axios({
            url: "/moderator/posts/image",
            method: "post",
            data: fd,
            responseType: "json",
            headers: {
                Authorization: `Bearer ${this.state.token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then(res => {

            if (res.data.img !== '') {
                this.setState({
                    image: res.data.img,
                }, () => {
                    this.handleSubmit()
                })
            }
        })
            .catch(err => {
                this.setState({
                    errors: [...this.state.errors, err.response.data.message],
                });
            })
    }

    fetchCats = async () => {
        axios({
            url: "categories",
            method: "GET",
            responseType: "json",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // Authorization: "Bearer " + this.state.token,
            },
        })
            .then(async (res) => {
                await this.setState({
                    cats: res.data,
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    handleSubmit = async () => {
        // e.preventDefault();
        const id = this.props.match.params.id;
        const data = {
            title: this.state.title,
            duration: this.state.duration,
            origin: this.state.origin,
            year: this.state.year,
            img: this.state.image,
            actors: this.state.actors,
            categories: this.state.categories,
            directors: this.state.directors,
            description: this.state.overview,
            quality: this.state.quality,
            lang: this.state.language,
            season: this.state.season,
            allow_comments: this.state.allowComments ? 1 : 0,
            is_first: this.state.first ? 1 : 0,
            is_approved: this.state.approved,
            tags: this.state.tags,
            type: "serie",
            latest_ep: this.state.latest_ep
        };
        // console.log(data);
        // return null;

        await this.setState({
            errors: [],
        });

        await axios({
            url: "/moderator/posts/" + id,
            method: "put",
            data,
            responseType: "json",
            headers: {
                Authorization: `Bearer ${this.state.token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then(async (res) => {
                // console.log(res.data);
                await this.setState({
                    errors: [],
                    duration: "",
                    year: "",
                    overview: "",
                    title: "",
                    image: "",
                    language: "",
                    origin: "",
                    quality: "",
                    tags: [],
                    categoriesM: [],
                    categories: [],
                    actorsM: [],
                    directorsM: [],
                    actors: [],
                    directors: [],
                    sources: [],
                    source: "",
                    latest_ep: '',
                    first: false,
                    allowComments: false,
                    approved: false,
                });

                window.location.href = "/moderator/series";
            })
            .catch(async (err) => {
                // console.log(err.response);
                await this.setState({
                    errors: [...this.state.errors, err.response.data.message],
                });
            });
    };

    fetchSerie = async () => {
        const id = this.props.match.params.id;
        let url = "/moderator/posts/" + id;
        axios({
            url,
            method: "GET",
            responseType: "json",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + this.state.token,
            },
        })
            .then(async (res) => {
                // console.log(res.data);
                res.data.actors.map((ac) => {
                    ac.checked = true;
                });
                res.data.directors.map((ac) => {
                    ac.checked = true;
                });
                let catsM = res.data.categories.map(el => el.id);
                let changedCats = [];
                this.state.cats.forEach(cat => {
                    if (catsM.includes(cat.id)) {
                        cat.checked = true;
                    } else {
                        cat.checked = false;
                    }
                    changedCats.push(cat);
                });
                this.setState({
                    cats: changedCats,
                });
                // console.table(res.data.categories)
                await this.setState({
                    title: res.data.title,
                    duration: res.data.duration,
                    language: res.data.lang,
                    origin: this.state.origin,
                    quality: res.data.quality,
                    actorsM: res.data.actors,
                    actors: res.data.actors.map((actor) => actor.name),
                    directors: res.data.directors.map((dir) => dir.name),
                    categories: res.data.categories.map((cat) => cat.id),
                    directorsM: res.data.directors,
                    // categoriesM: res.data.categories,
                    year: res.data.year,
                    overview: res.data.description,
                    image: res.data.img,
                    tags: res.data.tags,
                    season: res.data.season,
                    latest_ep: res.data.latest_ep,
                    allowComments: res.data.allow_comments,
                    first: res.data.is_first,
                    approved: res.data.is_approved
                });
                // console.log(this.state.categories);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // handleSubmit = async () => {
    //   console.log(this.state);
    // };

    componentDidMount() {
        const {token} = this.context;

        this.setState(
            {
                token: token,
            },
            async () => {
                await this.fetchSerie();
                await this.fetchCats();
            }
        );
    }

    render() {
        return (
            <div>
                <h1 className="text-2xl font-bold my-12 text-center">Modifier</h1>

                <form action="" className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Movie Title"
                            className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                            value={this.state.title}
                            onChange={(e) => this.setState({title: e.target.value})}
                        />
                    </div>

                    <fieldset className="border-2 border-gray-300 rounded-md p-4">
                        <legend className="text-xl font-semibold">Actions</legend>

                        <article className="flex flex-wrap gap-4">
                            {/*  is first */}
                            <label className="label cursor-pointer space-x-2">
                                <span className="label-text">Afficher En Premier</span>
                                <input
                                    type="checkbox"
                                    checked={this.state.first}
                                    value={this.state.first}
                                    className="checkbox"
                                    onChange={e => {
                                        this.setState({first: e.target.checked});
                                    }}
                                />
                            </label>

                            {/*  approved */}
                            <label className="label cursor-pointer space-x-2">
                                <span className="label-text">Autoriser les commentaires</span>
                                <input
                                    type="checkbox"
                                    checked={this.state.allowComments}
                                    value={this.state.allowComments}
                                    className="checkbox"
                                    onChange={e => {
                                        this.setState({allowComments: e.target.checked});
                                    }}
                                />
                            </label>
                        </article>
                    </fieldset>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Langue"
                            className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                            value={this.state.language}
                            onChange={(e) => this.setState({language: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Quality"
                            className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                            value={this.state.quality}
                            onChange={(e) => this.setState({quality: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-4 flex-wrap">
            <textarea
                name=""
                id=""
                rows="10"
                className="p-2 rounded-md border-2 focus:outline-none border-gray-300 flex-grow"
                placeholder="description"
                value={this.state.overview}
                onChange={(e) => this.setState({overview: e.target.value})}
            ></textarea>

                        <div className="relative">
                            <img
                                alt=""
                                width="400"
                                id="poster"
                                style={{maxHeight: 400}}
                                className="block"
                                src={this.state.image}
                            />
                            <i className="fa fa-edit absolute top-3 text-xl text-white right-4 cursor-pointer"
                               onClick={() => {
                                   this.setState({
                                       isLocal: true,
                                   })
                               }}></i>
                        </div>
                    </div>

                    {
                        this.state.isLocal ? (
                                <div>

                                    <h1 className="text-xl font-bold mb-4">Modifier l'image</h1>
                                    <div className="grid grid-cols-1 gap-4">
                                        <input
                                            type="file"
                                            className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300 flex-1"
                                            name='file'
                                            onChange={(e) => {
                                                this.setState({
                                                    file: e.target.files[0]
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                            : null
                    }


                    <fieldset className="border-2 border-gray-300 rounded-md p-4 space-y-4">
                        <legend className="text-xl font-semibold">
                            Acteurs & Directeurs
                        </legend>
                        <h1 className="text-xl font-bold">Acteurs</h1>

                        <article className="flex gap-4 flex-wrap">
                            {this.state.actorsM.length
                                ? this.state.actorsM.map((actor) => (
                                    <div
                                        className="form-control  border border-gray-300 rounded-md"
                                        key={actor}
                                    >
                                        <label className="label cursor-pointer space-x-2">
                                            <span className="label-text">{actor.name}</span>
                                            <input
                                                type="checkbox"
                                                value={actor.id}
                                                checked={actor.checked}
                                                onChange={(e) => {
                                                    if (!this.state.actors.includes(actor.name)) {
                                                        this.setState({
                                                            actors: [...this.state.actors, actor.name],
                                                        });
                                                        actor.checked = true;
                                                    } else {
                                                        this.setState({
                                                            actors: this.state.actors.filter(
                                                                (act) => act != actor.name
                                                            ),
                                                        });
                                                        actor.checked = false;
                                                    }
                                                }}
                                                className="checkbox"
                                            />
                                        </label>
                                    </div>
                                ))
                                : null}
                        </article>

                        {/* ADD ACTOR */}

                        <fieldset className="border-2 border-gray-300 rounded-md p-4">
                            <legend className="text-xl font-semibold">Ajouter Acteur</legend>
                            <article className="flex gap-4 flex-wrap">
                                <input
                                    type="text"
                                    placeholder="actor name"
                                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                                    value={this.state.actor}
                                    onChange={(e) => this.setState({actor: e.target.value})}
                                />
                                <button
                                    className="p-2 rounded-md bg-blue-500 text-white font-bold"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (
                                            !this.state.actors.includes(this.state.actor) &&
                                            this.state.actor !== ""
                                        ) {
                                            this.setState({
                                                actors: [...this.state.actors, this.state.actor],
                                                actorsM: [
                                                    ...this.state.actorsM,
                                                    {name: this.state.actor, checked: true},
                                                ],
                                                actor: "",
                                            });
                                        }
                                    }}
                                >
                                    Ajouter
                                </button>
                            </article>
                        </fieldset>
                        {/* END ADD ACTOR */}

                        <h1 className="text-xl font-bold">Directeurs</h1>

                        <article className="flex gap-4 flex-wrap">
                            {this.state.directorsM.length
                                ? this.state.directorsM.map((director) => (
                                    <div
                                        className="form-control  border border-gray-300 rounded-md"
                                        key={director.id}
                                    >
                                        <label className="label cursor-pointer space-x-2">
                                            <span className="label-text">{director.name}</span>
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={director.checked}
                                                value={director.id}
                                                onChange={(e) => {
                                                    if (!this.state.directors.includes(director.name)) {
                                                        this.setState({
                                                            directors: [
                                                                ...this.state.directors,
                                                                director.name,
                                                            ],
                                                        });
                                                        director.checked = true;
                                                    } else {
                                                        this.setState({
                                                            directors: this.state.directors.filter(
                                                                (dir) => dir != director.name
                                                            ),
                                                        });
                                                        director.checked = false;
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                ))
                                : null}
                        </article>

                        {/* ADD DIRECTOR */}
                        <fieldset className="border-2 border-gray-300 rounded-md p-4">
                            <legend className="text-xl font-semibold">Ajouter Directeur</legend>
                            <article className="flex gap-4 flex-wrap">
                                <input
                                    type="text"
                                    placeholder="actor name"
                                    className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                                    value={this.state.director}
                                    onChange={(e) => this.setState({director: e.target.value})}
                                />
                                <button
                                    className="p-2 rounded-md bg-blue-500 text-white font-bold"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (
                                            !this.state.directors.includes(this.state.director) &&
                                            this.state.director !== ""
                                        ) {
                                            this.setState({
                                                directors: [
                                                    ...this.state.directors,
                                                    this.state.director,
                                                ],
                                                directorsM: [
                                                    ...this.state.directorsM,
                                                    {name: this.state.director, checked: true},
                                                ],
                                                director: "",
                                            });
                                        }
                                    }}
                                >
                                    Ajouter
                                </button>
                            </article>
                        </fieldset>

                        {/* END DIRECTOR ADD */}
                    </fieldset>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="DATE DE SORTIE"
                            className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                            value={this.state.year}
                            onChange={(e) => this.setState({year: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="DURÉE"
                            className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                            value={this.state.duration}
                            onChange={(e) => this.setState({duration: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="ORIGINE"
                            className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                            value={this.state.origin}
                            onChange={(e) => this.setState({origin: e.target.value})}
                        />
                    </div>

                    <fieldset className="border-2 border-gray-300 rounded-md p-4">
                        <legend className="text-xl font-semibold">Categories</legend>
                        <article className="flex gap-4 flex-wrap">
                            {this.state.cats
                                ? this.state.cats.map((category) => (
                                    <div
                                        className="form-control  border border-gray-300 rounded-md"
                                        key={category.id}
                                    >
                                        <label className="label cursor-pointer space-x-2">
                                            <span className="label-text">{category.name}</span>
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={category.checked}
                                                value={category.id}
                                                onChange={(e) => {
                                                    if (!this.state.categories.includes(category.id)) {
                                                        this.setState({
                                                            categories: [
                                                                ...this.state.categories,
                                                                category.id,
                                                            ],
                                                        });
                                                        category.checked = true;
                                                    } else {
                                                        this.setState({
                                                            categories: this.state.categories.filter(
                                                                (cat) => cat != category.id
                                                            ),
                                                        });
                                                        category.checked = false;
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                ))
                                : null}
                        </article>
                    </fieldset>

                    <div className="space-y-4 my-4">
                        {this.state.errors.length
                            ? this.state.errors.map((error) => (
                                <Alert status="error" className="rounded-md" key={error}>
                                    <AlertIcon/>
                                    {error}
                                </Alert>
                            ))
                            : null}
                    </div>

                    <button className="btn btn-accent" onClick={e => {
                        e.preventDefault();
                        if (this.state.isLocal && this.state.file !== null) {
                            this.sendImage();
                        } else {
                            this.handleSubmit();
                        }
                    }}>
                        Modifier
                    </button>
                </form>
            </div>
        );
    }
}

export default withRouter(Edit);
