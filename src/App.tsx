// import './App.css'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function App() {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('https://jsonplaceholder.typicode.com/posts').then((res) => res.json()),
    // staleTime: 4000, // auto refetch in 4 secs with some conditions (reconnected, refocus, window resize, new component mounted)
    // refetchInterval: 4000, // auto refetch
    // gcTime: 6000, //
    // refetchOnWindowFocus: false,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newPost: any) =>
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }).then((res) => res.json()),
      onSuccess: (newPost) => {
        // queryClient.invalidateQueries({
        //   queryKey: ['posts']
        // }); // invalidate the cache and refetch the list
        queryClient.setQueryData(['posts'], (oldPosts: any[]) => [...oldPosts, newPost]) // setting the cache
      }
  })

  if (error || isError) {
    return <div> There was an error! </div>
  }

  if (isLoading) {
    return <div> Data is Loading... </div>
  }

  return (
    <div className='App'>
      {isPending && <p>Data is being added</p>}
      <button onClick={() => mutate({
        userId: 5000,
        id: 4000,
        title: 'Hey my name is Pedro and this is my Channel!',
        body: 'This is the body of this post.'
      })}>Add Post</button>
      {data?.map((todo: any) => (
        <div key={todo.id}>
          <h4>ID: {todo.id}</h4>
          <h4>Title: {todo.title}</h4>
          <p>{todo.body}</p>
        </div>
      ))}
    </div>
  )
}

export default App
