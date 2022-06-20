import React, {Fragment, useContext} from "react";
import UserContext from "../Context/UserContext";
import {addToSlider, deletePost, forceDelete, handleApprove, restore} from "../helpers/posts";

export default function PostsTableRow({ movies, fetch, type }){
    const { token, role } = useContext(UserContext);

    return (
        <Fragment>
            {movies.length
                ? movies.map((movie) => (
                    <tr
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        key={movie.id}
                    >
                        <td className="w-4 p-4">
                            <div className="flex items-center">{movie.id}</div>
                        </td>
                        <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                        >
                            {movie.title}
                        </th>
                        <td className="px-6 py-4">{movie.year}</td>
                        <td className="px-6 py-4">{movie.lang}</td>
                        {
                            movie.deleted_at == null ? (
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <a
                                            href={`/moderator/${type === 'movie' ? 'movies' : 'series'}/${movie.id}/edit`}
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                                        >
                                            Modifier
                                        </a>

                                        {
                                            role === 'admin' ?
                                                movie.is_approved == 1  ? (
                                                        <button
                                                            className="font-medium text-orange-700 dark:text-blue-500 hover:underline"
                                                            onClick={async () => {
                                                                await handleApprove(movie.id, "disapprove", token);
                                                                await fetch(1);

                                                            }}
                                                        >
                                                            Désapprouver
                                                        </button>
                                                    )
                                                    :
                                                    (
                                                        <button
                                                            className="font-medium text-orange-700 dark:text-blue-500 hover:underline"
                                                            onClick={async () => {
                                                                await handleApprove(movie.id, "approve", token);
                                                                await fetch(1);
                                                            }}
                                                        >
                                                            Approuver
                                                        </button>
                                                    )
                                                : null
                                        }

                                        <button
                                            className="font-medium text-purple-600 dark:text-blue-500 hover:underline"
                                            onClick={async () => {
                                                await addToSlider(movie.id, token)
                                            }}
                                        >
                                            Ajouter au BoxOffice
                                        </button>

                                        <a
                                            className="font-medium text-lime-600 dark:text-blue-500 hover:underline"
                                            href={`/moderator/movies/${movie.id}/sources`}
                                        >
                                            Les Lecteurs
                                        </a>

                                        <button
                                            className="font-medium text-red-600 dark:text-blue-500 hover:underline"
                                            onClick={async () => {
                                                await deletePost(movie.id, token);
                                                await fetch(1);
                                            }}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                            )
                                : (
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                                            onClick={async () => {
                                                await restore(movie.id, token);
                                                await fetch(1);
                                            }}
                                        >
                                            Restaurer
                                        </button>

                                        {
                                            role === 'admin' ?

                                                <button
                                                    className="font-medium text-orange-700 dark:text-red-500 hover:underline"
                                                    onClick={async () => {
                                                        await forceDelete(movie.id, token);
                                                        await fetch(1)
                                                    }}
                                                >
                                                    Forcer la suppression
                                                </button>

                                                : null
                                        }

                                    </td>
                                )
                        }
                    </tr>
                ))
                : null}
        </Fragment>
    )
}