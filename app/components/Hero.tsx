import Link from "next/link"

export default function Hero() {
  return (
    <main className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          See Your
          <br />
          Dorm Room
          <br />
          Before Move-in Day.
        </h1>
        <p className="subheading">
          With room numbers, real floor plans, zero surprises.
        </p>
        <div className="hero-cta-row">
          <Link href="/dorms" className="hero-cta-button">
            All Dorms
          </Link>
          <Link href="/campus" className="hero-cta-button hero-cta-button--outline">
            All Campuses
          </Link>
        </div>
      </div>
    </main>
  )
}
