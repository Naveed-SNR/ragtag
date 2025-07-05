import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Navbar() {
  return (
    <div className="w-full flex items-center justify-between border-b-1 border-black bg-background px-8 py-3 relative top-0 left-0">
        <div className="relative ">
            <Image
                src="/logo.svg"
                alt="RAGtag Logo"
                width={100}
                height={100}
                className=" "
            />
        </div>
        <div>
            <Button>Upload</Button>
        </div>

    </div>
  )
}
