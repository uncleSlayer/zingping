import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  profilePicture: f(["image"])
    .onUploadComplete((data) => {
      console.log("file", data)
      return {  }
    }),

} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
