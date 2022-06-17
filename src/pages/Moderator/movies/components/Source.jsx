import React, {Fragment, useState} from "react";
import Error from "../../../../components/Error";
import {Button, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader} from "@chakra-ui/react";

export default function Source({hosts, submit}) {

    const [link, setLink] = useState('');
    const [vf, setVf] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setLink(e.target.value);
        let hostDomains = hosts.map(el => el.domain_name);
        if (!link.includes('http://') && !link.includes('https://')) {
            setError('veuillez entrer un lien valide');
        } else {
            setError('');
            let domain = link.split('//')[1].split('/')[0];
            if (!hostDomains.includes(domain)) {
                setError(`le domain ${domain} n'est pas autorisée`)
            } else {
                setError('');
            }
        }

    }

    const submitSource = (e) => {
        setError('');
        e.preventDefault();
        let hostDomains = hosts.map(el => el.domain_name);
        if (!link.includes('http://') && !link.includes('https://')) {
            setError('veuillez entrer un lien valide');
            return;
        }
        let domain = link.split('//')[1].split('/')[0];
        if (!hostDomains.includes(domain)) {
            setError(`le domain ${domain} n'est pas autorisée`)
            return;
        } else {
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
                    <button className="py-2 px-4 bg-teal-500 text-white font-bold rounded-md"
                            onClick={submitSource}>Ajouter
                    </button>
                </div>

            </form>


            {/*<ModalContent>*/}
            {/*    <ModalHeader>Lecteur</ModalHeader>*/}
            {/*    <ModalCloseButton />*/}
            {/*    <ModalBody>*/}
            {/*        <div>*/}
            {/*            <Source hosts={hosts} submit={(src) => {*/}
            {/*                setLecteurs(old => [...old, src]);*/}
            {/*                // console.log(src)*/}
            {/*            } }/>*/}


            {/*            {*/}
            {/*                lecteurs.length ?*/}
            {/*                    (*/}
            {/*                        <div className=" w-full overflow-x-scroll no-scroll">*/}
            {/*                            <table className="w-full">*/}
            {/*                                <thead className="bg-slate-300 border border-gray-300">*/}
            {/*                                <th className="p-2">Nom</th>*/}
            {/*                                <th className="p-2">Vesrion</th>*/}
            {/*                                <th className="p-2">Lien</th>*/}
            {/*                                </thead>*/}
            {/*                                <tbody>*/}
            {/*                                {*/}
            {/*                                    lecteurs.map(lecteur => (*/}
            {/*                                        <tr className='border border-gray-300'>*/}
            {/*                                            <td className='border border-gray-300 p-2'>{lecteur.name}</td>*/}
            {/*                                            <td className='border border-gray-300 p-2'>{lecteur.vf ? 'VF' : "VOSTFR"}</td>*/}
            {/*                                            <td className='border border-gray-300 p-2'>{lecteur.src}</td>*/}
            {/*                                        </tr>*/}
            {/*                                    ))*/}
            {/*                                }*/}
            {/*                                </tbody>*/}
            {/*                            </table>*/}
            {/*                        </div>*/}
            {/*                    ) : null*/}
            {/*            }*/}

            {/*        </div>*/}

            {/*    </ModalBody>*/}

            {/*    <ModalFooter>*/}
            {/*        <Button*/}
            {/*            colorScheme="blue"*/}
            {/*            mr={3}*/}
            {/*            onClick={async () => {*/}
            {/*                onCloseCreate();*/}
            {/*                await setSrc("");*/}
            {/*                await setName("");*/}
            {/*                setVf(true);*/}
            {/*                setErrors([]);*/}
            {/*                setLecteurs([])*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            Close*/}
            {/*        </Button>*/}
            {/*        <Button colorScheme="linkedin" onClick={addSources}>*/}
            {/*            Ajouter*/}
            {/*        </Button>*/}
            {/*    </ModalFooter>*/}
            {/*</ModalContent>*/}
        </Fragment>
    )
}