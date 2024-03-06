import { fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import { ThreadCard } from "../cards/ThreadCard"

type Props = {
  currentUserId: string
  accountId: string
  accountType: string
}

export const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
}: Props) => {
  const result = await fetchUserPosts(accountId)

  if (!result) return redirect("/")

  return (
    <section className="mt-9 flex flex-col gap-10">
      {
        // TODO: thread type
        result.threads.map((thread: any) => (
          <ThreadCard
            key={thread._id}
            currentUserId={currentUserId}
            id={thread._id}
            parentId={thread.parentId}
            content={thread.text}
            likes={thread.likes}
            author={
              accountType === "User"
                ? { name: result.name, image: result.image, id: result.id }
                : {
                    name: thread.author.name,
                    image: thread.author.image,
                    id: thread.author.id,
                  }
            }
            community={thread.community} // TODO
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        ))
      }
    </section>
  )
}
