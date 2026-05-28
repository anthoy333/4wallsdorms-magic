// Floor Layouts Section Backup
const floorLayoutsSection = `
<section className="py-16 px-4 sm:px-6 lg:px-8">
  <div className="container mx-auto max-w-5xl">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">Floor Layouts</h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        Learn about the Jack and Jill room layouts and floor plans at Miller Hall.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h3 className="text-xl font-bold mb-4">Jack and Jill Layout</h3>
        <p className="text-muted-foreground mb-4">
          Miller Hall features Jack and Jill rooms with two separate living spaces connected by a shared bathroom.
          This arrangement provides privacy while fostering community between roommates.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
            <span>Private bathroom shared between two rooms</span>
          </li>
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
            <span>Accommodates 2-4 students depending on room size</span>
          </li>
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
            <span>Each room has individual temperature controls</span>
          </li>
        </ul>
      </div>
      <div className="relative rounded-xl overflow-hidden border border-border">
        <Image
          src="/jack-and-jill-dorm-floorplan.png"
          alt="Jack and Jill Room Layout"
          width={600}
          height={320}
          className="object-contain w-full h-64 md:h-80"
        />
      </div>
    </div>

    <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
      <div className="order-2 md:order-1 relative rounded-xl overflow-hidden border border-border">
        <Image
          src="/dorm-floor-plan.png"
          alt="Typical Floor Layout"
          width={600}
          height={320}
          className="object-contain w-full h-64 md:h-80"
        />
      </div>
      <div className="order-1 md:order-2">
        <h3 className="text-xl font-bold mb-4">Typical Floor Layout</h3>
        <p className="text-muted-foreground mb-4">
          Miller Hall features common spaces on alternating floors, with a mix of double, triple, and quad rooms
          throughout the building. The central location provides easy access to academic buildings.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
            <span>Common lounges on every other floor</span>
          </li>
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
            <span>Study rooms available on select floors</span>
          </li>
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
            <span>Laundry facilities on the ground floor</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Individual Rooms Section */}
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-6 text-center">Individual Rooms</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {allRooms
          .filter((room) => room.type !== "Adjoining")
          .slice(0, 6) // Show first 6 individual rooms
          .map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: room.id * 0.1 }}
              className="bg-background rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <Image
                  src={room.image || "/placeholder.svg"}
                  alt={\`Room \${room.number}\`}
                  width={400}
                  height={192}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">Room {room.number}</h4>
                    <p className="text-sm text-muted-foreground">{room.type} Room</p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={room.link || "#"}>View</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>

    {/* Adjoining Rooms Section */}
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-6 text-center">Adjoining Rooms</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {allRooms
          .filter((room) => room.type === "Adjoining")
          .map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: room.id * 0.1 }}
              className="bg-background rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <Image
                  src={room.image || "/placeholder.svg"}
                  alt={\`Rooms \${room.number}\`}
                  width={400}
                  height={192}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">Rooms {room.number}</h4>
                    <p className="text-sm text-muted-foreground">{room.type} Setup</p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={room.link || "#"}>View</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  </div>
</section>
`;