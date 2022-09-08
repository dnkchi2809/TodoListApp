import Head from 'next/head'
import NavBar from '../views/Main/nav-bar'
import TodoDetail from '../views/Main/todo-detail';
import { useRouter } from "next/router";

export default function DetailTodo() {
  const router = useRouter();
  const { todoItemId } = router.query;

  return (
    <div className='container justify-center items-end mx-auto px-3'>
      <Head>
        <title>Todo Detail</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NavBar />
        <TodoDetail itemId={todoItemId} />
      </main>
    </div>
  )
}
