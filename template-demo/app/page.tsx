"use client"

import { useState } from "react"
import { fakeColleges, type FakeCollege, type FakeDorm, type FakeRoom } from "./fakeData"
import { FakeCollegePageTemplate } from "./FakeCollegePageTemplate"
import { FakeDormPageTemplate } from "./FakeDormPageTemplate"
import { FakeRoomPageTemplate } from "./FakeRoomPageTemplate"

type CurrentView =
  | {
      type: "college-list"
    }
  | {
      type: "college"
      college: FakeCollege
    }
  | {
      type: "dorm"
      college: FakeCollege
      dorm: FakeDorm
    }
  | {
      type: "room"
      college: FakeCollege
      dorm: FakeDorm
      room: FakeRoom
    }

export default function TemplateDemoPage() {
	const [currentView, setCurrentView] = useState<CurrentView>({
	  type: "college-list",
	})
	if (currentView.type === "college-list") {
	  return (
		<main className="min-h-screen bg-gray-50 p-6">
		  <div className="mx-auto max-w-6xl space-y-6">
			<section className="rounded-2xl bg-white p-6 shadow-sm">
			  <h1 className="text-4xl font-bold">Fake Colleges</h1>
			  <p className="mt-3 text-gray-600">
				Pick a college. Each college uses the same CollegePageTemplate.
			  </p>
			</section>

			<section className="grid gap-4 md:grid-cols-2">
			  {fakeColleges.map((college) => (
				<button
				  key={college.id}
				  onClick={() =>
					setCurrentView({
					  type: "college",
					  college,
					})
				  }
				  className="rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
				>
				  <h2 className="text-2xl font-bold">{college.name}</h2>
				  <p className="mt-2 text-gray-500">
					{college.city}, {college.state}
				  </p>
				  <p className="mt-3 text-gray-600">{college.description}</p>
				</button>
			  ))}
			</section>
		  </div>
		</main>
	  )
	}
	if (currentView.type === "college") {
	  return (
		<FakeCollegePageTemplate
		  college={currentView.college}
		  onBackToCollegeList={() =>
			setCurrentView({
			  type: "college-list",
			})
		  }
		  onSelectDorm={(dorm) =>
			setCurrentView({
			  type: "dorm",
			  college: currentView.college,
			  dorm,
			})
		  }
		/>
	  )
	}

	if (currentView.type === "dorm") {
	  return (
		<FakeDormPageTemplate
		  college={currentView.college}
		  dorm={currentView.dorm}
		  onBackToCollege={() =>
			setCurrentView({
			  type: "college",
			  college: currentView.college,
			})
		  }
		  onSelectRoom={(room) =>
			setCurrentView({
			  type: "room",
			  college: currentView.college,
			  dorm: currentView.dorm,
			  room,
			})
		  }
		/>
	  )
	}

	return (
	  <FakeRoomPageTemplate
		college={currentView.college}
		dorm={currentView.dorm}
		room={currentView.room}
		onBackToDorm={() =>
		  setCurrentView({
			type: "dorm",
			college: currentView.college,
			dorm: currentView.dorm,
		  })
		}
	  />
	)
}