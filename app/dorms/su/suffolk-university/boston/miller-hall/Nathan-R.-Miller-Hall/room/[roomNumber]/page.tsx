"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MillerHallRoomPageTemplate } from "@/app/components/MillerHallRoomPageTemplate"
import { getAllMillerHallRooms, getMillerHallRoomInfo, buildMillerRoomConfig } from "@/app/utils/millerHallMapping"

interface PageProps {
  params: Promise<{ roomNumber: string }>
}

export default function MillerHallRoomPage({ params }: PageProps) {
  const { roomNumber } = use(params)
  const router = useRouter()

  const allRooms = getAllMillerHallRooms()
  const roomInfo = getMillerHallRoomInfo(roomNumber)

  const isValid =
    allRooms.includes(roomNumber) &&
    !!roomInfo &&
    roomInfo.type !== 'common' &&
    roomInfo.type !== 'public-bathroom'

  useEffect(() => {
    if (!isValid) router.push('/404')
  }, [isValid, router])

  if (!isValid) return null

  const config = buildMillerRoomConfig(roomInfo)

  return <MillerHallRoomPageTemplate config={config} />
}
