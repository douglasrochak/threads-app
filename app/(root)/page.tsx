import { ThreadCard } from "@/components/cards/ThreadCard"
import { fetchPosts } from "@/lib/actions/thread.actions"
import { currentUser } from "@clerk/nextjs"

const HomePage = async () => {
  const { posts } = await fetchPosts(1, 30)
  const user = await currentUser()
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {!posts.length ? (
          <p className="no-result">Nenhuma thread encontrada</p>
        ) : (
          <>
            {posts.map((post) => (
              // Refactor: to receive a post object
              <ThreadCard
                key={post._id}
                currentUserId={user?.id!}
                id={post._id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                likes={post.likes}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}

export default HomePage
