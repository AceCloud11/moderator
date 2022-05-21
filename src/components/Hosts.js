import React from 'react'

export default function Hosts({ hosts }) {
  return (
    <div>
      <h1 className="text-xl my-4 text-red-400">Hôtes approuvés</h1>
      <div className="grid grid-cols-4 gap-4">
        {hosts.map((host, key) => (
          <span className="p-1 text-xs text-center rounded-md border border-gray-300" key={key}>
            {host}
          </span>
        ))}
      </div>
    </div>
  );
}
