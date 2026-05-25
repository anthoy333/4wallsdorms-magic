import type { FakeRoom, FakeDorm, FakeCollege } from "./fakeData"

type FakeRoomPageTemplateProps = {
  college: FakeCollege
  dorm: FakeDorm
  room: FakeRoom
  onBackToDorm: () => void
}

export function FakeRoomPageTemplate({
  college,
  dorm,
  room,
  onBackToDorm,
}: FakeRoomPageTemplateProps) {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <button
          onClick={onBackToDorm}
          className="rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100"
        >
          ← Back to {dorm.name}
        </button>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            {college.name} • {dorm.name}
          </p>

          <h1 className="mt-2 text-4xl font-bold">{room.title}</h1>

          <p className="mt-3 max-w-2xl text-gray-600">{room.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              Student Verified
            </span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              {room.beds} Beds
            </span>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
              {room.bathroomType}
            </span>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex h-80 items-center justify-center rounded-xl bg-gray-200 text-gray-500">
              Fake Room Photo
            </div>
          </div>

          <div className="space-y-4">
            <InfoCard label="Room Type" value={room.roomType} />
            <InfoCard label="Annual Cost" value={room.annualCost} />
            <InfoCard label="Bathroom" value={room.bathroomType} />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Room Features</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {room.features.map((feature) => (
              <div
                key={feature}
                className="rounded-xl border bg-gray-50 p-4 text-sm font-medium"
              >
                {feature}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Required Buttons</h2>

          <p className="mt-2 text-gray-600">
            These buttons are inside the template. That means every room gets
            them automatically.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800">
              Submit Your Room
            </button>

            <button className="rounded-lg border bg-white px-4 py-2 font-medium hover:bg-gray-100">
              Ask a Question
            </button>

            <button className="rounded-lg border bg-white px-4 py-2 font-medium hover:bg-gray-100">
              Report Missing Info
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}