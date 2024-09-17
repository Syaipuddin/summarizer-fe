"use client"
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { TrashIcon, PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Table from './table'

const baseUrl = 'http://localhost:5000';

interface summData {
    doc : String,
    summed : String
  }

export default function Train() {

    const [fig, setFig] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<Array<summData>>([]);
    const [isPost, setIsPost] = useState<Boolean>(false);
    const [triggerPost, setTriggerPost] = useState<Boolean>(false);
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [isError, setIsError] = useState<Boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const figure = <img className="w-6/12" src={`data:image/png;base64,${fig}`} />

    const postTraining = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        const postData = await fetch(`${baseUrl}/train-model`, {
            method: 'POST',
            body: formData
        });

        if (postData.ok) {
            const json = await postData.json();
            setData(json.data);
            setFig(json.fig);
            setIsPost(false);
            setIsLoading(false);
        } else {
            console.log("Error");
            setIsError(true);
            setIsPost(false);
            setIsLoading(false);
        }
    }
  
    useEffect(() => {

        setIsError(false);

        if (isPost) {
            postTraining()
        }

        return () => {
            setIsLoading(false);
        }
  
    }, [triggerPost])

  return (
    <div className="flex min-h-screen h-screen flex-col items-center py-10 gap-5">
        <h1 className="mt-10 text-2xl font-semibold">Training</h1>
        <div className="bg-secondary w-8/12 h-1/4 rounded-md p-2 flex flex-col items-center gap-3 flex-shrink-0">
            <h1 className="text-white">Masukkan dataset</h1>
            <input onChange={handleFileChange} type="file" className="w-10/12 bg-gray-200 rounded-md"/>
            <p onClick={e => {setTriggerPost(!triggerPost); setIsPost(true)}} className="bg-cyan-100 px-2 py-1 rounded font-semibold cursor-pointer">Mulai Training</p>
        </div>
        {isError && <p className="text-xl">Error</p> }
        {isLoading && <p className="text-xl">Loading</p> }
        {data.length > 0 ? <Table allData={data} /> : false}
        {fig && figure}
    </div>
  );
}
