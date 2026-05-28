import type { FakeDorm, FakeCollege, FakeRoom } from "./fakeData"

type FakeDormPageTemplateProps = {
  college: FakeCollege
  dorm: FakeDorm
  onSelectRoom: (room: FakeRoom) => void
  onBackToCollege: () => void
}

export function FakeDormPageTemplate({
  college,
  dorm,
  onSelectRoom,
  onBackToCollege,
}: FakeDormPageTemplateProps) {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <button
          onClick={onBackToCollege}
          className="rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100"
        >
          ← Back to {college.name}
        </button>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">{college.name}</p>
          <h1 className="mt-2 text-4xl font-bold">{dorm.name}</h1>
          <p className="mt-2 text-gray-500">{dorm.address}</p>
          <p className="mt-4 max-w-2xl text-gray-600">{dorm.description}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {dorm.quickFacts.map((fact) => (
            <div key={fact.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">{fact.label}</p>
              <p className="mt-1 text-xl font-bold">{fact.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Rooms in {dorm.name}</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {dorm.rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className="overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-44 items-center justify-center bg-gray-200 text-gray-500">
                  Fake Room Photo
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold">{room.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{room.roomType}</p>
                  <p className="mt-3 text-sm text-gray-600">
                    {room.beds} beds • {room.bathroomType}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Dorm Buttons</h2>

          <p className="mt-2 text-gray-600">
            These are part of the dorm template, so every dorm page gets the
            same actions.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800">
              Add Dorm Photos
            </button>

            <button className="rounded-lg border bg-white px-4 py-2 font-medium hover:bg-gray-100">
              Ask About This Dorm
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}