import cloudinary from "@/lib/cloudinary";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs"; // ensure Node runtime for upload_stream

export async function POST(req) {
  // auth: only admins can upload
  const token = cookies().get("token")?.value;
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Admin only" }), {
      status: 403,
    });
  }

  try {
    const form = await req.formData();
    const file = form.get("file"); // name="file" from the form
    if (!file) return new Response("No file", { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const upload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: process.env.CLOUDINARY_FOLDER || "uploads",
            resource_type: "image",
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

    const result = await upload();

    return Response.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
