'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import authFormImage from '@/public/jason-leung-mZNRsYE9Qi4-unsplash.jpg'
import React from "react"
import { set, z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import Link from "next/link"
import ProfilePictureUploadButtonComponent from "./ProfilePictureUploadButton"

export function RegisterationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [profileImageUrl, setProfileImageUrl] = React.useState("")

  const signupSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setProfileImageUrl("")
  }

  const router = useRouter()

  const signup = async (data: {
    email: string;
    password: string;
  }) => {

    const { email, password } = data

    const parsedData = signupSchema.parse({ email, password })

    if (!parsedData) {

      toast("Format of email or password is incorrect")

    } else {

      const response = await axios.post("http://localhost:8080/auth/register", {
        email,
        password,
        profileImageUrl
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (response.status === 200) {
        resetForm()
        toast(response.data.message)

        setTimeout(() => {
          router.push("/")
        }, 1000);

      } else {

        toast(response.data.message)

      }

      console.log(data)

    }

  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Create a Zingping account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" placeholder="••••••••" required />
              </div>
              <div className="flex flex-col items-start">
                <div>
                  <Label htmlFor="profileImageUrl">Profile Image</Label>
                </div>
                {
                  profileImageUrl.length === 0 && <ProfilePictureUploadButtonComponent setProfileImageUrl={setProfileImageUrl} />
                }
                {
                  profileImageUrl.length > 0 && <img src={profileImageUrl} alt="Profile Image" className="w-20 h-20 object-cover rounded-md" />
                }
              </div>
              <Button onClick={(e) => {
                e.preventDefault()
                signup({ email, password })
              }} type="submit" className="w-full">
                Sign up
              </Button>
              <div className="text-center text-sm">
                already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={authFormImage.src}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
