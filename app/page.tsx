"use client"
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { TrashIcon, PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { get } from "http";

const baseUrl = 'http://localhost:5000';

interface inputProps {
  link : String,
  keyNumber : number,
  urls : Array<String>,
  setIndexToDelete : Dispatch<SetStateAction<Number | undefined>>,
  setLink : Dispatch<SetStateAction<Array<String>>>
}

interface setterProps {
  setLink : Dispatch<SetStateAction<String[]>>
}

function InputBox({link, keyNumber, urls, setIndexToDelete, setLink} : inputProps) : ReactNode {

  return (
    <div className="group flex items-center rounded-md w-11/12">
        <input className="bg-gray-200 p-2 rounded-md w-full font-light text-gray-500" onChange={(e)=> setLink(prevState => [...prevState.slice(0, keyNumber), e.target.value, ...prevState.slice(keyNumber + 1)] )} value={link} />
        <div onClick={(e)=>setIndexToDelete(keyNumber)} className="bg-red-600 h-full p-2 rounded-r-md hidden group-hover:block cursor-pointer">
          <TrashIcon className="size-6 md:size-6" />
        </div>
    </div>
  )
}

function AddInputBox({setLink} : setterProps) {

  return (
    <div onClick={(e)=>setLink((prevState : Array<String>)=>[...prevState, ''])} className="flex items-center border-dashed border-2 border-gray-400 justify-center rounded-md p-2 w-11/12 cursor-pointer">
        <PlusIcon className="size-6 text-gray-400"/>
    </div>
  )
}

function SumBtn({setIsFetch, setIsRefresh, setResult, isRefresh}) {
  return(
    <div onClick={(e)=>{setIsFetch(true); setIsRefresh(!isRefresh); setResult('')}} className="bg-blue-400 font-semibold px-2 py-1 md:w-5/12 text-lg md:text-2xl text-center rounded-md cursor-pointer">Rangkum</div>
  )
}

function DisSumbBtn() {
  return (
    <div  className="bg-slate-400 font-semibold px-2 py-1 md:w-5/12 text-lg md:text-2xl text-center rounded-md">Rangkum</div>
  )
}

function copyText(text : String) {
  navigator.clipboard.writeText(text as string);
}

export default function Home() {

  const [link, setLink] = useState<Array<String>>(['  ']);
  const [indexToDelete, setIndexToDelete] = useState <Number | undefined>(undefined);
  const [result, setResult] = useState<String>('');
  const [isFetch, setIsFetch] = useState <Boolean>(false);
  const [isError, setIsError] = useState <Boolean>(false);
  const [isRefresh, setIsRefresh] = useState<Boolean>(false);

  useEffect(()=> {

    async function fetchResult() {
      const getResult = await fetch(`${baseUrl}/summarize`, {
        'method' : 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        'body' : JSON.stringify({urls : link})
      })

      if (getResult.ok) {
        const result = await getResult.json();
        setResult(result?.sum_text);
      } else {
        setIsError(true);
      }

      setIsFetch(false);
    }

    if (indexToDelete != undefined) {
      setLink(prevState => {
        const newUrl = prevState.filter((i, index)=> index != indexToDelete);
        return newUrl;
      });

      setIndexToDelete(undefined);
    }

    if (isFetch) {
      fetchResult();
    }

  }, [link, indexToDelete, isRefresh])

  return (
    <main className="flex min-h-screen h-screen flex-col items-center justify-center p-4">
      <div className="w-[80dvw] h-[80dvh] flex flex-col md:flex-row-reverse items-center bg-white m-2 rounded-lg md:py-8 md:px-6">

        <div className="flex-col md:w-6/12 md:h-full items-center gap-4 hidden lg:flex bg-gray-200 rounded-xl" >
          <div className="w-full md:h-11/12 md:h-full rounded-lg md:px-8 md:p-4">
            <div className="w-full flex justify-between py-4">
              <p className="text-black text-2xl font-semibold">Hasil</p>
              <ClipboardDocumentListIcon onClick={(e) => copyText(result)} className="md:size-8 text-black" />
            </div>
            <p className="scrollbar scrollbar-thin scrollbar-thumb-slate-600 scrollbar-thumb-rounded-full scrollbar-track-gray-200 text-black md:text-xl overflow-y-auto max-h-[85%] pe-2">{result}</p>
          </div>
          
        </div>
        <div className="relative w-full md:w-6/12 h-full flex flex-col rounded-t-lg items-center p-4 md:px-4 md:p-1">
            <div className="w-full flex flex-col gap-3 items-center">
                {link.map((e, x) => <InputBox key={x.toString()} keyNumber={x} link={e} urls={link} setIndexToDelete={setIndexToDelete} setLink={setLink} /> )}
                <AddInputBox setLink={setLink}/>
            </div>
            <div className="flex flex-col md:flex-row w-full justify-around gap-2 absolute bottom-2 px-6">
              <div onClick={(e) => setLink([''])} className="bg-red-600 font-semibold px-2 py-1 md:w-5/12 text-lg md:text-2xl text-center rounded-md cursor-pointer">Bersihkan</div>
              {isFetch ? <DisSumbBtn /> : <SumBtn setIsFetch={setIsFetch} setIsRefresh={setIsRefresh} setResult={setResult} isRefresh={isRefresh} />}
            </div>
        </div>

      </div>
      
    </main>
  );
}
