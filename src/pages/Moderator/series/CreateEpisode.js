import React, { Component } from 'react';
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../../Context/UserContext';

class CreateEpisode extends Component {
    static contextType = UserContext;
    constructor(props) {
        super(props);
        this.state = {
            episode: '',
            vf: [],
            vfSrc: '',
            nonVf: [],
            nonVfSrc: '',
            errors: [],
            token: '',
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const post_id = this.props.match.params.serieId;
        const data = {
          num: parseInt(this.state.episode),
          vf: this.state.vf,
          nonVf: this.state.nonVf,
        };

        await this.setState({
            errors: [],
        })

        if (this.state.vf.length === 0 && this.state.nonVf.length === 0) {
            await this.setState({
                errors: [...this.state.errors, "Enter at least one source"],
            });
        }

        console.log(data);


         if (!this.state.errors.length) {
           await axios({
             url: "/moderator/episodes/" + post_id,
             method: "post",
             data,
             responseType: "json",
             headers: {
               Authorization: `Bearer ${this.state.token}`,
               Accept: "application/json",
               "Content-Type": "application/json",
             },
           })
             .then(async (res) => {
               console.log(res.data);
               if (res.data.error) {
                   await this.setState({
                     errors: [
                       ...this.state.errors,
                       res.data.error,
                     ],
                   });
               }else{
                    await this.setState({
                      errors: [],
                      episode: '',
                      vf: [],
                      nonVf: [],
                    });
               }

            
             })
             .catch(async (err) => {
               // console.log(err.response);
               await this.setState({
                 errors: [...this.state.errors, err.response.data.message],
               });
             });
         } else {
           // console.log(this.state.errors);
         }
    }

    
    componentDidMount() {
        const { token } = this.context;

        this.setState({
            token: token
        });
    }
    
  render() {
    return (
      <div>
        <h1 className="text-2xl font-bold my-12 text-center">
          Ajouter un nouveau Episode
        </h1>

        <form action="" className="space-y-4">
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Episode Number"
              className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                value={this.state.episode}
                onChange={(e) => this.setState({ episode: e.target.value })}
            />
            
          </div>

          <fieldset className="border-2 border-gray-300 rounded-md p-4">
            <legend className="text-xl font-semibold">Sources</legend>
            <h1 className="text-lg font-bold my-4">Version Française</h1>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Source url"
                className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                value={this.state.vfSrc}
                onChange={(e) => this.setState({ vfSrc: e.target.value })}
              />
              <button
                className="bg-blue-800 p-2 rounded-md border-0"
                onClick={(e) => {
                  e.preventDefault();
                  if (this.state.vfSrc !== "") {
                    this.setState({
                      vf: [
                        ...this.state.vf,
                        this.state.vfSrc,
                      ],
                      vfSrc: "",
                    });
                  }
                }}
              >
                <i className="fa-solid fa-plus text-white text-2xl"></i>
              </button>
            </div>

            <ul className="space-y-3 mt-8">
              {this.state.vf.length
                ? this.state.vf.map((src, key) => (
                    <li
                      className="font-semibold text-sm md:text-md text-wrap text-blue-400"
                      key={key}
                    >
                      {src}
                    </li>
                  ))
                : null}
            </ul>

            <h1 className="text-lg font-bold my-4">Version NonFrançaise</h1>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Source url"
                className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                value={this.state.nonVfSrc}
                onChange={(e) => this.setState({ nonVfSrc: e.target.value })}
              />
              <button
                className="bg-blue-800 p-2 rounded-md border-0"
                onClick={(e) => {
                  e.preventDefault();
                  if (this.state.nonVfSrc !== "") {
                    this.setState({
                      nonVf: [
                        ...this.state.nonVf,
                        this.state.nonVfSrc,
                      ],
                      nonVfSrc: "",
                    });
                  }
                }}
              >
                <i className="fa-solid fa-plus text-white text-2xl"></i>
              </button>
            </div>

            <ul className="space-y-3 mt-8">
              {this.state.nonVf.length
                ? this.state.nonVf.map((src, key) => (
                    <li
                      className="font-semibold text-sm md:text-md text-wrap text-blue-400"
                      key={key}
                    >
                      {src}
                    </li>
                  ))
                : null}
            </ul>
          </fieldset>

          <div className="space-y-4 my-4">
            {this.state.errors.length
              ? this.state.errors.map((error) => (
                  <Alert status="error" className="rounded-md" key={error}>
                    <AlertIcon />
                    {error}
                  </Alert>
                ))
              : null}
          </div>

          <button className="btn btn-accent" onClick={this.handleSubmit}>
            Ajouter
          </button>
        </form>
      </div>

    );
  }
}


export default withRouter(CreateEpisode);