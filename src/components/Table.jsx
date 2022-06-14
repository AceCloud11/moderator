import React, {Fragment} from "react";
import Pagination from "./Pagination";

export default function Table({ data, fields, actions, lastPage, currentPage, paginate}){
    const renderBody = (row) => {
        let tr;
        for(let i = 0; i < row.length; i++) {

               return(
                   <td className="w-4 p-4">
                       <div className="flex items-center">{row[i]}</div>
                   </td>
               )
            // tr.push(td);
        }
        // console.log(tr);
        // return tr;
    }
    return (
        <Fragment>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>

                    {
                        fields.length ?
                            fields.map(field => {
                                return (
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">{field}</div>
                                    </th>
                                )
                            })
                            : null
                    }
                    <th scope="col" className="p-4">
                        <div className="flex items-center">Actions</div>
                    </th>

                </tr>
                </thead>
                <tbody>
                {data.length
                    ? data.map((row) => (
                        <tr
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            key={row.id}
                        >
                            {
                                renderBody(row)
                            }

                            <td className="px-6 py-4 text-right space-x-4">
                                {
                                    actions.length ?
                                        actions.map(action => {
                                            return (
                                                <button
                                                    onClick={action.method}
                                                    className={`font-medium dark:text-blue-500 hover:underline mr-3 ${action.class}`}
                                                >
                                                    {action.label}
                                                </button>

                                            )
                                        })
                                        : null
                                }
                            </td>
                        </tr>
                    ))
                    : null}
                </tbody>

                {lastPage > 1 ? (
                    <tfoot>
                    <tr>
                        <th colSpan="4">
                            <Pagination
                                currentPage={currentPage}
                                lastPage={lastPage}
                                handleClick={paginate}
                            />
                        </th>
                    </tr>
                    </tfoot>
                ) : null}
            </table>
        </Fragment>
    )
}