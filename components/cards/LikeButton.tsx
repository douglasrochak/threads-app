"use client"

import { likeThread } from "@/lib/actions/thread.actions"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface LikeButtonProps {
  threadId: string
  userId: string
  likes: string
}

export function LikeButton({ threadId, userId, likes }: LikeButtonProps) {
  const isLiked = likes
    ? JSON.parse(likes).findIndex((item: string) => item === userId)
    : []

  const [like, setLike] = useState(isLiked >= 0)

  const path = usePathname()
  const heart = like ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"
  return (
    <div className="w-6 h-6">
      <Image
        onClick={() => {
          setLike(!like)
          likeThread({ threadId, userId, path })
        }}
        src={heart}
        alt="heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
      />
    </div>
  )
}
