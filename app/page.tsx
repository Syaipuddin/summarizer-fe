"use client"
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { TrashIcon, PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { get } from "http";

const baseUrl = 'http://localhost:5000';

interface inputProps {
  link : inputs,
  keyNumber : number,
  urls : Array<inputs>,
  setIndexToDelete : Dispatch<SetStateAction<Number | undefined>>,
  setLink : Dispatch<SetStateAction<Array<inputs>>>,
}

interface setterProps {
  setLink : Dispatch<SetStateAction<inputs[]>>
}

interface titleSetterProps {
  setTitle : Dispatch<SetStateAction<string>>,
  title : string
}

interface inputs {
  link : string | number | readonly string[] | undefined,
  isText : String
}

function InputBox({link, keyNumber, urls, setIndexToDelete, setLink} : inputProps) : ReactNode {

  if (link.isText == '1') {

    return (
      <div className="group flex items-center rounded-md w-full h-2/4 relative flex-shrink-0">
          <select value={link.isText} onChange={(e)=> setLink(prevState => [...prevState.slice(0, keyNumber), {"link" : link.link, "isText": e.target.value}, ...prevState.slice(keyNumber + 1)] )} className="absolute left-2 top-2 text-black bg-gray-100 rounded text-sm">
            <option value="1" >text</option>
            <option value="0" >link</option>
          </select>
          <textarea className="bg-gray-200 p-2 rounded-md w-full font-light text-gray-500 h-full break-words p-3 pt-8 scrollbar-none focus:outline-none" onChange={(e)=> setLink(prevState => [...prevState.slice(0, keyNumber), {"link" : e.target.value, "isText": link.isText}, ...prevState.slice(keyNumber + 1)] )} value={link?.link} />
          <div onClick={(e)=>setIndexToDelete(keyNumber)} className="absolute right-2 top-2 bg-red-600 h-1/4 justify-center items-center px-2 py-1 rounded-md hidden group-hover:flex cursor-pointer ">
            <TrashIcon className="size-6 md:size-4" />
          </div>
      </div>
    )

  } else {

    return (
      <div className="group flex items-center rounded-md w-full flex-shrink-0 relative">
        <select value={link.isText} onChange={(e)=> setLink(prevState => [...prevState.slice(0, keyNumber), {"link" : link.link, "isText": e.target.value}, ...prevState.slice(keyNumber + 1)] )} className="text-black bg-gray-200  h-full rounded-l-md text-sm ps-1">
            <option value="1" >text</option>
            <option value="0" >link</option>
          </select>
          <input className="bg-gray-200 p-2 rounded-r-md group-hover:rounded-none  w-full font-light text-gray-500 focus:outline-none" onChange={(e)=> setLink(prevState => [...prevState.slice(0, keyNumber), {"link" : e.target.value, "isText": link.isText}, ...prevState.slice(keyNumber + 1)] )} value={link?.link} />
          <div onClick={(e)=>setIndexToDelete(keyNumber)} className="bg-red-600 h-full p-2 rounded-r-md hidden group-hover:block cursor-pointer">
            <TrashIcon className="size-6 md:size-6" />
          </div>
      </div>
    )
  
  }
}

function TitleInputBox({setTitle, title} :titleSetterProps ) {
  return (
    <div className="group flex items-center rounded-md w-11/12 pr-4">
        <input className="bg-gray-200 p-2 rounded-md w-full font-light text-gray-500 focus:outline-none" onChange={(e)=> setTitle(e.target.value)} value={title} />
    </div>
  )
}

function AddInputBox({setLink} : setterProps) {

  return (
    <div onClick={(e)=>setLink((prevState : Array<inputs>)=>[...prevState, {link: "", isText : '0'}])} className="flex items-center border-dashed border-2 border-gray-400 justify-center rounded-md p-2 w-full cursor-pointer">
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

  const [link, setLink] = useState<Array<inputs>>([
    {
      link : "",
      isText : '0'
    }
  ]);
  const [title, setTitle] = useState<string>('');
  const [indexToDelete, setIndexToDelete] = useState <Number | undefined>(undefined);
  const [result, setResult] = useState<String>('');
  const [isFetch, setIsFetch] = useState <Boolean>(false);
  const [isError, setIsError] = useState <Boolean>(false);
  const [isRefresh, setIsRefresh] = useState<Boolean>(false);
  const [isText, setIsText] = useState<String>('0');

  useEffect(()=> {

    async function fetchResult() {
      const getResult = await fetch(`${baseUrl}/summarize`, {
        'method' : 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        'body' : JSON.stringify({"title": title, "body":link})
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
      <div className="w-[80dvw] h-[80dvh] flex flex-col md:flex-row-reverse items-center bg-slate-100 m-2 rounded-lg md:py-8 md:px-6 shadow-md text-white">

        <div className="flex-col md:w-6/12 md:h-full items-center gap-4 hidden lg:flex bg-gray-200 rounded-xl" >
          <div className="w-full md:h-11/12 md:h-full rounded-lg md:px-8 md:p-4">
            <div className="w-full flex justify-between py-4">
              <p className="text-black text-2xl font-semibold">Hasil</p>
              <ClipboardDocumentListIcon onClick={(e) => copyText(result)} className="md:size-8 text-black" />
            </div>
            <p className="scrollbar scrollbar-thin scrollbar-thumb-slate-600 scrollbar-thumb-rounded-full scrollbar-track-gray-200 text-black md:text-xl overflow-y-auto max-h-[85%] pe-2">{result}</p>
          </div>
          
        </div>
        <div className="relative w-full md:w-6/12 h-full flex flex-col gap-10 rounded-t-lg items-center p-4 md:px-4 md:p-1">
            <div className="w-full min-h-[80%] flex flex-col gap-3 items-center">
              <p className="text-black font-semibold text-xl w-11/12">Judul / Topik</p>
              <TitleInputBox title={title} setTitle={setTitle} />
              <p className="text-black font-semibold text-xl w-11/12">Berita</p>
              <div className="w-11/12 h-full overflow-y-scroll flex flex-col gap-2 py-2 scrollbar scrollbar-thin scrollbar-thumb-slate-600 scrollbar-thumb-rounded-full scrollbar-track-gray-200 pr-3">
                {link.map((e, x) => <InputBox key={x.toString()} keyNumber={x} link={e} urls={link} setIndexToDelete={setIndexToDelete} setLink={setLink} /> )}
                <AddInputBox setLink={setLink}/>
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full h-[10%] justify-around gap-2  px-6">
              <div onClick={(e) => setLink([{link: "", isText : "0"}])} className="bg-red-600 font-semibold px-2 py-1 md:w-5/12 text-lg md:text-2xl text-center rounded-md cursor-pointer">Bersihkan</div>
              {isFetch ? <DisSumbBtn /> : <SumBtn setIsFetch={setIsFetch} setIsRefresh={setIsRefresh} setResult={setResult} isRefresh={isRefresh} />}
            </div>
        </div>

      </div>
      
    </main>
  );
}
