import { Button } from "@/components/ui/button"
import Image from "next/image"
import Upload from "../Upload"
import { Icon } from "@iconify/react" 

export default function Navbar() {
  return (
    <>
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
          <Upload
            trigger={
              <Button className=" flex ps-1 pe-2 h-9 justify-center gap-0 items-center">
                <div className="border border-white/30 p-1 mr-2">
                  <Icon icon="fluent:arrow-upload-20-regular" width="21" height="21" />
                </div>
                Upload
              </Button >
            }
          />
        </div>
      </div>
    </>
  )
}
