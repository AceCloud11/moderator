import React, {Fragment, useState} from "react";
import Error from "../../../../components/Error";

export default function Source({ hosts, submit }) {
    const [link, setLink] = useState('');
    const [vf, setVf] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setLink(e.target.value);
        let hostDomains = hosts.map(el => el.domain_name);
        if (!link.includes('http://') && !link.includes('https://')){
            setError('veuillez entrer un lien valide');
        }
        else{
            setError('');
            let domain = link.split('//')[1].split('/')[0];
            if (!hostDomains.includes(domain)){
                setError(`le domain ${domain} n'est pas autorisée`)
            }else{
                setError('');
            }
        }

    }

    const submitSource = (e) => {
        setError('');
        e.preventDefault();
        let hostDomains = hosts.map(el => el.domain_name);
        if (!link.includes('http://') && !link.includes('https://')){
            setError('veuillez entrer un lien valide');
            return;
        }
        let domain = link.split('//')[1].split('/')[0];
        if (!hostDomains.includes(domain)){
            setError(`le domain ${domain} n'est pas autorisée`)
            return;
        }else{
            setError('');
            let n = hosts.filter(host => host.domain_name == domain)[0].name;
            let src = {
                name: n,
                src: link,
                vf
            }

            submit(src);
            setLink('')
            setError('');
            setVf(false);

        }

    }
    return (
        <Fragment>
            <form action="" className="space-y-2">
                <div className="flex gap-4 flex-wrap mb-2">
                        <input
                            type="text"
                            placeholder="lecteur"
                            className="w-full p-2 rounded-md border-2 focus:outline-none border-gray-300"
                            value={link}
                            onChange={(e) => handleChange(e)}
                            onPaste={(e) => handleChange(e)}
                        />
                        <span className="text-xs text-red-300">{error}</span>


                    {/* vf */}
                    <div className="flex gap-4 w-full">
                        <label className="label cursor-pointer space-x-2">
                            <span className="label-text">VF</span>
                            <input
                                type="checkbox"
                                checked={vf}
                                value={vf}
                                onChange={(e) => {
                                    setVf(!vf);
                                    console.log(vf)
                                }}
                                className="checkbox"
                            />
                        </label>
                    </div>
                    <button className="py-2 px-4 bg-teal-500 text-white font-bold rounded-md" onClick={submitSource}>Ajouter</button>
                </div>

            </form>
        </Fragment>
    )
}