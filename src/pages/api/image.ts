// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const filePath = path.resolve("/tmp", req.query.id + ".jpg");
	console.log(req.headers, typeof req.body);

	if (req.method !== "POST") {
		if (!fs.existsSync(filePath)) {
			res.status(404).end();
			return;
		}

		const stat = fs.statSync(filePath);

		res.writeHead(200, {
			"Content-Type": "image/jpeg",
			"Content-Length": stat.size,
		});

		const readStream = fs.createReadStream(filePath);
		// We replaced all the event handlers with a simple call to readStream.pipe()
		readStream.pipe(res);
		return;
	}

	if (typeof req.query.id !== "string") {
		res.status(400).json({ error: "No id" });
		return;
	}

	try {
		res.writeHead(200, {
			"access-control-allow-origin": "*",
			"access-control-allow-headers": "*",
			"access-control-allow-methods": "*",
		});
		req.pipe(fs.createWriteStream(filePath)).once("close", () => {});
		res.end();
	} catch (error) {
		res.status(400).end(error?.toString());
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};
