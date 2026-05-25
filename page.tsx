"use client"

import { useState } from "react"
import { fakeCollege, type FakeDorm, type FakeRoom } from "./fakeData"
import { FakeCollegePageTemplate } from "./FakeCollegePageTemplate"
import { FakeDormPageTemplate } from "./FakeDormPageTemplate"
import { FakeRoomPageTemplate } from "./FakeRoomPageTemplate"

type CurrentView =
  | {
      type: "college"
    }
  | {
      type: "dorm"
      dorm: FakeDorm
    }
  | {
      type: "room"
      dorm: FakeDorm
      room: FakeRoom
    }

export default function TemplateDemoPage() {
  const [currentView, setCurrentView] = useState<CurrentView>({
    type: "college",
  })

  if (currentView.type === "college") {
    return (
      <FakeCollegePageTemplate
        college={fakeCollege}
        onSelectDorm={(dorm) =>
          setCurrentView({
            type: "dorm",
            dorm,
          })
        }
      />
    )
  }

  if (currentView.type === "dorm") {
    return (
      <FakeDormPageTemplate
        college={fakeCollege}
        dorm={currentView.dorm}
        onBackToCollege={() =>
          setCurrentView({
            type: "college",
          })
        }
        onSelectRoom={(room) =>
          setCurrentView({
            type: "room",
            dorm: currentView.dorm,
            room,
          })
        }
      />
    )
  }

  return (
    <FakeRoomPageTemplate
      college={fakeCollege}
      dorm={currentView.dorm}
      room={currentView.room}
      onBackToDorm={() =>
        setCurrentView({
          type: "dorm",
          dorm: currentView.dorm,
        })
      }
    />
  )
}