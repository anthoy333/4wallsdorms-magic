import type { FakeCollege, FakeDorm } from "./fakeData"

type FakeCollegePageTemplateProps = {
  college: FakeCollege
  onSelectDorm: (dorm: FakeDorm) => void
  onBackToCollegeList: () => void
}

export function FakeCollegePageTemplate({
  college,
  onSelectDorm,
  onBackToCollegeList,
}: FakeCollegePageTemplateProps) {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
		<button
		  onClick={onBackToCollegeList}
		  className="rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100"
		>
		  ← Back to Fake College List
		</button>
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            {college.city}, {college.state}
          </p>

          <h1 className="mt-2 text-4xl font-bold">{college.name}</h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            {college.description}
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Dorms at {college.name}</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {college.dorms.map((dorm) => (
              <button
                key={dorm.id}
                onClick={() => onSelectDorm(dorm)}
                className="overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-52 items-center justify-center bg-gray-200 text-gray-500">
                  Fake Dorm Photo
                </div>

                <div className="p-5">
                  <h3 className="text-2xl font-bold">{dorm.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{dorm.address}</p>
                  <p className="mt-3 text-gray-600">{dorm.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">College Page Buttons</h2>

          <p className="mt-2 text-gray-600">
            These actions live in the college template, not on every individual
            college page.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800">
              Add Your College Dorm
            </button>

            <button className="rounded-lg border bg-white px-4 py-2 font-medium hover:bg-gray-100">
              Contact 4WallsDorms
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}