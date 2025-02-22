"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserReviews } from "@/lib/api"

interface Review {
  id: number
  reviewerId: number
  reviewerName: string
  rating: number
  comment: string
}

export function ReviewsSection({ userId }: { userId: string }) {
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([])
  const [givenReviews, setGivenReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return
        const { received, given } = await getUserReviews(userId, token)
        setReceivedReviews(received)
        setGivenReviews(given)
      } catch (err) {
        console.error(err)
      }
    }

    fetchReviews()
  }, [userId])

  const renderReviews = (reviews: Review[]) => {
    return reviews.map((review) => (
      <div key={review.id} className="mb-2 p-2 border rounded">
        <div className="flex justify-between">
          <span className="font-semibold">{review.reviewerName}</span>
          <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
        </div>
        <p className="mt-1">{review.comment}</p>
      </div>
    ))
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold mb-2">Received Reviews</h3>
        {renderReviews(receivedReviews)}
        <h3 className="text-xl font-semibold mt-4 mb-2">Given Reviews</h3>
        {renderReviews(givenReviews)}
      </CardContent>
    </Card>
  )
}

