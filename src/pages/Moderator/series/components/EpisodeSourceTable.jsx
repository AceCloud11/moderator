import EpisodeTableRow from "./EpisodeTableRow";
import React from "react";
import SourceTableRow from "./SourceTableRow";

export default function EpisodeSourceTable({ sources, ep, makeToast, token, hosts, fetch }){
    return(
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-slate-300">
            <tr>
                <th scope="col" className="p-4">
                    IDENTIFIANT
                </th>

                <th scope="col" className="px-6 py-3">
                    Nom de lecteur
                </th>

                <th scope="col" className="p-4">
                    Lien de lecteur
                </th>
                <th scope="col" className="p-4">
                    Version
                </th>

                <th scope="col" className="px-6 py-3 text-center">
                    <span>Actions</span>
                </th>
            </tr>
            </thead>
            <tbody>
            {sources.length
                ? sources.map((source) => (
                    <SourceTableRow
                        source={source}
                        key={source.id}
                        makeToast={makeToast}
                        token={token}
                        fetch={fetch}
                        hosts={hosts}
                    />
                ))
                : null}
            </tbody>
        </table>
    )
}