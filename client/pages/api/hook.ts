// import { isValidRequest } from "@sanity/webhook";
// import type { NextApiRequest, NextApiResponse } from "next";
import {} from "next";

// type Data = {
//   message: string;
// };

// const secret = process.env.NEXT_PUBLIC_SANITY_STUDIO_WEBHOOK_SECRET;

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   if (req.method !== "POST") {
//     console.error("Must be a POST request");
//     return res.status(401).json({ message: "Must be a POST request" });
//   }

//   if (!isValidRequest(req, secret)) {
//     res.status(401).json({ message: "Invalid signature" });
//     return;
//   }

//   try {
//     const {
//       body: { type, slug },
//     } = req;

//     switch (type) {
//       case "post":
//         await res.revalidate(`/news/${slug}`);
//         return res.json({
//           message: `Revalidated "${type}" with slug "${slug}"`,
//         });
//     }

//     return res.json({ message: "No managed type" });
//   } catch (err) {
//     return res.status(500).send({ message: "Error revalidating" });
//   }
// }

// // // Next.js will by default parse the body, which can lead to invalid signatures
// // export const config = {
// //   api: {
// //     bodyParser: false,
// //   },
// // };

// // async function readBody(readable) {
// //   const chunks = [];
// //   for await (const chunk of readable) {
// //     chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
// //   }
// //   return Buffer.concat(chunks).toString("utf8");
// // }
