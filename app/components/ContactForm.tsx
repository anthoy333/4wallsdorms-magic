"use client"

import type React from "react"

import { useMemo, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { X, Upload, Film, Plus, Minus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB for images
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB for videos
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"]

// Generate year options dynamically based on current year
const generateYearOptions = () => {
  const options = []
  const currentYear = new Date().getFullYear()

  // Add full years and semesters from current year down to 2010
  for (let year = currentYear; year >= 2010; year--) {
    options.push(`Full Year (${year}-${year + 1})`)
    options.push(`Spring (${year + 1})`)
    options.push(`Fall (${year})`)
  }

  return options
}

const YEAR_OPTIONS = generateYearOptions()

// Bed options with special labels for 1-4
const BED_OPTIONS = [
  { value: "1", label: "1 Single" },
  { value: "2", label: "2 Double" },
  { value: "3", label: "3 Triple" },
  { value: "4", label: "4 Quad" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
]

// Kitchen count options
const KITCHEN_COUNT_OPTIONS = [
  { value: "one", label: "One" },
  { value: "more", label: "More than one" },
]

// Game room count options
const GAME_ROOM_COUNT_OPTIONS = [
  { value: "one", label: "One" },
  { value: "more", label: "More than one" },
]

const formSchema = z.object({
  hasOtherPhotos: z.enum(["yes", "no"], { message: "Please select whether you have other dorm photos to upload." }),
  photos: z.any().optional(), // This is just a placeholder for the form context
  videos: z.any().optional(), // This is just a placeholder for the form context
  plaquePhoto: z.any().optional(), // This is just a placeholder for the form context
  schoolName: z.string().min(2, { message: "School name must be at least 2 characters." }),
  campusName: z.string().optional(),
  dormBuilding: z.string().min(2, { message: "Dorm/Building name must be at least 2 characters." }),
  floor: z.string().min(1, { message: "Floor information must be at least 1 character." }),
  year: z.string().optional(),
  
  // Occupants and room structure
  primaryRoomOccupants: z.string().optional(),
  subRoomOccupants: z.string().min(1, { message: "Please enter the number of occupants in your room." }),
  primaryRoomNumber: z.string().optional(),
  subRoomNumber: z.string().min(1, { message: "Please enter your room letter/number." }),
  
  studentEmail: z.string().email({ message: "Please enter a valid student email address." }),

  // Private Bathroom fields - changed to count
  privateBathroomCount: z.string().min(1, { message: "Please enter the number of private bathrooms (0 if none)." }),
  bathroomPhotos: z.any().optional(),
  bathroomVideos: z.any().optional(),

  // Private Common space fields
  hasCommonSpace: z.enum(["yes", "no"], { message: "Please select whether you have a private common space." }),
  commonSpacePhotos: z.any().optional(),
  commonSpaceVideos: z.any().optional(),

  // Private Kitchen fields
  hasPrivateKitchen: z.enum(["yes", "no"], { message: "Please select whether you have a private kitchen." }),
  kitchenPhotos: z.any().optional(),
  kitchenVideos: z.any().optional(),

  // Public Bathroom fields
  hasPublicBathroom: z.enum(["yes", "no"], { message: "Please select whether you have a public bathroom." }),
  publicBathroomFloors: z.array(z.string()).optional(),
  publicBathroomPhotos: z.any().optional(),
  publicBathroomVideos: z.any().optional(),

  // Public Common space fields
  hasPublicCommonSpace: z.enum(["yes", "no"], { message: "Please select whether you have a public common space." }),
  publicCommonSpaceFloors: z.array(z.string()).optional(),
  publicCommonSpacePhotos: z.any().optional(),
  publicCommonSpaceVideos: z.any().optional(),

  // Public Kitchen fields
  hasPublicKitchen: z.enum(["yes", "no"], { message: "Please select whether you have a public kitchen." }),
  publicKitchenCount: z.string().optional(),
  publicKitchenFloors: z.array(z.string()).optional(),
  publicKitchenPhotos: z.any().optional(),
  publicKitchenVideos: z.any().optional(),

  // Public Game Room fields
  hasPublicGameRoom: z.enum(["yes", "no"], { message: "Please select whether you have a public game room." }),
  publicGameRoomCount: z.string().optional(),
  publicGameRoomExactCount: z.string().optional(),
  publicGameRoomFloors: z.array(z.string()).optional(),
  publicGameRoomPhotos: z.any().optional(),
  publicGameRoomVideos: z.any().optional(),

  // Always visible fields
  amenities: z.string().optional(),
  comments: z.string().optional(),
})

export default function ContactForm() {
  const searchParams = useSearchParams()
  const schoolFromQuery = useMemo(() => {
    const raw = searchParams.get("school")
    if (!raw) return ""
    try {
      return decodeURIComponent(raw).trim()
    } catch {
      return raw.trim()
    }
  }, [searchParams])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploadedVideos, setUploadedVideos] = useState<File[]>([])
  const [videoNames, setVideoNames] = useState<string[]>([])
  const [uploadedPlaquePhoto, setUploadedPlaquePhoto] = useState<File | null>(null)
  const [plaquePreviews, setPlaquePreviews] = useState<string[]>([])

  // State for bathroom uploads
  const [bathroomImages, setBathroomImages] = useState<File[]>([])
  const [bathroomImagePreviews, setBathroomImagePreviews] = useState<string[]>([])
  const [bathroomVideos, setBathroomVideos] = useState<File[]>([])
  const [bathroomVideoNames, setBathroomVideoNames] = useState<string[]>([])

  // State for common space uploads
  const [commonSpaceImages, setCommonSpaceImages] = useState<File[]>([])
  const [commonSpaceImagePreviews, setCommonSpaceImagePreviews] = useState<string[]>([])
  const [commonSpaceVideos, setCommonSpaceVideos] = useState<File[]>([])
  const [commonSpaceVideoNames, setCommonSpaceVideoNames] = useState<string[]>([])

  // State for kitchen uploads
  const [kitchenImages, setKitchenImages] = useState<File[]>([])
  const [kitchenImagePreviews, setKitchenImagePreviews] = useState<string[]>([])
  const [kitchenVideos, setKitchenVideos] = useState<File[]>([])
  const [kitchenVideoNames, setKitchenVideoNames] = useState<string[]>([])

  // State for public bathroom uploads
  const [publicBathroomImages, setPublicBathroomImages] = useState<File[]>([])
  const [publicBathroomImagePreviews, setPublicBathroomImagePreviews] = useState<string[]>([])
  const [publicBathroomVideos, setPublicBathroomVideos] = useState<File[]>([])
  const [publicBathroomVideoNames, setPublicBathroomVideoNames] = useState<string[]>([])

  // State for public common space uploads
  const [publicCommonSpaceImages, setPublicCommonSpaceImages] = useState<File[]>([])
  const [publicCommonSpaceImagePreviews, setPublicCommonSpaceImagePreviews] = useState<string[]>([])
  const [publicCommonSpaceVideos, setPublicCommonSpaceVideos] = useState<File[]>([])
  const [publicCommonSpaceVideoNames, setPublicCommonSpaceVideoNames] = useState<string[]>([])

  // State for public kitchen uploads
  const [publicKitchenImages, setPublicKitchenImages] = useState<File[]>([])
  const [publicKitchenImagePreviews, setPublicKitchenImagePreviews] = useState<string[]>([])
  const [publicKitchenVideos, setPublicKitchenVideos] = useState<File[]>([])
  const [publicKitchenVideoNames, setPublicKitchenVideoNames] = useState<string[]>([])

  // State for public kitchen floors
  const [kitchenFloors, setKitchenFloors] = useState<string[]>([""])

  // State for public bathroom floors
  const [bathroomFloors, setBathroomFloors] = useState<string[]>([""])

  // State for public common space floors
  const [commonSpaceFloors, setCommonSpaceFloors] = useState<string[]>([""])

  // State for public game room uploads
  const [publicGameRoomImages, setPublicGameRoomImages] = useState<File[]>([])
  const [publicGameRoomImagePreviews, setPublicGameRoomImagePreviews] = useState<string[]>([])
  const [publicGameRoomVideos, setPublicGameRoomVideos] = useState<File[]>([])
  const [publicGameRoomVideoNames, setPublicGameRoomVideoNames] = useState<string[]>([])

  // State for public game room floors
  const [gameRoomFloors, setGameRoomFloors] = useState<string[]>([""])

  // Refs for file inputs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const plaqueInputRef = useRef<HTMLInputElement>(null)
  const bathroomImageInputRef = useRef<HTMLInputElement>(null)
  const bathroomVideoInputRef = useRef<HTMLInputElement>(null)
  const commonSpaceImageInputRef = useRef<HTMLInputElement>(null)
  const commonSpaceVideoInputRef = useRef<HTMLInputElement>(null)
  const kitchenImageInputRef = useRef<HTMLInputElement>(null)
  const kitchenVideoInputRef = useRef<HTMLInputElement>(null)
  const publicBathroomImageInputRef = useRef<HTMLInputElement>(null)
  const publicBathroomVideoInputRef = useRef<HTMLInputElement>(null)
  const publicCommonSpaceImageInputRef = useRef<HTMLInputElement>(null)
  const publicCommonSpaceVideoInputRef = useRef<HTMLInputElement>(null)
  const publicKitchenImageInputRef = useRef<HTMLInputElement>(null)
  const publicKitchenVideoInputRef = useRef<HTMLInputElement>(null)
  const publicGameRoomImageInputRef = useRef<HTMLInputElement>(null)
  const publicGameRoomVideoInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasOtherPhotos: undefined,
      photos: undefined,
      videos: undefined,
      plaquePhoto: undefined,
      schoolName: schoolFromQuery,
      campusName: "",
      dormBuilding: "",
      floor: "",
      year: "",
      primaryRoomOccupants: "",
      subRoomOccupants: "",
      primaryRoomNumber: "",
      subRoomNumber: "",
      studentEmail: "",
      privateBathroomCount: "",
      bathroomPhotos: undefined,
      bathroomVideos: undefined,
      hasCommonSpace: undefined,
      commonSpacePhotos: undefined,
      commonSpaceVideos: undefined,
      hasPrivateKitchen: undefined,
      kitchenPhotos: undefined,
      kitchenVideos: undefined,
      hasPublicBathroom: undefined,
      publicBathroomFloors: [bathroomFloors[0]],
      publicBathroomPhotos: undefined,
      publicBathroomVideos: undefined,
      hasPublicCommonSpace: undefined,
      publicCommonSpaceFloors: [commonSpaceFloors[0]],
      publicCommonSpacePhotos: undefined,
      publicCommonSpaceVideos: undefined,
      hasPublicKitchen: undefined,
      publicKitchenCount: undefined,
      publicKitchenFloors: [kitchenFloors[0]],
      publicKitchenPhotos: undefined,
      publicKitchenVideos: undefined,
      hasPublicGameRoom: undefined,
      publicGameRoomCount: undefined,
      publicGameRoomExactCount: "",
      publicGameRoomFloors: [gameRoomFloors[0]],
      publicGameRoomPhotos: undefined,
      publicGameRoomVideos: undefined,
      amenities: "",
      comments: "",
    },
  })

  // Watch form values for conditional rendering
  const hasOtherPhotos = form.watch("hasOtherPhotos")
  const privateBathroomCount = form.watch("privateBathroomCount")
  const hasCommonSpace = form.watch("hasCommonSpace")
  const hasPrivateKitchen = form.watch("hasPrivateKitchen")
  const hasPublicBathroom = form.watch("hasPublicBathroom")
  const hasPublicCommonSpace = form.watch("hasPublicCommonSpace")
  const hasPublicKitchen = form.watch("hasPublicKitchen")
  const publicKitchenCount = form.watch("publicKitchenCount")
  const hasPublicGameRoom = form.watch("hasPublicGameRoom")
  const publicGameRoomCount = form.watch("publicGameRoomCount")

  // Add a kitchen floor input
  const addKitchenFloor = () => {
    setKitchenFloors([...kitchenFloors, ""])
    form.setValue("publicKitchenFloors", [...kitchenFloors, ""])
  }

  // Remove a kitchen floor input
  const removeKitchenFloor = (index: number) => {
    const newFloors = [...kitchenFloors]
    newFloors.splice(index, 1)
    setKitchenFloors(newFloors)
    form.setValue("publicKitchenFloors", newFloors)
  }

  // Update a kitchen floor input
  const updateKitchenFloor = (index: number, value: string) => {
    const newFloors = [...kitchenFloors]
    newFloors[index] = value
    setKitchenFloors(newFloors)
    form.setValue("publicKitchenFloors", newFloors)
  }

  // Add a bathroom floor input
  const addBathroomFloor = () => {
    setBathroomFloors([...bathroomFloors, ""])
    form.setValue("publicBathroomFloors", [...bathroomFloors, ""])
  }

  // Remove a bathroom floor input
  const removeBathroomFloor = (index: number) => {
    const newFloors = [...bathroomFloors]
    newFloors.splice(index, 1)
    setBathroomFloors(newFloors)
    form.setValue("publicBathroomFloors", newFloors)
  }

  // Update a bathroom floor input
  const updateBathroomFloor = (index: number, value: string) => {
    const newFloors = [...bathroomFloors]
    newFloors[index] = value
    setBathroomFloors(newFloors)
    form.setValue("publicBathroomFloors", newFloors)
  }

  // Add a common space floor input
  const addCommonSpaceFloor = () => {
    setCommonSpaceFloors([...commonSpaceFloors, ""])
    form.setValue("publicCommonSpaceFloors", [...commonSpaceFloors, ""])
  }

  // Remove a common space floor input
  const removeCommonSpaceFloor = (index: number) => {
    const newFloors = [...commonSpaceFloors]
    newFloors.splice(index, 1)
    setCommonSpaceFloors(newFloors)
    form.setValue("publicCommonSpaceFloors", newFloors)
  }

  // Update a common space floor input
  const updateCommonSpaceFloor = (index: number, value: string) => {
    const newFloors = [...commonSpaceFloors]
    newFloors[index] = value
    setCommonSpaceFloors(newFloors)
    form.setValue("publicCommonSpaceFloors", newFloors)
  }

  // Add a game room floor input
  const addGameRoomFloor = () => {
    setGameRoomFloors([...gameRoomFloors, ""])
    form.setValue("publicGameRoomFloors", [...gameRoomFloors, ""])
  }

  // Remove a game room floor input
  const removeGameRoomFloor = (index: number) => {
    const newFloors = [...gameRoomFloors]
    newFloors.splice(index, 1)
    setGameRoomFloors(newFloors)
    form.setValue("publicGameRoomFloors", newFloors)
  }

  // Update a game room floor input
  const updateGameRoomFloor = (index: number, value: string) => {
    const newFloors = [...gameRoomFloors]
    newFloors[index] = value
    setGameRoomFloors(newFloors)
    form.setValue("publicGameRoomFloors", newFloors)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: File[] = []
    const newPreviewUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported image type. Please upload JPG, PNG, or WebP images.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      newFiles.push(file)
      newPreviewUrls.push(URL.createObjectURL(file))
    }

    setUploadedImages([...uploadedImages, ...newFiles])
    setPreviewUrls([...previewUrls, ...newPreviewUrls])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newVideos: File[] = []
    const newVideoNames: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported video type. Please upload MP4, MOV, AVI, or WebM videos.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`)
        continue
      }

      newVideos.push(file)
      newVideoNames.push(file.name)
    }

    setUploadedVideos([...uploadedVideos, ...newVideos])
    setVideoNames([...videoNames, ...newVideoNames])

    // Reset the video input
    if (videoInputRef.current) {
      videoInputRef.current.value = ""
    }
  }

  const handlePlaqueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0] // Only take the first file for plaque photo

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      alert(`File ${file.name} is not a supported image type. Please upload JPG, PNG, or WebP images.`)
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`File ${file.name} is too large. Maximum size is 5MB.`)
      return
    }

    // Clean up previous preview if exists
    if (plaquePreviews.length > 0) {
      URL.revokeObjectURL(plaquePreviews[0])
    }

    setUploadedPlaquePhoto(file)
    setPlaquePreviews([URL.createObjectURL(file)])

    // Reset the plaque input
    if (plaqueInputRef.current) {
      plaqueInputRef.current.value = ""
    }
  }

  // Handler for bathroom image uploads
  const handleBathroomImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: File[] = []
    const newPreviewUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported image type. Please upload JPG, PNG, or WebP images.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      newFiles.push(file)
      newPreviewUrls.push(URL.createObjectURL(file))
    }

    setBathroomImages([...bathroomImages, ...newFiles])
    setBathroomImagePreviews([...bathroomImagePreviews, ...newPreviewUrls])

    // Reset the file input
    if (bathroomImageInputRef.current) {
      bathroomImageInputRef.current.value = ""
    }
  }

  // Handler for bathroom video uploads
  const handleBathroomVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newVideos: File[] = []
    const newVideoNames: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported video type. Please upload MP4, MOV, AVI, or WebM videos.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`)
        continue
      }

      newVideos.push(file)
      newVideoNames.push(file.name)
    }

    setBathroomVideos([...bathroomVideos, ...newVideos])
    setBathroomVideoNames([...bathroomVideoNames, ...newVideoNames])

    // Reset the video input
    if (bathroomVideoInputRef.current) {
      bathroomVideoInputRef.current.value = ""
    }
  }

  // Handler for common space image uploads
  const handleCommonSpaceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: File[] = []
    const newPreviewUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported image type. Please upload JPG, PNG, or WebP images.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      newFiles.push(file)
      newPreviewUrls.push(URL.createObjectURL(file))
    }

    setCommonSpaceImages([...commonSpaceImages, ...newFiles])
    setCommonSpaceImagePreviews([...commonSpaceImagePreviews, ...newPreviewUrls])

    // Reset the file input
    if (commonSpaceImageInputRef.current) {
      commonSpaceImageInputRef.current.value = ""
    }
  }

  // Handler for common space video uploads
  const handleCommonSpaceVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newVideos: File[] = []
    const newVideoNames: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported video type. Please upload MP4, MOV, AVI, or WebM videos.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`)
        continue
      }

      newVideos.push(file)
      newVideoNames.push(file.name)
    }

    setCommonSpaceVideos([...commonSpaceVideos, ...newVideos])
    setCommonSpaceVideoNames([...commonSpaceVideoNames, ...newVideoNames])

    // Reset the video input
    if (commonSpaceVideoInputRef.current) {
      commonSpaceVideoInputRef.current.value = ""
    }
  }

  // Handler for kitchen image uploads
  const handleKitchenImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: File[] = []
    const newPreviewUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported image type. Please upload JPG, PNG, or WebP images.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      newFiles.push(file)
      newPreviewUrls.push(URL.createObjectURL(file))
    }

    setKitchenImages([...kitchenImages, ...newFiles])
    setKitchenImagePreviews([...kitchenImagePreviews, ...newPreviewUrls])

    // Reset the file input
    if (kitchenImageInputRef.current) {
      kitchenImageInputRef.current.value = ""
    }
  }

  // Handler for kitchen video uploads
  const handleKitchenVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newVideos: File[] = []
    const newVideoNames: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported video type. Please upload MP4, MOV, AVI, or WebM videos.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`)
        continue
      }

      newVideos.push(file)
      newVideoNames.push(file.name)
    }

    setKitchenVideos([...kitchenVideos, ...newVideos])
    setKitchenVideoNames([...kitchenVideoNames, ...newVideoNames])

    // Reset the video input
    if (kitchenVideoInputRef.current) {
      kitchenVideoInputRef.current.value = ""
    }
  }

  // Remove kitchen video
  const removeKitchenVideoFn = (index: number) => {
    const newVideos = [...kitchenVideos]
    const newVideoNames = [...kitchenVideoNames]

    newVideos.splice(index, 1)
    newVideoNames.splice(index, 1)

    setKitchenVideos(newVideos)
    setKitchenVideoNames(newVideoNames)
  }

  // Handler for public bathroom image uploads
  const handlePublicBathroomImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: File[] = []
    const newPreviewUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported image type. Please upload JPG, PNG, or WebP images.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      newFiles.push(file)
      newPreviewUrls.push(URL.createObjectURL(file))
    }

    setPublicBathroomImages([...publicBathroomImages, ...newFiles])
    setPublicBathroomImagePreviews([...publicBathroomImagePreviews, ...newPreviewUrls])

    // Reset the file input
    if (publicBathroomImageInputRef.current) {
      publicBathroomImageInputRef.current.value = ""
    }
  }

  // Handler for public bathroom video uploads
  const handlePublicBathroomVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newVideos: File[] = []
    const newVideoNames: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported video type. Please upload MP4, MOV, AVI, or WebM videos.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`)
        continue
      }

      newVideos.push(file)
      newVideoNames.push(file.name)
    }

    setPublicBathroomVideos([...publicBathroomVideos, ...newVideos])
    setPublicBathroomVideoNames([...publicBathroomVideoNames, ...newVideoNames])

    // Reset the video input
    if (publicBathroomVideoInputRef.current) {
      publicBathroomVideoInputRef.current.value = ""
    }
  }

  // Handler for public common space image uploads
  const handlePublicCommonSpaceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: File[] = []
    const newPreviewUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported image type. Please upload JPG, PNG, or WebP images.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      newFiles.push(file)
      newPreviewUrls.push(URL.createObjectURL(file))
    }

    setPublicCommonSpaceImages([...publicCommonSpaceImages, ...newFiles])
    setPublicCommonSpaceImagePreviews([...publicCommonSpaceImagePreviews, ...newPreviewUrls])

    // Reset the file input
    if (publicCommonSpaceImageInputRef.current) {
      publicCommonSpaceImageInputRef.current.value = ""
    }
  }

  // Handler for public common space video uploads
  const handlePublicCommonSpaceVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newVideos: File[] = []
    const newVideoNames: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported video type. Please upload MP4, MOV, AVI, or WebM videos.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`)
        continue
      }

      newVideos.push(file)
      newVideoNames.push(file.name)
    }

    setPublicCommonSpaceVideos([...publicCommonSpaceVideos, ...newVideos])
    setPublicCommonSpaceVideoNames([...publicCommonSpaceVideoNames, ...newVideoNames])

    // Reset the video input
    if (publicCommonSpaceVideoInputRef.current) {
      publicCommonSpaceVideoInputRef.current.value = ""
    }
  }

  // Handler for public kitchen image uploads
  const handlePublicKitchenImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: File[] = []
    const newPreviewUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported image type. Please upload JPG, PNG, or WebP images.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      newFiles.push(file)
      newPreviewUrls.push(URL.createObjectURL(file))
    }

    setPublicKitchenImages([...publicKitchenImages, ...newFiles])
    setPublicKitchenImagePreviews([...publicKitchenImagePreviews, ...newPreviewUrls])

    // Reset the file input
    if (publicKitchenImageInputRef.current) {
      publicKitchenImageInputRef.current.value = ""
    }
  }

  // Handler for public kitchen video uploads
  const handlePublicKitchenVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newVideos: File[] = []
    const newVideoNames: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported video type. Please upload MP4, MOV, AVI, or WebM videos.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`)
        continue
      }

      newVideos.push(file)
      newVideoNames.push(file.name)
    }

    setPublicKitchenVideos([...publicKitchenVideos, ...newVideos])
    setPublicKitchenVideoNames([...publicKitchenVideoNames, ...newVideoNames])

    // Reset the video input
    if (publicKitchenVideoInputRef.current) {
      publicKitchenVideoInputRef.current.value = ""
    }
  }

  // Handler for public game room image uploads
  const handlePublicGameRoomImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: File[] = []
    const newPreviewUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported image type. Please upload JPG, PNG, or WebP images.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      newFiles.push(file)
      newPreviewUrls.push(URL.createObjectURL(file))
    }

    setPublicGameRoomImages([...publicGameRoomImages, ...newFiles])
    setPublicGameRoomImagePreviews([...publicGameRoomImagePreviews, ...newPreviewUrls])

    // Reset the file input
    if (publicGameRoomImageInputRef.current) {
      publicGameRoomImageInputRef.current.value = ""
    }
  }

  // Handler for public game room video uploads
  const handlePublicGameRoomVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newVideos: File[] = []
    const newVideoNames: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not a supported video type. Please upload MP4, MOV, AVI, or WebM videos.`)
        continue
      }

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`)
        continue
      }

      newVideos.push(file)
      newVideoNames.push(file.name)
    }

    setPublicGameRoomVideos([...publicGameRoomVideos, ...newVideos])
    setPublicGameRoomVideoNames([...publicGameRoomVideoNames, ...newVideoNames])

    // Reset the video input
    if (publicGameRoomVideoInputRef.current) {
      publicGameRoomVideoInputRef.current.value = ""
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages]
    const newPreviewUrls = [...previewUrls]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])

    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setUploadedImages(newImages)
    setPreviewUrls(newPreviewUrls)
  }

  const removeVideo = (index: number) => {
    const newVideos = [...uploadedVideos]
    const newVideoNames = [...videoNames]

    newVideos.splice(index, 1)
    newVideoNames.splice(index, 1)

    setUploadedVideos(newVideos)
    setVideoNames(newVideoNames)
  }

  const removePlaquePhoto = () => {
    if (plaquePreviews.length > 0) {
      URL.revokeObjectURL(plaquePreviews[0])
    }
    setUploadedPlaquePhoto(null)
    setPlaquePreviews([])
  }

  // Remove bathroom image
  const removeBathroomImage = (index: number) => {
    const newImages = [...bathroomImages]
    const newPreviewUrls = [...bathroomImagePreviews]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])

    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setBathroomImages(newImages)
    setBathroomImagePreviews(newPreviewUrls)
  }

  // Remove bathroom video
  const removeBathroomVideo = (index: number) => {
    const newVideos = [...bathroomVideos]
    const newVideoNames = [...bathroomVideoNames]

    newVideos.splice(index, 1)
    newVideoNames.splice(index, 1)

    setBathroomVideos(newVideos)
    setBathroomVideoNames(newVideoNames)
  }

  // Remove common space image
  const removeCommonSpaceImage = (index: number) => {
    const newImages = [...commonSpaceImages]
    const newPreviewUrls = [...commonSpaceImagePreviews]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])

    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setCommonSpaceImages(newImages)
    setCommonSpaceImagePreviews(newPreviewUrls)
  }

  // Remove common space video
  const removeCommonSpaceVideo = (index: number) => {
    const newVideos = [...commonSpaceVideos]
    const newVideoNames = [...commonSpaceVideoNames]

    newVideos.splice(index, 1)
    newVideoNames.splice(index, 1)

    setCommonSpaceVideos(newVideos)
    setCommonSpaceVideoNames(newVideoNames)
  }

  // Remove kitchen image
  const removeKitchenImage = (index: number) => {
    const newImages = [...kitchenImages]
    const newPreviewUrls = [...kitchenImagePreviews]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])

    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setKitchenImages(newImages)
    setKitchenImagePreviews(newPreviewUrls)
  }

  // Remove kitchen video
  const removePublicKitchenVideo = (index: number) => {
    const newVideos = [...kitchenVideos]
    const newVideoNames = [...kitchenVideoNames]

    newVideos.splice(index, 1)
    newVideoNames.splice(index, 1)

    setKitchenVideos(newVideos)
    setKitchenVideoNames(newVideoNames)
  }

  // Remove public kitchen image
  const removePublicKitchenImage = (index: number) => {
    const newImages = [...publicKitchenImages]
    const newPreviewUrls = [...publicKitchenImagePreviews]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])

    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setPublicKitchenImages(newImages)
    setPublicKitchenImagePreviews(newPreviewUrls)
  }

  // Remove public kitchen video
  const removePublicKitchenVideoFn = (index: number) => {
    const newVideos = [...publicKitchenVideos]
    const newVideoNames = [...publicKitchenVideoNames]

    newVideos.splice(index, 1)
    newVideoNames.splice(index, 1)

    setPublicKitchenVideos(newVideos)
    setPublicKitchenVideoNames(newVideoNames)
  }

  // Remove public bathroom image
  const removePublicBathroomImage = (index: number) => {
    const newImages = [...publicBathroomImages]
    const newPreviewUrls = [...publicBathroomImagePreviews]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])

    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setPublicBathroomImages(newImages)
    setPublicBathroomImagePreviews(newPreviewUrls)
  }

  // Remove public bathroom video
  const removePublicBathroomVideo = (index: number) => {
    const newVideos = [...publicBathroomVideos]
    const newVideoNames = [...publicBathroomVideoNames]

    newVideos.splice(index, 1)
    newVideoNames.splice(index, 1)

    setPublicBathroomVideos(newVideos)
    setPublicBathroomVideoNames(newVideoNames)
  }

  // Remove public common space image
  const removePublicCommonSpaceImage = (index: number) => {
    const newImages = [...publicCommonSpaceImages]
    const newPreviewUrls = [...publicCommonSpaceImagePreviews]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])

    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setPublicCommonSpaceImages(newImages)
    setPublicCommonSpaceImagePreviews(newPreviewUrls)
  }

  // Remove public common space video
  const removePublicCommonSpaceVideo = (index: number) => {
    const newVideos = [...publicCommonSpaceVideos]
    const newVideoNames = [...publicCommonSpaceVideoNames]

    newVideos.splice(index, 1)
    newVideoNames.splice(index, 1)

    setPublicCommonSpaceVideos(newVideos)
    setPublicCommonSpaceVideoNames(newVideoNames)
  }

  // Remove public game room image
  const removePublicGameRoomImage = (index: number) => {
    const newImages = [...publicGameRoomImages]
    const newPreviewUrls = [...publicGameRoomImagePreviews]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])

    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setPublicGameRoomImages(newImages)
    setPublicGameRoomImagePreviews(newPreviewUrls)
  }

  // Remove public game room video
  const removePublicGameRoomVideo = (index: number) => {
    const newVideos = [...publicGameRoomVideos]
    const newVideoNames = [...publicGameRoomVideoNames]

    newVideos.splice(index, 1)
    newVideoNames.splice(index, 1)

    setPublicGameRoomVideos(newVideos)
    setPublicGameRoomVideoNames(newVideoNames)
  }

  // Test function to verify server connection
  const testServerConnection = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent any form submission
    e.stopPropagation(); // Stop event bubbling
    
    try {
      console.log('🧪 Testing server connection...');
      const response = await fetch('http://localhost:3001/test');
      const result = await response.json();
      console.log('✅ Server test successful:', result);
      alert('Server connection successful!');
    } catch (error) {
      console.error('❌ Server test failed:', error);
      alert('Server connection failed. Make sure the server is running on port 3001.');
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Create FormData to handle file uploads
    const formData = new FormData()

    // Add form values to FormData
    Object.entries(values).forEach(([key, value]) => {
      if (
        key !== "photos" &&
        key !== "videos" &&
        key !== "plaquePhoto" &&
        key !== "bathroomPhotos" &&
        key !== "bathroomVideos" &&
        key !== "commonSpacePhotos" &&
        key !== "commonSpaceVideos" &&
        key !== "kitchenPhotos" &&
        key !== "kitchenVideos" &&
        key !== "publicBathroomPhotos" &&
        key !== "publicBathroomVideos" &&
        key !== "publicCommonSpacePhotos" &&
        key !== "publicCommonSpaceVideos" &&
        key !== "publicKitchenPhotos" &&
        key !== "publicKitchenVideos" &&
        key !== "publicKitchenFloors" &&
        key !== "publicGameRoomPhotos" &&
        key !== "publicGameRoomVideos" &&
        key !== "publicGameRoomFloors"
      ) {
        // Skip the media fields and array fields as we handle them separately
        formData.append(key, value as string)
      }
    })

    // Add kitchen floors to FormData
    kitchenFloors.forEach((floor, index) => {
      formData.append(`publicKitchenFloor-${index}`, floor)
    })

    // Add game room floors to FormData
    gameRoomFloors.forEach((floor, index) => {
      formData.append(`publicGameRoomFloor-${index}`, floor)
    })

    // Add images to FormData
    uploadedImages.forEach((file, index) => {
      formData.append(`image-${index}`, file)
    })

    // Add videos to FormData
    uploadedVideos.forEach((file, index) => {
      formData.append(`video-${index}`, file)
    })

    // Add plaque photo to FormData
    if (uploadedPlaquePhoto) {
      formData.append("plaque-photo", uploadedPlaquePhoto)
    }

    // Add bathroom images to FormData
    bathroomImages.forEach((file, index) => {
      formData.append(`bathroom-image-${index}`, file)
    })

    // Add bathroom videos to FormData
    bathroomVideos.forEach((file, index) => {
      formData.append(`bathroom-video-${index}`, file)
    })

    // Add common space images to FormData
    commonSpaceImages.forEach((file, index) => {
      formData.append(`common-space-image-${index}`, file)
    })

    // Add common space videos to FormData
    commonSpaceVideos.forEach((file, index) => {
      formData.append(`common-space-video-${index}`, file)
    })

    // Add kitchen images to FormData
    kitchenImages.forEach((file, index) => {
      formData.append(`kitchen-image-${index}`, file)
    })

    // Add kitchen videos to FormData
    kitchenVideos.forEach((file, index) => {
      formData.append(`kitchen-video-${index}`, file)
    })

    // Add public bathroom images to FormData
    publicBathroomImages.forEach((file, index) => {
      formData.append(`public-bathroom-image-${index}`, file)
    })

    // Add public bathroom videos to FormData
    publicBathroomVideos.forEach((file, index) => {
      formData.append(`public-bathroom-video-${index}`, file)
    })

    // Add public common space images to FormData
    publicCommonSpaceImages.forEach((file, index) => {
      formData.append(`public-common-space-image-${index}`, file)
    })

    // Add public common space videos to FormData
    publicCommonSpaceVideos.forEach((file, index) => {
      formData.append(`public-common-space-video-${index}`, file)
    })

    // Add public kitchen images to FormData
    publicKitchenImages.forEach((file, index) => {
      formData.append(`public-kitchen-image-${index}`, file)
    })

    // Add public kitchen videos to FormData
    publicKitchenVideos.forEach((file, index) => {
      formData.append(`public-kitchen-video-${index}`, file)
    })

    // Add public game room images to FormData
    publicGameRoomImages.forEach((file, index) => {
      formData.append(`public-game-room-image-${index}`, file)
    })

    // Add public game room videos to FormData
    publicGameRoomVideos.forEach((file, index) => {
      formData.append(`public-game-room-video-${index}`, file)
    })

    try {
      console.log('🚀 Starting form submission...');
      
      // Check file sizes before sending
      let totalSize = 0;
      const maxFileSize = 50 * 1024 * 1024; // 50MB
      const files = [
        ...uploadedImages,
        ...uploadedVideos,
        ...bathroomImages,
        ...bathroomVideos,
        ...commonSpaceImages,
        ...commonSpaceVideos,
        ...kitchenImages,
        ...kitchenVideos,
        ...publicBathroomImages,
        ...publicBathroomVideos,
        ...publicCommonSpaceImages,
        ...publicCommonSpaceVideos,
        ...publicKitchenImages,
        ...publicKitchenVideos,
        ...publicGameRoomImages,
        ...publicGameRoomVideos
      ].filter(Boolean);
      
      for (const file of files) {
        if (file && file.size) {
          totalSize += file.size;
          if (file.size > maxFileSize) {
            throw new Error(`File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 50MB.`);
          }
        }
      }
      
      console.log(`📊 Total upload size: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
      console.log('📤 FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Response not OK:', errorData);
        
        if (errorData.code === 'FILE_TOO_LARGE') {
          throw new Error(`File too large: ${errorData.details}`);
        } else if (errorData.code === 'UNEXPECTED_FILE') {
          throw new Error(`Unexpected file: ${errorData.details}`);
        } else {
          throw new Error(`Upload failed: ${response.status} - ${errorData.error || errorData.details || 'Unknown error'}`);
        }
      }

      const result = await response.json();
      console.log('✅ Upload success:', result);

      // Reset the form
      form.reset()

      // Clean up preview URLs
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
      if (plaquePreviews.length > 0) {
        URL.revokeObjectURL(plaquePreviews[0])
      }
      bathroomImagePreviews.forEach((url) => URL.revokeObjectURL(url))
      commonSpaceImagePreviews.forEach((url) => URL.revokeObjectURL(url))
      kitchenImagePreviews.forEach((url) => URL.revokeObjectURL(url))
      publicBathroomImagePreviews.forEach((url) => URL.revokeObjectURL(url))
      publicCommonSpaceImagePreviews.forEach((url) => URL.revokeObjectURL(url))
      publicKitchenImagePreviews.forEach((url) => URL.revokeObjectURL(url))
      publicGameRoomImagePreviews.forEach((url) => URL.revokeObjectURL(url))

      // Reset all state
      setUploadedImages([])
      setPreviewUrls([])
      setUploadedVideos([])
      setVideoNames([])
      setUploadedPlaquePhoto(null)
      setPlaquePreviews([])
      setBathroomImages([])
      setBathroomImagePreviews([])
      setBathroomVideos([])
      setBathroomVideoNames([])
      setCommonSpaceImages([])
      setCommonSpaceImagePreviews([])
      setCommonSpaceVideos([])
      setCommonSpaceVideoNames([])
      setKitchenImages([])
      setKitchenImagePreviews([])
      setKitchenVideos([])
      setKitchenVideoNames([])
      setPublicBathroomImages([])
      setPublicBathroomImagePreviews([])
      setPublicBathroomVideos([])
      setPublicBathroomVideoNames([])
      setPublicCommonSpaceImages([])
      setPublicCommonSpaceImagePreviews([])
      setPublicCommonSpaceVideos([])
      setPublicCommonSpaceVideoNames([])
      setPublicKitchenImages([])
      setPublicKitchenImagePreviews([])
      setPublicKitchenVideos([])
      setPublicKitchenVideoNames([])
      setKitchenFloors([""])
      setPublicGameRoomImages([])
      setPublicGameRoomImagePreviews([])
      setPublicGameRoomVideos([])
      setPublicGameRoomVideoNames([])
      setGameRoomFloors([""])

      alert("Thank you for your submission. We'll get back to you soon!")

    } catch (error) {
      console.error('Upload error:', error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Helper function to render image preview grid
  const renderImagePreviewGrid = (images: string[], onRemove: (index: number) => void) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-md overflow-hidden border border-border">
              <img
                src={url || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>
          </div>
        ))}
      </div>
    )
  }

  // Helper function to render video list
  const renderVideoList = (videoNames: string[], onRemove: (index: number) => void) => {
    return (
      <div className="space-y-2 mb-4">
        {videoNames.map((name, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-md">
            <div className="flex items-center">
              <Film className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-sm truncate max-w-[200px] sm:max-w-[300px]">{name}</span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    )
  }

  // Helper function to render image upload
  const renderImageUpload = (
    id: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    inputRef: React.RefObject<HTMLInputElement>,
    count: number,
  ) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={id}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-secondary/50 border-border"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-1 text-sm text-foreground font-medium">Click to upload photos</p>
              <p className="text-xs text-muted-foreground">or drag and drop</p>
            </div>
            <input
              id={id}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              multiple
              onChange={onChange}
              ref={inputRef}
            />
          </label>
        </div>
        <div className="text-sm text-muted-foreground">
          {count > 0 ? (
            <p>
              {count} photo{count !== 1 ? "s" : ""} selected
            </p>
          ) : (
            <p>No photos selected</p>
          )}
        </div>
      </div>
    )
  }

  // Helper function to render video upload
  const renderVideoUpload = (
    id: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    inputRef: React.RefObject<HTMLInputElement>,
    count: number,
  ) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={id}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-secondary/50 border-border"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Film className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-1 text-sm text-foreground font-medium">Click to upload videos</p>
              <p className="text-xs text-muted-foreground">or drag and drop</p>
            </div>
            <input
              id={id}
              type="file"
              className="hidden"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
              multiple
              onChange={onChange}
              ref={inputRef}
            />
          </label>
        </div>
        <div className="text-sm text-muted-foreground">
          {count > 0 ? (
            <p>
              {count} video{count !== 1 ? "s" : ""} selected
            </p>
          ) : (
            <p>No videos selected</p>
          )}
        </div>
      </div>
    )
  }

  // Helper function to render combined photo/video upload
  const renderCombinedUpload = (
    id: string,
    imageHandler: (e: React.ChangeEvent<HTMLInputElement>) => void,
    videoHandler: (e: React.ChangeEvent<HTMLInputElement>) => void,
    inputRef: React.RefObject<HTMLInputElement>,
    imageCount: number,
    videoCount: number,
  ) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={id}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-secondary/50 border-border"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-1 text-sm text-foreground font-medium">Click to upload photos & videos</p>
              <p className="text-xs text-muted-foreground">or drag and drop</p>
            </div>
            <input
              id={id}
              type="file"
              className="hidden"
              accept="image/*,video/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach(file => {
                  if (file.type.startsWith('image/')) {
                    imageHandler(e);
                  } else if (file.type.startsWith('video/')) {
                    videoHandler(e);
                  }
                });
              }}
              ref={inputRef}
            />
          </label>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>
            {imageCount > 0 && `${imageCount} photo${imageCount !== 1 ? "s" : ""}`}
            {imageCount > 0 && videoCount > 0 && ", "}
            {videoCount > 0 && `${videoCount} video${videoCount !== 1 ? "s" : ""}`}
            {imageCount === 0 && videoCount === 0 && "No files selected"}
            {(imageCount > 0 || videoCount > 0) && " selected"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Photos: JPG, PNG, WebP up to 5MB • Videos: MP4, MOV, AVI, WebM up to 50MB
          </p>
        </div>
      </div>
    )
  }

  return (
    <section id="share-dorm" className="bg-background py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">Let's Change Dorm Life Together</h2>
          <p className="text-lg text-muted-foreground">
            Even if your video is from five years ago, or you have only one blurry photo, as long as you remember the
            room number, you can make a difference. One photo could help reduce anxiety about moving in.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 1. School Name & Campus Name */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>School Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Boston University" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="campusName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Campus Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Main Campus" {...field} />
                      </FormControl>
                      <div className="text-sm text-muted-foreground mt-1">
                        Examples: Harvard, Business Campus, Main Campus
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 3. Dorm/Building Name */}
              <FormField
                control={form.control}
                name="dormBuilding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dorm/Building/Residence Hall *</FormLabel>
                    <FormControl>
                      <Input placeholder="Warren Towers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 4. Floor & 5. Year */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Floor *</FormLabel>
                      <FormControl>
                        <Input placeholder="3rd floor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Academic Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          {YEAR_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 5. Room Number/Letter */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Room Number/Letter</h3>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="subRoomNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Your room letter/number *</FormLabel>
                        <FormDescription>e.g. 404B or 405</FormDescription>
                        <FormControl>
                          <Input placeholder="404B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryRoomNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Shared area room/suite number (if applicable)</FormLabel>
                        <FormDescription>e.g. 404</FormDescription>
                        <FormControl>
                          <Input placeholder="404" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Room Media Upload */}
              <FormField
                control={form.control}
                name="photos"
                render={() => (
                  <FormItem>
                    <FormLabel>Your Room Photos & Videos</FormLabel>
                    <FormDescription>
                      Upload photos and videos of your specific room to help future students see what it's really like. 
                      Max 5MB per image (JPG, PNG, WebP) and 50MB per video (MP4, MOV, AVI, WebM).
                    </FormDescription>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Combined Media Preview */}
                        {previewUrls.length > 0 && renderImagePreviewGrid(previewUrls, removeImage)}
                        {videoNames.length > 0 && renderVideoList(videoNames, removeVideo)}

                        {/* Combined Upload Button */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              files.forEach(file => {
                                if (file.type.startsWith('image/')) {
                                  handleFileChange(e);
                                } else if (file.type.startsWith('video/')) {
                                  handleVideoChange(e);
                                }
                              });
                            }}
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                          />
                          <div className="space-y-2">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <div className="text-sm text-gray-600">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="font-medium text-blue-600 hover:text-blue-500"
                              >
                                Click to upload
                              </button>{' '}
                              or drag and drop
                            </div>
                            <p className="text-xs text-gray-500">
                              Photos: JPG, PNG, WebP up to 5MB each<br/>
                              Videos: MP4, MOV, AVI, WebM up to 50MB each
                            </p>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 6. Occupants Count */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Occupants Count</h3>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="subRoomOccupants"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Your room occupant count *</FormLabel>
                        <FormDescription>e.g. 2 (people in your specific room)</FormDescription>
                        <FormControl>
                          <Input type="number" min="1" placeholder="2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryRoomOccupants"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Shared area occupant count (if applicable)</FormLabel>
                        <FormDescription>e.g. 4 (total people sharing common areas)</FormDescription>
                        <FormControl>
                          <Input type="number" min="1" placeholder="4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 7. Private Bathroom Count */}
              <FormField
                control={form.control}
                name="privateBathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How many private bathrooms? *</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Private Bathroom Upload Fields */}
              {privateBathroomCount && parseInt(privateBathroomCount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 border-l-2 border-primary/20 pl-4"
                >
                  {/* Bathroom Media Upload */}
                  <FormField
                    control={form.control}
                    name="bathroomPhotos"
                    render={() => (
                      <FormItem>
                        <FormLabel>Bathroom Photos & Videos</FormLabel>
                        <FormDescription>
                          Upload photos and videos of your private bathroom.
                        </FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Combined Media Preview */}
                            {bathroomImagePreviews.length > 0 &&
                              renderImagePreviewGrid(bathroomImagePreviews, removeBathroomImage)}
                            {bathroomVideoNames.length > 0 &&
                              renderVideoList(bathroomVideoNames, removeBathroomVideo)}

                            {/* Combined Upload Button */}
                            {renderCombinedUpload(
                              "dropzone-bathroom-media",
                              handleBathroomImageChange,
                              handleBathroomVideoChange,
                              bathroomImageInputRef,
                              bathroomImages.length,
                              bathroomVideos.length,
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Common Space Question */}
              <FormField
                control={form.control}
                name="hasCommonSpace"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Have a private common space / living room / hallway *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Common Space Upload Fields */}
              {hasCommonSpace === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 border-l-2 border-primary/20 pl-4"
                >
                  {/* Common Space Media Upload */}
                  <FormField
                    control={form.control}
                    name="commonSpacePhotos"
                    render={() => (
                      <FormItem>
                        <FormLabel>Common Space / Living Room / Hallway Photos & Videos</FormLabel>
                        <FormDescription>
                          Upload photos and videos of your private common space or living room.
                        </FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Combined Media Preview */}
                            {commonSpaceImagePreviews.length > 0 &&
                              renderImagePreviewGrid(commonSpaceImagePreviews, removeCommonSpaceImage)}
                            {commonSpaceVideoNames.length > 0 &&
                              renderVideoList(commonSpaceVideoNames, removeCommonSpaceVideo)}

                            {/* Combined Upload Button */}
                            {renderCombinedUpload(
                              "dropzone-common-space-media",
                              handleCommonSpaceImageChange,
                              handleCommonSpaceVideoChange,
                              commonSpaceImageInputRef,
                              commonSpaceImages.length,
                              commonSpaceVideos.length,
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Kitchen Question */}
              <FormField
                control={form.control}
                name="hasPrivateKitchen"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Have a private kitchen *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kitchen Upload Fields */}
              {hasPrivateKitchen === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 border-l-2 border-primary/20 pl-4"
                >
                  {/* Kitchen Media Upload */}
                  <FormField
                    control={form.control}
                    name="kitchenPhotos"
                    render={() => (
                      <FormItem>
                        <FormLabel>Kitchen Photos & Videos</FormLabel>
                        <FormDescription>
                          Upload photos and videos of your private kitchen.
                        </FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Combined Media Preview */}
                            {kitchenImagePreviews.length > 0 &&
                              renderImagePreviewGrid(kitchenImagePreviews, removeKitchenImage)}
                            {kitchenVideoNames.length > 0 &&
                              renderVideoList(kitchenVideoNames, removeKitchenVideoFn)}

                            {/* Combined Upload Button */}
                            {renderCombinedUpload(
                              "dropzone-kitchen-media",
                              handleKitchenImageChange,
                              handleKitchenVideoChange,
                              kitchenImageInputRef,
                              kitchenImages.length,
                              kitchenVideos.length,
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Public Bathroom Question */}
              <FormField
                control={form.control}
                name="hasPublicBathroom"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Have a public bathroom *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Public Bathroom Upload Fields */}
              {hasPublicBathroom === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 border-l-2 border-primary/20 pl-4"
                >
                  {/* Bathroom Floor Fields */}
                  <FormField
                    control={form.control}
                    name="publicBathroomFloors"
                    render={() => (
                      <FormItem>
                        <FormLabel>Floor?</FormLabel>
                        <FormDescription>Add the floors where public bathrooms are located</FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {bathroomFloors.map((floor, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={floor}
                                  onChange={(e) => updateBathroomFloor(index, e.target.value)}
                                  placeholder={`Floor ${index + 1}`}
                                  className="flex-1"
                                />
                                {index > 0 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeBathroomFloor(index)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                )}
                                {index === bathroomFloors.length - 1 && (
                                  <Button type="button" variant="outline" size="icon" onClick={addBathroomFloor}>
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Public Bathroom Media Upload */}
                  <FormField
                    control={form.control}
                    name="publicBathroomPhotos"
                    render={() => (
                      <FormItem>
                        <FormLabel>Public Bathroom Photos & Videos</FormLabel>
                        <FormDescription>
                          Upload photos and videos of the public bathroom.
                        </FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Combined Media Preview */}
                            {publicBathroomImagePreviews.length > 0 &&
                              renderImagePreviewGrid(publicBathroomImagePreviews, removePublicBathroomImage)}
                            {publicBathroomVideoNames.length > 0 &&
                              renderVideoList(publicBathroomVideoNames, removePublicBathroomVideo)}

                            {/* Combined Upload Button */}
                            {renderCombinedUpload(
                              "dropzone-public-bathroom-media",
                              handlePublicBathroomImageChange,
                              handlePublicBathroomVideoChange,
                              publicBathroomImageInputRef,
                              publicBathroomImages.length,
                              publicBathroomVideos.length,
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Public Common Space Question */}
              <FormField
                control={form.control}
                name="hasPublicCommonSpace"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Have a public common space / living room *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Public Common Space Upload Fields */}
              {hasPublicCommonSpace === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 border-l-2 border-primary/20 pl-4"
                >
                  {/* Common Space Floor Fields */}
                  <FormField
                    control={form.control}
                    name="publicCommonSpaceFloors"
                    render={() => (
                      <FormItem>
                        <FormLabel>Floor?</FormLabel>
                        <FormDescription>Add the floors where public common spaces are located</FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {commonSpaceFloors.map((floor, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={floor}
                                  onChange={(e) => updateCommonSpaceFloor(index, e.target.value)}
                                  placeholder={`Floor ${index + 1}`}
                                  className="flex-1"
                                />
                                {index > 0 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeCommonSpaceFloor(index)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                )}
                                {index === commonSpaceFloors.length - 1 && (
                                  <Button type="button" variant="outline" size="icon" onClick={addCommonSpaceFloor}>
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Public Common Space Media Upload */}
                  <FormField
                    control={form.control}
                    name="publicCommonSpacePhotos"
                    render={() => (
                      <FormItem>
                        <FormLabel>Public Common Space / Living Room Photos & Videos</FormLabel>
                        <FormDescription>
                          Upload photos and videos of the public common space or living room.
                        </FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Combined Media Preview */}
                            {publicCommonSpaceImagePreviews.length > 0 &&
                              renderImagePreviewGrid(publicCommonSpaceImagePreviews, removePublicCommonSpaceImage)}
                            {publicCommonSpaceVideoNames.length > 0 &&
                              renderVideoList(publicCommonSpaceVideoNames, removePublicCommonSpaceVideo)}

                            {/* Combined Upload Button */}
                            {renderCombinedUpload(
                              "dropzone-public-common-space-media",
                              handlePublicCommonSpaceImageChange,
                              handlePublicCommonSpaceVideoChange,
                              publicCommonSpaceImageInputRef,
                              publicCommonSpaceImages.length,
                              publicCommonSpaceVideos.length,
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Public Kitchen Question */}
              <FormField
                control={form.control}
                name="hasPublicKitchen"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Have a public kitchen *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Public Kitchen Upload Fields */}
              {hasPublicKitchen === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 border-l-2 border-primary/20 pl-4"
                >
                  {/* Kitchen Floor Fields */}
                  <FormField
                    control={form.control}
                    name="publicKitchenFloors"
                    render={() => (
                      <FormItem>
                        <FormLabel>Floor?</FormLabel>
                        <FormDescription>Add the floors where kitchens are located</FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {kitchenFloors.map((floor, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={floor}
                                  onChange={(e) => updateKitchenFloor(index, e.target.value)}
                                  placeholder={`Floor ${index + 1}`}
                                  className="flex-1"
                                />
                                {index > 0 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeKitchenFloor(index)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                )}
                                {index === kitchenFloors.length - 1 && (
                                  <Button type="button" variant="outline" size="icon" onClick={addKitchenFloor}>
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Public Kitchen Media Upload */}
                  <FormField
                    control={form.control}
                    name="publicKitchenPhotos"
                    render={() => (
                      <FormItem>
                        <FormLabel>Kitchen Photos & Videos</FormLabel>
                        <FormDescription>
                          Upload photos and videos of the public kitchen.
                        </FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Combined Media Preview */}
                            {publicKitchenImagePreviews.length > 0 &&
                              renderImagePreviewGrid(publicKitchenImagePreviews, removePublicKitchenImage)}
                            {publicKitchenVideoNames.length > 0 &&
                              renderVideoList(publicKitchenVideoNames, removePublicKitchenVideoFn)}

                            {/* Combined Upload Button */}
                            {renderCombinedUpload(
                              "dropzone-public-kitchen-media",
                              handlePublicKitchenImageChange,
                              handlePublicKitchenVideoChange,
                              publicKitchenImageInputRef,
                              publicKitchenImages.length,
                              publicKitchenVideos.length,
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Public Game Room Question */}
              <FormField
                control={form.control}
                name="hasPublicGameRoom"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Have a public game room *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Public Game Room Upload Fields */}
              {hasPublicGameRoom === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 border-l-2 border-primary/20 pl-4"
                >
                  {/* Game Room Floor Fields */}
                  <FormField
                    control={form.control}
                    name="publicGameRoomFloors"
                    render={() => (
                      <FormItem>
                        <FormLabel>Floor?</FormLabel>
                        <FormDescription>Add the floors where game rooms are located</FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {gameRoomFloors.map((floor, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={floor}
                                  onChange={(e) => updateGameRoomFloor(index, e.target.value)}
                                  placeholder={`Floor ${index + 1}`}
                                  className="flex-1"
                                />
                                {index > 0 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeGameRoomFloor(index)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                )}
                                {index === gameRoomFloors.length - 1 && (
                                  <Button type="button" variant="outline" size="icon" onClick={addGameRoomFloor}>
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Public Game Room Media Upload */}
                  <FormField
                    control={form.control}
                    name="publicGameRoomPhotos"
                    render={() => (
                      <FormItem>
                        <FormLabel>Game Room Photos & Videos</FormLabel>
                        <FormDescription>
                          Upload photos and videos of the public game room.
                        </FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Combined Media Preview */}
                            {publicGameRoomImagePreviews.length > 0 &&
                              renderImagePreviewGrid(publicGameRoomImagePreviews, removePublicGameRoomImage)}
                            {publicGameRoomVideoNames.length > 0 &&
                              renderVideoList(publicGameRoomVideoNames, removePublicGameRoomVideo)}

                            {/* Combined Upload Button */}
                            {renderCombinedUpload(
                              "dropzone-public-game-room-media",
                              handlePublicGameRoomImageChange,
                              handlePublicGameRoomVideoChange,
                              publicGameRoomImageInputRef,
                              publicGameRoomImages.length,
                              publicGameRoomVideos.length,
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Other Photos Question */}
              <FormField
                control={form.control}
                name="hasOtherPhotos"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Do you have any other dorm photos to upload? *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo and Video Upload Sections - Conditional */}
              {hasOtherPhotos === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Other Dorm Media Upload */}
                  <FormField
                    control={form.control}
                    name="photos"
                    render={() => (
                      <FormItem>
                        <FormLabel>Other Dorm Photos & Videos</FormLabel>
                        <FormDescription>
                          Upload any other photos and videos of your dorm to help future students.
                        </FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Combined Media Preview */}
                            {previewUrls.length > 0 && renderImagePreviewGrid(previewUrls, removeImage)}
                            {videoNames.length > 0 && renderVideoList(videoNames, removeVideo)}

                            {/* Combined Upload Button */}
                            {renderCombinedUpload(
                              "dropzone-other-media",
                              handleFileChange,
                              handleVideoChange,
                              fileInputRef,
                              uploadedImages.length,
                              uploadedVideos.length,
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Plaque Photo Upload Section */}
                  <FormField
                    control={form.control}
                    name="plaquePhoto"
                    render={() => (
                      <FormItem>
                        <FormLabel>Plaque Photo</FormLabel>
                        <FormDescription>If have it, but if not. Do not worry!</FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Plaque Preview */}
                            {plaquePreviews.length > 0 && (
                              <div className="mb-4">
                                <div className="relative group max-w-xs mx-auto">
                                  <div className="aspect-square rounded-md overflow-hidden border border-border">
                                    <img
                                      src={plaquePreviews[0] || "/placeholder.svg"}
                                      alt="Plaque photo"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={removePlaquePhoto}
                                    className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-4 w-4 text-foreground" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Upload Button */}
                            <div className="flex items-center justify-center w-full">
                              <label
                                htmlFor="dropzone-plaque"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-secondary/50 border-border"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                  <p className="mb-1 text-sm text-foreground font-medium">Click to upload photo</p>
                                  <p className="text-xs text-muted-foreground">or drag and drop</p>
                                </div>
                                <input
                                  id="dropzone-plaque"
                                  type="file"
                                  className="hidden"
                                  accept="image/png, image/jpeg, image/jpg, image/webp"
                                  onChange={handlePlaqueChange}
                                  ref={plaqueInputRef}
                                />
                              </label>
                            </div>

                            {/* Upload Status */}
                            <div className="text-sm text-muted-foreground">
                              {uploadedPlaquePhoto ? <p>Plaque photo selected</p> : <p>No plaque photo selected</p>}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Amenities Field */}
              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities</FormLabel>
                    <FormDescription>e.g. AC, bathroom with 2 sinks, and big mirror.</FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="List the amenities in your dorm room"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Comments Field */}
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormDescription>
                      e.g. Nice view, the shared bathroom has locks on both doors, and sometimes my neighbors would lock
                      my room out of the bathroom.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Share any additional comments about your dorm experience"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Student Email Field - Moved to bottom */}
              <FormField
                control={form.control}
                name="studentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Email *</FormLabel>
                    <p className="text-sm text-muted-foreground mb-2">
                      Confirm your student status to{" "}
                      <span className="font-bold">ensure every dorm photo is from a real student and authentic</span>.
                    </p>
                    <FormControl>
                      <Input placeholder="student@university.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={(e) => {
                    console.log('🔘 Test button clicked');
                    testServerConnection(e);
                  }}
                  className="flex-1"
                >
                  Test Server Connection
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Information"}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  )
}
