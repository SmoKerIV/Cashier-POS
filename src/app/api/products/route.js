import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function setCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const cat = searchParams.get("cat");
  const query = searchParams.get("query");

  let whereClause = {};

  if (query) {
    whereClause = {
      name: {
        contains: query,
      },
    };
  }

  try {
    const products = await prisma.product.findMany({
      where: cat
        ? {
            categoryId: parseInt(cat),
            ...whereClause,
          }
        : whereClause,
      orderBy: {
        id: "asc",
      },
    });

    const response = new Response(JSON.stringify(products));
    return setCorsHeaders(response);
  } catch (error) {
    const response = new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      })
    );
    return setCorsHeaders(response);
  }
}

export async function POST(req) {
  const body = await req.json();

  try {
    const product = await prisma.product.create({
      data: {
        name: body.name,
        image: body.image,
        price: body.price,
        categoryId: body.categoryId,
      },
    });

    const response = new Response(
      JSON.stringify({
        success: true,
        product,
      })
    );
    return setCorsHeaders(response);
  } catch (error) {
    const response = new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      })
    );
    return setCorsHeaders(response);
  }
}