import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-screen h-screen flex flex-col items-center">

        <div className="w-5/6 h-[90%] flex flex-col items-center justify-center gap-4" >
          <p className="text-3xl">Rangkum Berita!</p>
          <p className="text-center">Rangkum berita anda dengan mudah kapanpun hanya dengan memasukkan URL saja!</p>
          <div className="w-5/6 text-center mt-4 bg-secondary p-3 rounded-lg">
            <p className="text-xl font-semibold">Mulai!</p>
          </div>
        </div>
        <div className="w-5/6 h-[10%] bg-white rounded-t-lg flex justify-center p-4">
            <div className="w-2/6 h-2 bg-slate-600 rounded"></div>
        </div>

      </div>
      
    </main>
  );
}
