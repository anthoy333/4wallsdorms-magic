"use client"

import { motion } from "framer-motion"

export default function GrowingEveryDay() {
  const stats = [
    {
      number: "250+",
      label: "Student Submissions",
      description: "Dorm Rooms or Information Shared",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 640 640">
          <path d="M320 64C355.3 64 384 92.7 384 128C384 163.3 355.3 192 320 192C284.7 192 256 163.3 256 128C256 92.7 284.7 64 320 64zM416 376C416 401 403.3 423 384 435.9L384 528C384 554.5 362.5 576 336 576L304 576C277.5 576 256 554.5 256 528L256 435.9C236.7 423 224 401 224 376L224 336C224 283 267 240 320 240C373 240 416 283 416 336L416 376zM160 96C190.9 96 216 121.1 216 152C216 182.9 190.9 208 160 208C129.1 208 104 182.9 104 152C104 121.1 129.1 96 160 96zM176 336L176 368C176 400.5 188.1 430.1 208 452.7L208 528C208 529.2 208 530.5 208.1 531.7C199.6 539.3 188.4 544 176 544L144 544C117.5 544 96 522.5 96 496L96 439.4C76.9 428.4 64 407.7 64 384L64 352C64 299 107 256 160 256C172.7 256 184.8 258.5 195.9 262.9C183.3 284.3 176 309.3 176 336zM432 528L432 452.7C451.9 430.2 464 400.5 464 368L464 336C464 309.3 456.7 284.4 444.1 262.9C455.2 258.4 467.3 256 480 256C533 256 576 299 576 352L576 384C576 407.7 563.1 428.4 544 439.4L544 496C544 522.5 522.5 544 496 544L464 544C451.7 544 440.4 539.4 431.9 531.7C431.9 530.5 432 529.2 432 528zM480 96C510.9 96 536 121.1 536 152C536 182.9 510.9 208 480 208C449.1 208 424 182.9 424 152C424 121.1 449.1 96 480 96z" />
        </svg>
      )
    },
    {
      number: "300+",
      label: "Dorm Rooms",
      description: "Documented and reviewed",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 640 640">
          <path d="M64 96C81.7 96 96 110.3 96 128L96 352L320 352L320 224C320 206.3 334.3 192 352 192L512 192C565 192 608 235 608 288L608 512C608 529.7 593.7 544 576 544C558.3 544 544 529.7 544 512L544 448L96 448L96 512C96 529.7 81.7 544 64 544C46.3 544 32 529.7 32 512L32 128C32 110.3 46.3 96 64 96zM144 256C144 220.7 172.7 192 208 192C243.3 192 272 220.7 272 256C272 291.3 243.3 320 208 320C172.7 320 144 291.3 144 256z" />
        </svg>
      )
    },
    {
      number: "6+",
      label: "Residence Halls",
      description: "Across a few campuses",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 640 640">
          <path d="M288 112C288 85.5 309.5 64 336 64L432 64C458.5 64 480 85.5 480 112L480 160L528 160L528 88C528 74.7 538.7 64 552 64C565.3 64 576 74.7 576 88L576 160L592 160C618.5 160 640 181.5 640 208L640 528C640 554.5 618.5 576 592 576L336 576C309.5 576 288 554.5 288 528L288 112zM352 176L352 208C352 216.8 359.2 224 368 224L400 224C408.8 224 416 216.8 416 208L416 176C416 167.2 408.8 160 400 160L368 160C359.2 160 352 167.2 352 176zM368 256C359.2 256 352 263.2 352 272L352 304C352 312.8 359.2 320 368 320L400 320C408.8 320 416 312.8 416 304L416 272C416 263.2 408.8 256 400 256L368 256zM352 368L352 400C352 408.8 359.2 416 368 416L400 416C408.8 416 416 408.8 416 400L416 368C416 359.2 408.8 352 400 352L368 352C359.2 352 352 359.2 352 368zM528 256C519.2 256 512 263.2 512 272L512 304C512 312.8 519.2 320 528 320L560 320C568.8 320 576 312.8 576 304L576 272C576 263.2 568.8 256 560 256L528 256zM512 368L512 400C512 408.8 519.2 416 528 416L560 416C568.8 416 576 408.8 576 400L576 368C576 359.2 568.8 352 560 352L528 352C519.2 352 512 359.2 512 368zM96 544L96 384L80 384C35.8 384 0 348.2 0 304C0 277.3 13.1 253.7 33.2 239.1C32.4 234.2 32 229.1 32 224C32 171 75 128 128 128C181 128 224 171 224 224L224 320C224 355.3 195.3 384 160 384L160 544C160 561.7 145.7 576 128 576C110.3 576 96 561.7 96 544z" />
        </svg>
      )
    },
    {
      number: "2+",
      label: "Campuses",
      description: "Across a few states",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z"/>
        </svg>
      )
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Growing Every Day
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of students who trust 4WallsDorms for their college housing needs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                   <div className="text-blue-600 w-8 h-8">
                     {stat.icon}
                   </div>
                 </div>
              </div>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                {stat.label}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 