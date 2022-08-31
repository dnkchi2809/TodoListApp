import Head from 'next/head'
import NavBar from '../views/Main/NavBar'
import { useRouter } from "next/router";
import FolderDetail from '../views/Folders/FolderItem/FolderDetail';

export default function DetailTodo() {
  const router = useRouter();
  const { folderItemId } = router.query;

  return (
    <div className='container justify-center items-end mx-auto px-3'>
      <Head>
        <title>Folder Detail</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NavBar />
        <FolderDetail folderId={folderItemId} />
      </main>
    </div>
  )
}