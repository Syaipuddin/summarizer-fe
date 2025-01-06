"use client"
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { TrashIcon, PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Table from './table'

const baseUrl = 'http://localhost:5000';

interface summData {
    doc : String,
    summed : String
}

interface fpr {  
    f : number | undefined,
    p : number | undefined,
    r : number | undefined
}

interface rougeScores {
    r1 : fpr,
    r2 : fpr,
    l : fpr,
}

export default function Train() {

    const [fig, setFig] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [score, setScore] = useState<rougeScores>({r1: 0, r2:0, l:0});
    const [accuracy, setAccuracy] = useState<number>(0);
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
    const fprDiv = (scoreData : fpr) => <div className="flex gap-2 text-white w-full">
                                            <div className="flex gap-2 text-xs items-center w-2/6">
                                                <p className="font-semibold">f :</p>
                                                <div className="w-5/6 bg-white p-1 rounded-md text-black px-2">
                                                    <p>{scoreData.f}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 text-xs items-center w-2/6">
                                                <p className="font-semibold">p :</p>
                                                <div className="w-5/6 bg-white p-1 rounded-md text-black px-2">
                                                    <p>{scoreData.p}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 text-xs items-center w-2/6">
                                                <p className="font-semibold">r :</p>
                                                <div className="w-5/6 bg-white p-1 rounded-md text-black px-2">
                                                    <p>{scoreData.r}</p>
                                                </div>
                                            </div>
                                            
                                        </div>
    const figureWrapper = <div className="flex gap-2 justify-center items-center">
                            {figure}
                            <div className="bg-secondary px-5 pt-3 pb-6 flex flex-col gap-5 rounded-md w-5/12">
                                <div className="flex flex-col gap-2">
                                    <p className="font-semibold text-white">rouge-1</p>
                                    {fprDiv(score.r1)}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="font-semibold text-white">rouge-2</p>
                                    {fprDiv(score.r2)}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="font-semibold text-white">rouge-l</p>
                                    {fprDiv(score.l)}
                                </div>
                                <p>Accuracy: {accuracy} %</p>
                            </div>    
                        </div>
    
    const countAccuracy = (rScore: RougeScores): number => {
        const totalFScore = Object.values(rScore).reduce((sum, metric) => sum + (metric.f || 0), 0);
        setAccuracy((totalFScore / Object.keys(rScore).length) * 100);
    };

    const postTraining = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        const postData = await fetch(`${baseUrl}/test-model`, {
            method: 'POST',
            body: formData
        });

        if (postData.ok) {
            const json = await postData.json();
            setData(json.data);
            setFig(json.fig);
            setScore({
                r1: {
                    f : json["scores"]["rouge-1"]["f"], 
                    p : json["scores"]["rouge-1"]["p"],
                    r : json["scores"]["rouge-1"]["r"]
                },
                r2: {
                    f : json["scores"]["rouge-2"]["f"], 
                    p : json["scores"]["rouge-2"]["p"],
                    r : json["scores"]["rouge-2"]["r"]
                },
                l: {
                    f : json["scores"]["rouge-l"]["f"], 
                    p : json["scores"]["rouge-l"]["p"],
                    r : json["scores"]["rouge-l"]["r"]
                },
            })

            countAccuracy(json.scores);
            setIsPost(false);
            setIsLoading(false);

            console.log(json);
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
        <h1 className="mt-10 text-2xl font-semibold">Testing</h1>
        <div className="bg-secondary w-8/12 h-1/4 rounded-md p-2 flex flex-col items-center gap-3 flex-shrink-0">
            <h1 className="text-white">Masukkan dataset</h1>
            <input onChange={handleFileChange} type="file" className="w-10/12 bg-gray-200 rounded-md"/>
            <p onClick={e => {setTriggerPost(!triggerPost); setIsPost(true); setData([]); setFig(''); setScore({r1: 0, r2:0, l:0})}} className="bg-cyan-100 px-2 py-1 rounded font-semibold cursor-pointer">Mulai Testing</p>
        </div>
        {isError && <p className="text-xl">Error</p> }
        {isLoading && <p className="text-xl">Loading</p> }
        {data.length > 0 ? <Table allData={data} /> : false}
        {fig && figureWrapper}
        
    </div>
  );
}
